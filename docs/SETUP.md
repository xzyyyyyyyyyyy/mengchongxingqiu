# 萌宠星球 - 安装和配置指南

## 系统要求

- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm 或 yarn
- 操作系统: Linux, macOS, or Windows

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/xzyyyyyyyyyyy/mengchongxingqiu.git
cd mengchongxingqiu
```

### 2. 安装 MongoDB

#### macOS (使用 Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0
```

#### Ubuntu/Debian
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### Windows
从 [MongoDB官网](https://www.mongodb.com/try/download/community) 下载并安装

#### 使用 Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:6.0
```

### 3. 配置后端

```bash
cd backend

# 安装依赖
npm install

# 复制环境变量配置文件
cp .env.example .env

# 编辑 .env 文件，配置以下参数：
# - MONGODB_URI: MongoDB连接字符串
# - JWT_SECRET: JWT密钥（请设置一个强密码）
# - PORT: 后端服务端口（默认5000）

# 启动开发服务器
npm run dev
```

后端服务将运行在 `http://localhost:5000`

### 4. 配置前端

打开新的终端窗口：

```bash
cd frontend

# 安装依赖
npm install

# 复制环境变量配置文件
cp .env.example .env

# 启动开发服务器
npm run dev
```

前端服务将运行在 `http://localhost:3000`

### 5. 访问应用

在浏览器中打开 `http://localhost:3000`，即可开始使用萌宠星球！

## 环境变量说明

### 后端环境变量 (backend/.env)

```env
NODE_ENV=development                    # 运行环境 (development/production)
PORT=5000                               # 后端服务端口
MONGODB_URI=mongodb://localhost:27017/mengchongxingqiu  # MongoDB连接字符串
JWT_SECRET=your-secret-key              # JWT密钥（生产环境必须修改）
JWT_EXPIRE=7d                           # JWT过期时间
CORS_ORIGIN=http://localhost:3000       # 允许的前端域名
MAX_FILE_SIZE=10485760                  # 最大文件上传大小（字节）
UPLOAD_PATH=./uploads                   # 文件上传路径
```

### 前端环境变量 (frontend/.env)

```env
VITE_API_URL=http://localhost:5000/api  # 后端API地址
```

## 数据库初始化

首次启动时，MongoDB会自动创建数据库。你也可以手动创建一些测试数据：

```bash
# 连接到MongoDB
mongosh

# 切换到数据库
use mengchongxingqiu

# 创建测试用户（可选）
# 注意：密码会在用户注册时自动加密
```

## 生产环境部署

### 1. 构建前端

```bash
cd frontend
npm run build
```

构建产物将在 `frontend/dist` 目录中

### 2. 配置Nginx（可选）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端API代理
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 上传文件
    location /uploads {
        proxy_pass http://localhost:5000;
    }
}
```

### 3. 使用PM2运行后端

```bash
# 安装PM2
npm install -g pm2

cd backend

# 生产环境配置
cp .env.example .env
# 编辑 .env，设置 NODE_ENV=production

# 使用PM2启动
pm2 start src/server.js --name "mengchongxingqiu-api"

# 设置开机自启
pm2 startup
pm2 save
```

### 4. MongoDB生产配置

生产环境建议：
- 启用身份验证
- 配置复制集以提高可用性
- 定期备份数据
- 配置防火墙规则

```bash
# 创建管理员用户
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "your-strong-password",
  roles: ["root"]
})

# 创建应用数据库用户
use mengchongxingqiu
db.createUser({
  user: "mengchong_user",
  pwd: "your-app-password",
  roles: ["readWrite"]
})
```

更新 `backend/.env` 中的 MongoDB URI：
```
MONGODB_URI=mongodb://mengchong_user:your-app-password@localhost:27017/mengchongxingqiu
```

## 常见问题

### Q: 启动后端时提示无法连接MongoDB

**A:** 确保MongoDB服务正在运行：
```bash
# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod

# Docker
docker ps | grep mongodb
```

### Q: 前端无法连接后端API

**A:** 检查：
1. 后端服务是否正在运行
2. `.env` 文件中的 `VITE_API_URL` 是否正确
3. 浏览器控制台是否有CORS错误
4. 防火墙是否阻止了端口

### Q: 文件上传失败

**A:** 检查：
1. `backend/uploads` 目录是否存在且有写入权限
2. 文件大小是否超过 `MAX_FILE_SIZE` 限制
3. 文件类型是否被允许

### Q: JWT Token无效或过期

**A:** 
1. 清除浏览器localStorage
2. 重新登录
3. 确保前后端使用相同的JWT_SECRET

## 开发技巧

### 热重载

- 后端：使用 `npm run dev` 启动nodemon，代码修改后自动重启
- 前端：Vite自动热重载，保存后即时看到效果

### 调试

后端调试：
```bash
# 使用Node.js调试器
node --inspect src/server.js

# 或使用VS Code调试配置
```

前端调试：使用浏览器开发者工具

### 日志查看

```bash
# 后端日志
npm run dev

# PM2日志
pm2 logs mengchongxingqiu-api

# MongoDB日志
sudo tail -f /var/log/mongodb/mongod.log
```

## 更新应用

```bash
# 拉取最新代码
git pull origin main

# 更新后端依赖
cd backend
npm install
pm2 restart mengchongxingqiu-api

# 更新前端依赖并重新构建
cd ../frontend
npm install
npm run build
```

## 获取帮助

如有问题，请：
1. 查看 [README.md](../README.md)
2. 查看 [API文档](./API.md)
3. 提交 [GitHub Issue](https://github.com/xzyyyyyyyyyyy/mengchongxingqiu/issues)

## 安全建议

生产环境请务必：
1. 修改所有默认密码
2. 使用HTTPS
3. 启用MongoDB认证
4. 定期更新依赖
5. 配置防火墙
6. 定期备份数据
7. 实施速率限制
8. 使用环境变量管理敏感信息
