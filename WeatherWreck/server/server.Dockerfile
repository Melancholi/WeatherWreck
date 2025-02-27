ARG node_version=20.9.0

FROM node:$node_version

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3001

CMD ["node", "bin/www.js"]
