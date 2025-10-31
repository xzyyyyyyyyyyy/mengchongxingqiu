# 萌宠星球 - 部署指南

本指南将帮助您部署萌宠星球应用到生产环境。

## 前置条件

- Node.js >= 18.0.0
- MongoDB >= 6.0
- Git

## 生产环境配置

### 1. 后端配置

1. 克隆仓库到服务器：
```bash
git clone https://github.com/xzyyyyyyyyyyy/mengchongxingqiu.git
cd mengchongxingqiu/backend
```

2. 安装依赖：
```bash
npm install --production
```

3. 配置环境变量（创建 `.env` 文件）：
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-mongodb-server:27017/mengchongxingqiu
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-domain.com

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

4. 创建管理员账号和初始数据：
```bash
npm run seed
```

5. 启动应用（使用 PM2）：
```bash
npm install -g pm2
pm2 start src/server.js --name mengchong-backend
pm2 save
pm2 startup
```

### 2. 前端配置

1. 进入前端目录：
```bash
cd ../frontend
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量（创建 `.env.production` 文件）：
```env
VITE_API_URL=https://your-backend-domain.com/api
```

4. 构建生产版本：
```bash
npm run build
```

5. 部署构建产物（`dist` 目录）到静态文件服务器（如 Nginx、Apache 或云服务）

### 3. Nginx 配置示例

```nginx
# 后端 API
server {
    listen 80;
    server_name api.mengchong.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# 前端
server {
    listen 80;
    server_name mengchong.com;
    root /var/www/mengchong/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 数据库备份

建议定期备份 MongoDB 数据库：

```bash
# 备份
mongodump --uri="mongodb://localhost:27017/mengchongxingqiu" --out=/backup/$(date +%Y%m%d)

# 恢复
mongorestore --uri="mongodb://localhost:27017/mengchongxingqiu" /backup/20240101
```

## 监控和日志

### 使用 PM2 查看日志：

```bash
# 查看所有日志
pm2 logs

# 查看特定应用日志
pm2 logs mengchong-backend

# 清除日志
pm2 flush
```

### 性能监控：

```bash
# 查看应用状态
pm2 status

# 查看详细信息
pm2 show mengchong-backend

# 实时监控
pm2 monit
```

## 安全建议

1. **更改默认密码**：首次部署后立即修改管理员密码
2. **使用 HTTPS**：配置 SSL 证书（推荐使用 Let's Encrypt）
3. **防火墙配置**：只开放必要的端口（80, 443）
4. **定期更新**：保持依赖包和系统的更新
5. **环境变量保护**：确保 `.env` 文件不被提交到版本控制
6. **数据库访问控制**：配置 MongoDB 认证和访问限制
7. **速率限制**：考虑添加 API 请求速率限制

## 性能优化

1. **启用 gzip 压缩**（Nginx）
2. **配置 CDN** 用于静态资源
3. **数据库索引优化**：确保常用查询字段有索引
4. **缓存策略**：使用 Redis 缓存热点数据
5. **图片优化**：压缩和优化上传的图片

## 故障排查

### 后端无法启动

1. 检查 MongoDB 是否运行：
```bash
systemctl status mongod
```

2. 检查端口是否被占用：
```bash
lsof -i :5000
```

3. 查看错误日志：
```bash
pm2 logs mengchong-backend --lines 100
```

### 前端无法访问后端

1. 检查 CORS 配置
2. 验证环境变量中的 API URL
3. 检查网络防火墙规则

## 扩展部署

对于高流量场景，考虑：

1. **负载均衡**：使用多个后端实例 + Nginx 负载均衡
2. **数据库集群**：配置 MongoDB 副本集
3. **缓存层**：添加 Redis 缓存
4. **静态资源分离**：使用 CDN 服务
5. **微服务架构**：根据需要拆分服务

## 维护计划

- **每日**：检查应用状态和错误日志
- **每周**：审查性能指标和用户反馈
- **每月**：更新依赖包和安全补丁
- **每季度**：数据库优化和清理
