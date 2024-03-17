FROM node:20
WORKDIR /usr/src/api
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD [ "node", "dist/server/index.js" ]
