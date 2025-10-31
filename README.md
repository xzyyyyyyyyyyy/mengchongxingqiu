# 萌宠星球 (Pet Planet)

一个全功能的宠物社交平台，包含社交分享、宠物档案管理、健康监护、服务预约和电商功能。

## 功能特性

### 1. 社交分享模块
- 🎬 沉浸式信息流（类抖音风格）
- 🏷️ 话题标签和社区
- 📊 分类社区（猫、狗、小宠等）
- 🏆 宠物排行榜

### 2. 宠物档案与管理
- 📝 数字宠物档案（详细信息、照片、文档）
- 📄 PDF导出功能
- 💊 健康记录管理（疫苗、体检、用药）
- ⏰ 智能提醒服务

### 3. AI健康管家
- 📊 每日健康日志
- 📈 健康数据可视化
- ⚠️ 健康预警系统
- 🔍 趋势分析

### 4. AI智能回忆相册
- 🏷️ 照片自动标签
- 🎬 每周精选影集
- 📖 成长故事生成
- 🎨 风格转换（卡通、名画风格等）

### 5. AI宠物虚拟形象
- 🎭 多风格形象生成
- 🎮 互动场景
- 📔 虚拟形象日记

### 6. 服务与电商
- 🏥 本地服务对接（医院、美容、寄养等）
- 📅 在线预约系统
- 🛒 宠物用品商城
- ⭐ 评价和评级系统

### 7. 个人中心
- 👤 用户资料管理
- 💼 内容管理
- 📦 订单管理
- 🎁 积分系统
- 🎨 主题定制

## 技术栈

### 后端
- Node.js + Express
- MongoDB + Mongoose
- JWT认证
- Multer (文件上传)
- Socket.io (实时功能)

### 前端
- React 18
- Vite
- React Router v6
- Axios
- Tailwind CSS

## 快速开始

### 前置要求
- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm 或 yarn

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/xzyyyyyyyyyyy/mengchongxingqiu.git
cd mengchongxingqiu
```

2. 安装后端依赖
```bash
cd backend
npm install
```

3. 配置后端环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，配置MongoDB连接等
```

4. 启动后端服务
```bash
npm run dev
```
后端将运行在 http://localhost:5000

5. 安装前端依赖
```bash
cd ../frontend
npm install
```

6. 配置前端环境变量
```bash
cp .env.example .env
# 默认配置指向 http://localhost:5000/api
```

7. 启动前端开发服务器
```bash
npm run dev
```
前端将运行在 http://localhost:3000

### 启动MongoDB

