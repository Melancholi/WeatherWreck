/* eslint-disable camelcase */
import 'dotenv/config';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

let instance = null;

/**
 * Optimized Database class for V2 API
 * Features:
 * - Reusable aggregation pipelines
 * - Connection pooling with retry logic
 * - Query profiling and explain for debugging
 * - Pagination (Cursor and offset)
 * 
 */
class DBv2 {
  // Collection name constants to avoid typos
  static COLLECTIONS = {
    WEATHER: 'WeatherForecast',
    ACCIDENTS: 'CarAccidents'
  };

  // Reusable aggregation pipeline stages
  static STAGES = {
    // Project stage that transforms weather/accident data with $map
    // Used in all aggregations to maintain consistent output format
    ACCIDENT_PROJECT: {
      $project: {
        matchingAccidents: {
          $map: {
            input: '$matchingAccidents',
            as: 'accident',
            in: {
              _id: { $toString: '$_id' },
              AccidentID: '$$accident.Accident_Key',
              WeatherID: '$Weather_Key',
              Weather_Condition: '$Type',
              Weather_Severity: '$Severity',
              Accident_Severity: '$$accident.Severity',
              Description: '$$accident.Description',
              Start_Time: '$$accident.Start_Time',
              End_Time: '$$accident.End_Time',
              State: '$State',
              City: '$City',
              Date: '$Date',
              Coordinates: '$$accident.Start_Point'
            }
          }
        }
      }
    },

    // Flatten the matchingAccidents array into individual documents
    UNWIND: { $unwind: '$matchingAccidents' },

    // Return the accident document as the root
    REPLACE_ROOT: { $replaceRoot: { newRoot: '$matchingAccidents' } }
  };

  constructor() {
    if (!instance) {
      instance = this;
      this.client = null;
      this.db = null;
      this.collections = new Map();
      this.isConnected = false;
    }
    return instance;
  }

  /**
   * Establishes connection to MongoDB with optimized settings
   * Reference: https://docs.mongodb.com/manual/reference/connection-string/
   * @param {string} dbName - Database name
   * @param {string} dburl - Connection string (default from env)
   */
  async connect(dbName, dburl = process.env.ATLAS_URI) {
    if (this.isConnected) {
      return;
    }

    const mongoOptions = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 10,                 // Connection pooling
      minPoolSize: 5,
      retryWrites: true,                // Automatic retry
      retryReads: true,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    try {
      this.client = new MongoClient(dburl, mongoOptions);
      await instance.client.connect();
      instance.db = await instance.client.db(dbName);

      // Verify connection
      await instance.client.db(dbName).command({ ping: 1 });
      this.isConnected = true;

      console.log(`Connection Established to MongoDB: ${dbName}`);
    } catch (error) {
      console.error(`Failed to connect to MongoDB: ${error.message}`);
      throw error;
    }
  }

  /**
   * Opens a collection and caches it
   * @param {string} collName - Collection name
   */
  async open(collName) {
    if (!instance.db) {
      throw new Error(`Database not connected, unable to open ${collName}`);
    }

    if (this.collections.has(collName)) {
      return this.collections.get(collName);
    }

    const collection = await instance.db.collection(collName);
    instance.collections.set(collName, collection);

    console.log(`Collection ${collName} opened in ${instance.db.databaseName}`);
    return collection;
  }

  /**
   * Closes database connection and clears state
   */
  async close() {
    if (instance.db && this.client) {
      await instance.client.close();
      instance.db = null;
      instance.collections.clear();
      this.isConnected = false;
      console.log('Database connection closed');
    }
  }

