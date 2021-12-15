# dora

## 简介

dora 是一套前端监控系统，该仓库为服务端部分。

## 开发调试

```bash
# 克隆仓库
git clone https://github.com/dora-projects/dora-server.git

cd dora-server

# 按需修改配置
cp .env.example .env

# 启动开发环境 mysql es redis
docker-compose up -d

# 安装依赖
npm install

# 同步数据库 表
npx prisma db push

# 启动服务
npm run start
```

### 模块

- [apps/manager](./apps/manager): manager 为控制台提供接口
- [apps/process](./apps/process): process 处理 queue 中数据，存入 es 、检查告警规则等
- [apps/relay](./apps/relay): relay 接收 sdk 上报数据，检验数据

## License

This project is licensed under the terms of the [MIT License](https://github.com/dora-projects/dora-server/blob/master/LICENSE).
