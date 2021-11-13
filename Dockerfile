FROM node:14-alpine as builder
WORKDIR /server
COPY package.json ./
RUN yarn install
#RUN yarn install --registry https://registry.npm.taobao.org/
COPY . .
RUN yarn build

FROM node:14-alpine as runner
LABEL maintainer="nan <msg@nancode.cn>"
WORKDIR /server

RUN apk add tzdata && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone

COPY --from=builder /server/dist/apps  /server
COPY --from=builder /server/package.json  /server
RUN yarn install --production
#RUN yarn install --production --registry https://registry.npm.taobao.org/

# default
ENTRYPOINT [ "node", "./manager/main.js"]