确保MongoDB正在运行：
```bash
# Linux/MacOS
mongod

# 或使用Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 填充测试数据

首次运行时，可以使用种子数据脚本填充数据库：
```bash
cd backend
npm run seed
```

这将创建：
- 管理员账户（Email: admin@mengchong.com, Password: admin123）
- 示例商品数据
- 示例服务数据

**注意：** 运行种子脚本会清空现有的商品和服务数据。

## 项目结构

```
mengchongxingqiu/
├── backend/                 # 后端代码
│   ├── src/
│   │   ├── config/         # 配置文件
│   │   ├── controllers/    # 控制器
│   │   ├── middleware/     # 中间件
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由
│   │   ├── validators/     # 请求验证
│   │   ├── utils/          # 工具函数
│   │   └── server.js       # 入口文件
│   ├── uploads/            # 上传文件存储
│   └── package.json
├── frontend/               # 前端代码
│   ├── src/
│   │   ├── api/           # API服务
│   │   ├── components/    # React组件
│   │   │   ├── common/    # 通用组件
│   │   │   └── admin/     # 管理后台组件
│   │   ├── contexts/      # React上下文
│   │   ├── pages/         # 页面组件
│   │   │   ├── admin/     # 管理后台页面
│   │   │   └── ...        # 其他页面
│   │   ├── utils/         # 工具函数
│   │   ├── App.jsx        # 主应用组件
│   │   └── main.jsx       # 入口文件
│   └── package.json
├── design-mockups/        # UI设计稿
└── README.md
```

## 管理后台

管理员可以通过访问 `/admin` 路径进入管理后台。管理后台功能包括：

### 访问权限
- 只有角色为 `admin` 的用户可以访问管理后台
- 默认管理员账号：
  - Email: admin@mengchong.com
  - Password: admin123

### 功能模块
- **仪表盘** - 查看平台关键数据统计
- **商品管理** - 添加、编辑、删除商品
- **服务管理** - 管理平台服务提供商
- **内容管理** - 审核和管理用户发布的帖子
- **订单管理** - 查看和处理订单
- **预约管理** - 管理服务预约

## API文档

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `PUT /api/auth/updatedetails` - 更新用户信息
- `PUT /api/auth/updatepassword` - 修改密码

### 宠物接口
- `GET /api/pets` - 获取用户的所有宠物
- `POST /api/pets` - 创建宠物档案
- `GET /api/pets/:id` - 获取宠物详情
- `PUT /api/pets/:id` - 更新宠物信息
- `DELETE /api/pets/:id` - 删除宠物档案
- `POST /api/pets/:id/health` - 添加健康记录
- `POST /api/pets/:id/reminders` - 添加提醒

### 帖子接口
- `GET /api/posts` - 获取帖子列表
- `POST /api/posts` - 创建帖子
- `GET /api/posts/:id` - 获取帖子详情
- `PUT /api/posts/:id` - 更新帖子
- `DELETE /api/posts/:id` - 删除帖子
- `PUT /api/posts/:id/like` - 点赞/取消点赞
- `POST /api/posts/:id/comments` - 添加评论

### 健康管理接口
- `GET /api/health/:petId` - 获取健康日志
- `POST /api/health/:petId` - 创建健康日志
- `GET /api/health/:petId/analytics` - 获取健康分析

### 服务接口
- `GET /api/services` - 获取服务列表（支持分类、城市、评分等过滤）
- `GET /api/services/:id` - 获取服务详情
- `POST /api/services` - 创建服务（需要认证）
- `PUT /api/services/:id` - 更新服务（需要认证）
- `DELETE /api/services/:id` - 删除服务（需要认证）
- `POST /api/services/:id/reviews` - 添加服务评价
- `GET /api/services/nearby` - 获取附近服务（基于地理位置）

### 商品接口
- `GET /api/products` - 获取商品列表（支持分类、价格、宠物类型等过滤）
- `GET /api/products/:id` - 获取商品详情
- `GET /api/products/featured` - 获取推荐商品
- `POST /api/products` - 创建商品（需要认证）
- `PUT /api/products/:id` - 更新商品（需要认证）
- `DELETE /api/products/:id` - 删除商品（需要认证）
- `POST /api/products/:id/reviews` - 添加商品评价

### 预约接口
- `GET /api/bookings` - 获取用户预约列表（需要认证）
- `GET /api/bookings/:id` - 获取预约详情
- `POST /api/bookings` - 创建预约
- `PUT /api/bookings/:id` - 更新预约
- `PUT /api/bookings/:id/cancel` - 取消预约
- `DELETE /api/bookings/:id` - 删除预约

### 订单接口
- `GET /api/orders` - 获取用户订单列表（需要认证）
- `GET /api/orders/:id` - 获取订单详情
- `POST /api/orders` - 创建订单
- `PUT /api/orders/:id/payment` - 更新支付状态
- `PUT /api/orders/:id/status` - 更新订单状态（管理员）
- `PUT /api/orders/:id/cancel` - 取消订单

## 开发计划

### 已完成 ✅
- [x] 项目架构搭建
- [x] 后端API基础框架
- [x] 数据库模型设计
- [x] 前端基础框架
- [x] 用户认证系统
- [x] 社交帖子功能
- [x] 宠物档案管理
- [x] 健康日志系统
- [x] 服务管理API（完整CRUD）
- [x] 商品管理API（完整CRUD）
- [x] 订单管理系统
- [x] 预约管理系统
- [x] 管理员后台面板
- [x] 真实数据API集成（替换所有模拟数据）
- [x] 请求验证和错误处理

### 进行中 🚧
- [ ] AI图像识别集成
- [ ] 虚拟宠物形象生成
- [ ] 支付集成
- [ ] 图片上传功能完善

### 待开发 📋
- [ ] 实时聊天功能
- [ ] 推送通知系统
- [ ] 数据导出功能
- [ ] 移动端应用
- [ ] 小程序版本

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

ISC

## 联系方式

如有问题，请通过GitHub Issues联系我们。
