FROM node:14-alpine as dependencies
WORKDIR /dora
COPY package.json ./
RUN yarn install

# ------------------------------------
FROM node:14-alpine as builder
WORKDIR /dora
COPY . .
COPY --from=dependencies /dora/node_modules ./node_modules
RUN yarn build

# ------------------------------------
FROM node:14-alpine as runner
LABEL maintainer="chenyueban <jasonchan0527@gmail.com>"
WORKDIR /dora
ENV NODE_ENV production

COPY package.json ./
RUN yarn install
COPY --from=builder /dist/apps  /dora/apps

# default
ENTRYPOINT [ "node", "./apps/manager/main.js"]
