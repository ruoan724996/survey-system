FROM node:18-alpine

WORKDIR /app

# 复制 backend 目录
COPY backend/ ./backend/

WORKDIR /app/backend

# 安装依赖
RUN npm install --production

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["npm", "start"]
