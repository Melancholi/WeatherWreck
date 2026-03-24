/* eslint-disable camelcase */
/* eslint-disable max-len */
import { db } from '../db/dbv2.mjs';
import cache from 'memory-cache';

/**
 * V2 API Controller with Pagination Support
 * Uses optimized DBv2 class for better performance
 */

/**
 * Retrieve all accidents with pagination
 * Supports both offset/limit and cursor-based pagination
 * @async
 * @param {Object} req - Request object with query parameters
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export async function getAccidents(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const cursor = req.query.cursor || null;
    // eslint-disable-next-line max-len
    const cacheKey = `v2_all_accidents_limit_${limit}_${cursor ? `cursor_${cursor}` : `offset_${offset}`}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      console.log('✓ Cache hit for all accidents');
      return res.status(200).json(cachedData);
    }
    
    const result = await db.fetchEventsAndAccidentsWithCursor({} ,limit, cursor);
    if (result.data.length === 0) {
      return res.status(404).json({ error: 'No accidents found' });
    }

    cache.put(cacheKey, result);
    res.set({ 'Cache-Control': 'max-age=31536000' });
    res.status(200).json(result);
  } catch (error) {
    console.error('✗ Error in getAccidents:', error.message);
    next(res.status(500).json({ error: error.message }));
  }
}

/**
 * Retrieve accidents by state with pagination
 * @async
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export async function getAccidentsByState(req, res, next) {
  try {
    const state = req.params.state.toUpperCase();
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const cursor = req.query.cursor || null;

    const cacheKey = `v2_state_${state}_limit_${limit}_${cursor ? `cursor_${cursor}` : `offset_${offset}`}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log(`✓ Cache hit for state ${state}`);
      return res.status(200).json(cachedData);
    }

    const result = await db.fetchEventsAndAccidentsWithCursor(
      { State: { $eq: state } },
      limit,
      cursor
    );

    if (result.data.length === 0) {
      return res.status(404).json({ error: `No accidents found for ${state}` });
    }

    cache.put(cacheKey, result);
    res.set({ 'Cache-Control': 'max-age=31536000' });
    res.status(200).json(result);
  } catch (error) {
    console.error('✗ Error in getAccidentsByState:', error.message);
    next(res.status(500).json({ error: error.message }));
  }
}

/**
 * Retrieve accidents by date with pagination
 * @async
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export async function getAccidentsByDate(req, res, next) {
  try {
    const date = req.params.date;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const cursor = req.query.cursor || null;

    const cacheKey = `v2_date_${date}_limit_${limit}_${cursor ? `cursor_${cursor}` : `offset_${offset}`}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log(`✓ Cache hit for date ${date}`);
      return res.status(200).json(cachedData);
    }

    const result = await db.fetchEventsAndAccidentsWithCursor(
      { Date: { $eq: date } },
      limit,
      cursor
    );
    if (result.data.length === 0) {
      return res.status(404).json({ error: `No accidents found for ${date}` });
    }

    cache.put(cacheKey, result);
    res.set({ 'Cache-Control': 'max-age=31536000' });
    res.status(200).json(result);
  } catch (error) {
    console.error('✗ Error in getAccidentsByDate:', error.message);
    next(res.status(500).json({ error: error.message }));
  }
}

/**
 * Retrieve accidents by weather severity with pagination
 * @async
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export async function getAccidentsBySeverity(req, res, next) {
  try {
    const severity = req.params.severity;
    const camelCaseSeverity = severity[0].toUpperCase() + severity.slice(1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const cursor = req.query.cursor || null;

    const cacheKey = `v2_severity_${camelCaseSeverity}_limit_${limit}_${cursor ? `cursor_${cursor}` : `offset_${offset}`}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log(`✓ Cache hit for severity ${camelCaseSeverity}`);
      return res.status(200).json(cachedData);
    }

    const result = await db.fetchEventsAndAccidentsWithCursor(
      { Severity: { $eq: camelCaseSeverity } },
      limit,
      cursor
    );

    if (result.data.length === 0) {
      return res.status(404).json({
        error: `No accidents found for severity ${severity}`
      });
    }

    cache.put(cacheKey, result);
    res.set({ 'Cache-Control': 'max-age=31536000' });
    res.status(200).json(result);
  } catch (error) {
    console.error('✗ Error in getAccidentsBySeverity:', error.message);
    next(res.status(500).json({ error: error.message }));
  }
}

/**
 * Retrieve accidents by weather type with pagination
 * @async
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export async function getAccidentsByType(req, res, next) {
  try {
    const type = req.params.type;
    const camelCaseType = type[0].toUpperCase() + type.slice(1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const cursor = req.query.cursor || null;

    const cacheKey = `v2_type_${camelCaseType}_limit_${limit}_${cursor ? `cursor_${cursor}` : `offset_${offset}`}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log(`✓ Cache hit for type ${camelCaseType}`);
      return res.status(200).json(cachedData);
    }

    const result = await db.fetchEventsAndAccidentsWithCursor(
      { Type: { $eq: camelCaseType } },
      limit,
      cursor
    );

    if (result.data.length === 0) {
      return res.status(404).json({ error: `No accidents found for type ${type}` });
    }

    cache.put(cacheKey, result);
    res.set({ 'Cache-Control': 'max-age=31536000' });
    res.status(200).json(result);
  } catch (error) {
    console.error('✗ Error in getAccidentsByType:', error.message);
    next(res.status(500).json({ error: error.message }));
  }
}

/**
 * Retrieve detailed information for a specific accident
 * @async
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export async function getAccidentDetails(req, res, next) {
  try {
    const accidentId = req.params.accident_id;
    const weatherId = req.params.weather_id;
    const cacheKey = `v2_details_${accidentId}_${weatherId}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log(`✓ Cache hit for accident ${accidentId}`);
      return res.status(200).json(cachedData);
    }

    const result = await db.fetchEventsAndAccidents({
      Weather_Key: { $eq: weatherId }
    });

    if (result.length === 0) {
      return res.status(404).json({ error: `No details found for ${weatherId}` });
    }

    const filteredAccident = result.find((accident) => accident.AccidentID === accidentId);

    if (!filteredAccident) {
      return res.status(404).json({
        error: `No accident found matching ID ${accidentId}`
      });
    }

    cache.put(cacheKey, filteredAccident);
    res.set({ 'Cache-Control': 'max-age=31536000' });
    res.status(200).json(filteredAccident);
  } catch (error) {
    console.error('✗ Error in getAccidentDetails:', error.message);
    next(res.status(500).json({ error: error.message }));
  }
}
