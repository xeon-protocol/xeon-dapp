# stage 1: build the app
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# stage 2: serve the app
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/build ./build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build"]