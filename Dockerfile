FROM node:14 as builder
WORKDIR /server
COPY package.json ./
# RUN yarn install
RUN yarn install --registry https://registry.npm.taobao.org/
COPY . .
RUN yarn build

FROM node:14 as runner
LABEL maintainer="nan <msg@nancode.cn>"
WORKDIR /server

COPY --from=builder /server/dist/apps  /server
COPY --from=builder /server/package.json  /server
RUN yarn install --production --registry https://registry.npm.taobao.org/

# default
ENTRYPOINT [ "node", "./manager/main.js"]
