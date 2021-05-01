# build stage
FROM node:lts-alpine as build-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn build
EXPOSE 8003
CMD ["node", "dist/main.js"]