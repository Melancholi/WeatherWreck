ARG NODE_VERSION='20.9.0'
FROM node:{$NODE_VERSION}-alpine

COPY ./package**-json ./seed

RUN npm ci

COPY [ "./.env", "./db/db.mjs", "./util/"] ./seed

WORKDIR /seed

CMD ["node", "seed.js"]