  /**
   * Creates a lookup stage for joining CarAccidents
   * Encapsulates the complex $lookup logic
   * @param {string} stateVar - State variable name from outer pipeline
   * @param {string} dateVar - Date variable name from outer pipeline
   * @returns {Object} Lookup stage
   */
  getLookupAccidentsPipeline(stateVar = '$State', dateVar = '$Date') {
    return {
      $lookup: {
        from: DBv2.COLLECTIONS.ACCIDENTS,
        let: { eventState: stateVar, eventDate: dateVar },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$State', '$$eventState'] },
                  { $eq: ['$Date', '$$eventDate'] }
                ]
              }
            }
          },
          { $limit: 2 }
        ],
        as: 'matchingAccidents'
      }
    };
  }

  /**
   * Builds a reusable aggregation pipeline for accident queries
   * @param {Object} matchStage - Initial $match filter
   * @param {Array} additionalStages - Extra stages to append
   * @returns {Array} Complete aggregation pipeline
   */
  buildAccidentAggregation(matchStage = {}, additionalStages = []) {
    return [
      { $match: matchStage },
      this.getLookupAccidentsPipeline(),
      DBv2.STAGES.ACCIDENT_PROJECT,
      ...additionalStages,
      DBv2.STAGES.UNWIND,
      DBv2.STAGES.REPLACE_ROOT
    ];
  }

  /**
   * Executes aggregation pipeline with error handling
   * @param {string} collName - Collection name
   * @param {Array} pipeline - Aggregation pipeline
   * @returns {Promise<Array>} Query results
   */
  async executeAggregation(collName, pipeline) {
    const collection = instance.collections.get(collName);
    if (!collection) {
      throw new Error(`Collection ${collName} not opened`);
    }

    try {
      return await collection.aggregate(pipeline).toArray();
    } catch (error) {
      console.error(`Aggregation error in ${collName}:`, error.message);
      throw error;
    }
  }

  /**
   * Profiles query execution time
   * @Note This is simply to monitor perfomance of the query
   * @param {string} label - Label for logging
   * @param {Function} fn - Async function to profile
   * @returns {Promise<any>} Function result
   */
  async profile(label, fn) {
    const startTime = process.hrtime.bigint();
    try {
      const result = await fn();
      const endTime = process.hrtime.bigint();
      const durationMs = Number(endTime - startTime) / 1_000_000;

      console.log(`${label}: ${durationMs.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const endTime = process.hrtime.bigint();
      const durationMs = Number(endTime - startTime) / 1_000_000;
      console.error(`${label} failed after ${durationMs.toFixed(2)}ms:`, error.message);
      throw error;
    }
  }

  /**
   * Inserts a single document
   * @param {string} collName - Collection name
   * @param {Object} document - Document to insert
   * @returns {Promise<Object>} Insert result
   */
  async create(collName, document) {
    const collection = instance.collections.get(collName);
    if (!collection) {
      throw new Error(`Collection ${collName} not opened`);
    }
    return await collection.insertOne(document);
  }

  /**
   * Inserts multiple documents
   * @param {string} collName - Collection name
   * @param {Array} documents - Documents to insert
   * @returns {Promise<Object>} Insert result
   */
  async createMany(collName, documents) {
    const collection = instance.collections.get(collName);
    if (!collection) {
      throw new Error(`Collection ${collName} not opened`);
    }
    return await collection.insertMany(documents);
  }

  /**
   * Fetches accident data from all 50 states
   * Groups by state to ensure coverage, then looks up matching accidents
   * @returns {Promise<Array>} Formatted accident data from all states
   */
  async generalFetchEventsAndAccidents() {
    const pipeline = this.buildAccidentAggregation({}, [
      {
        $group: {
          _id: '$State',
          weatherEvent: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: '$weatherEvent' } },
      this.getLookupAccidentsPipeline(),
      DBv2.STAGES.ACCIDENT_PROJECT,
      DBv2.STAGES.UNWIND,
      DBv2.STAGES.REPLACE_ROOT
    ]);

    return await this.profile(
      'generalFetchEventsAndAccidents',
      () => this.executeAggregation(DBv2.COLLECTIONS.WEATHER, pipeline)
    );
  }

  /**
   * Fetches accident data based on query filter
   * Supports filtering by State, Date, Weather Type, Severity
   * @param {Object} query - MongoDB query filter
   * @returns {Promise<Array>} Formatted accident data
   */
  async fetchEventsAndAccidents(query = {}) {
    const pipeline = this.buildAccidentAggregation(query, [{ $limit: 2 }]);

    return await this.profile(
      'fetchEventsAndAccidents',
      () => this.executeAggregation(DBv2.COLLECTIONS.WEATHER, pipeline)
    );
  }

  /**
   * Fetches accident data with pagination support
   * Uses offset/limit for flexible page access
   * @Note Much slower than cursor approach
   * @param {Object} query - MongoDB query filter
   * @param {number} limit - Number of results per page
   * @param {number} offset - Number of results to skip
   * @returns {Promise<Object>} Formatted accident data with pagination metadata
   */
  async fetchEventsAndAccidentsWithPagination(query = {}, limit = 20, offset = 0) {
    const weatherWindowSize = offset + limit + 1;

    const pipeline = [
      { $match: query },
      { $sort: { _id: 1 } },
      { $limit: weatherWindowSize },
      this.getLookupAccidentsPipeline(),
      DBv2.STAGES.ACCIDENT_PROJECT,
      DBv2.STAGES.UNWIND,
      DBv2.STAGES.REPLACE_ROOT,
      { $skip: offset },
      { $limit: limit + 1 }
    ];

    //Profile: This is simply to monitor perfomance of the query
    const results = await this.profile(
      `fetchWithPagination(offset=${offset}, limit=${limit})`,
      () => this.executeAggregation(DBv2.COLLECTIONS.WEATHER, pipeline)
    );

    const hasMore = results.length > limit;
    const data = hasMore ? results.slice(0, limit) : results;

    return {
      data,
      pagination: {
        limit,
        offset,
        hasMore,
        nextOffset: hasMore ? offset + limit : null,
        returned: data.length
      }
    };
  }

  /**
   * Fetches accident data with cursor-based pagination
   * @param {Object} query - MongoDB query filter
   * @param {number} limit - Number of results per page
   * @param {string} cursor - Cursor position (document ID)
   * @returns {Promise<Object>} Formatted accident data with cursor metadata
   */
  async fetchEventsAndAccidentsWithCursor(query = {}, limit = 20, cursor = null) {
    const matchStage = cursor
      ? { ...query, _id: { $gt: new ObjectId(cursor) } }
      : query;

    const pipeline = [
      { $match: matchStage },
      { $sort: { _id: 1 } },
      { $limit: (limit * 2) + 1 },
      this.getLookupAccidentsPipeline(),
      DBv2.STAGES.ACCIDENT_PROJECT,
      DBv2.STAGES.UNWIND,
      DBv2.STAGES.REPLACE_ROOT,
      { $limit: limit + 1 }
    ];

    //Profile: This is simply to monitor perfomance of the query
    const results = await this.profile(
      `fetchWithCursor(cursor=${cursor?.substring(0, 8)}..., limit=${limit})`,
      () => this.executeAggregation(DBv2.COLLECTIONS.WEATHER, pipeline)
    );

    const hasMore = results.length > limit;
    const data = hasMore ? results.slice(0, limit) : results;
    const nextCursor = hasMore ? data[data.length - 1]?._id : null;
    
    return {
      data,
      pagination: {
        limit,
        hasMore,
        nextCursor,
        returned: data.length
      }
    };
  }

  /**
   * Fetches one representative weather event per state and up to 2 accidents for each state.
   * Cursor pagination is based on the grouped weather document IDs (one per state).
   * @deprecated Inefficient, while testing lead to 11000ms fetch times
   * @param {number} limit - Number of states per page
   * @param {string|null} cursor - Last seen grouped weather document ID
   * @returns {Promise<Object>} Paginated all-states accident results
   */
  async fetchGeneralEventsAndAccidentsWithCursor(limit = 20, cursor = null) {
    const weatherCursorStages = cursor
      ? [{ $match: { _id: { $gt: new ObjectId(cursor) } } }]
      : [];

    const pipeline = [
      { $sort: { _id: 1 } },
      {
        $group: {
          _id: '$State',
          weatherEvent: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: '$weatherEvent' } },
      ...weatherCursorStages,
      { $sort: { _id: 1 } },
      { $limit: limit + 1 },
      this.getLookupAccidentsPipeline(),
      DBv2.STAGES.ACCIDENT_PROJECT,
      DBv2.STAGES.UNWIND,
      DBv2.STAGES.REPLACE_ROOT
    ];

    const results = await this.profile(
      `fetchGeneralWithCursor(cursor=${cursor?.substring(0, 8)}..., limit=${limit})`,
      () => this.executeAggregation(DBv2.COLLECTIONS.WEATHER, pipeline)
    );

    // Determine page boundaries by grouped weather IDs so each state keeps up to 2 accidents.
    const statePageIds = [];
    for (const row of results) {
      if (!statePageIds.includes(row._id)) {
        statePageIds.push(row._id);
      }
    }

    const hasMore = statePageIds.length > limit;
    const visibleStateIds = hasMore ? statePageIds.slice(0, limit) : statePageIds;
    const visibleStateIdSet = new Set(visibleStateIds);
    const data = results.filter((row) => visibleStateIdSet.has(row._id));
    const nextCursor = hasMore ? visibleStateIds[visibleStateIds.length - 1] : null;

    return {
      data,
      pagination: {
        limit,
        hasMore,
        nextCursor,
        returned: data.length
      }
    };
  }
}

export const db = new DBv2();
