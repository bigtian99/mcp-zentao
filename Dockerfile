FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装必要的构建工具
RUN apk add --no-cache python3 make g++

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建 TypeScript 代码
RUN npm run build

# 生产环境镜像
FROM node:18-alpine

WORKDIR /app

# 复制构建产物和必要文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# 只安装生产依赖
RUN npm ci --only=production

# 设置环境变量
ENV NODE_ENV=production \
    MCP_SERVER_PORT=3000 \
    ZENTAO_URL="" \
    ZENTAO_USERNAME="" \
    ZENTAO_PASSWORD="" \
    ZENTAO_API_VERSION="v1"

# 暴露 MCP 服务端口
EXPOSE 3000

# 启动 MCP STDIO 服务
CMD ["node", "dist/server.js"] 