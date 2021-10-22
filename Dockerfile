FROM node:14-alpine as dependencies
WORKDIR /app
COPY package.json ./
RUN yarn install

# ------------------------------------
FROM node:14-alpine as builder
WORKDIR /app
COPY . .
COPY --from=dependencies /dora/node_modules ./node_modules
RUN yarn build

# ------------------------------------
FROM node:14-alpine as runner
LABEL maintainer="nan <msg@nancode.cn>"
WORKDIR /dora
ENV NODE_ENV production

COPY package.json ./
RUN yarn install
COPY --from=builder /app/dist/apps  /dora

# default
ENTRYPOINT [ "node", "./manager/main.js"]
