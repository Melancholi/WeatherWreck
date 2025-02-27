ARG NODE_VERSION=20.9.0
FROM node:$NODE_VERSION

WORKDIR /seed

COPY package.json package-lock.json ./

RUN npm ci

COPY .env db/db.mjs util ./ 

CMD ["node", "seed.js"]
