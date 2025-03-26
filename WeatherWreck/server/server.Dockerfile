FROM node:20-bullseye-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 3001

USER node

CMD ["node", "bin/www.js"]
