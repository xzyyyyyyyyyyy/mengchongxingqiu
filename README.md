# 萌宠星球 (Pet Planet)

一个全功能的宠物社交平台，包含社交分享、宠物档案管理、健康监护、服务预约和电商功能。

## 功能特性

### 1. 社交分享模块 ✅
- 🎬 沉浸式信息流（类抖音风格）
- 🏷️ 话题标签和社区
- 📊 分类社区（猫、狗、小宠等）
- 🏆 宠物排行榜
- ❤️ 关注/取消关注用户
- 🔖 收藏/取消收藏帖子
- 🔍 全局搜索功能
- 📍 定位选择器（18个城市）
- 🔔 完整的通知系统

### 2. 宠物档案与管理 ✅
- 📝 数字宠物档案（详细信息、照片、文档）
- ⭐ 宠物评分系统（多维度评分）
- 💬 用户评价和评论
- 🐱 宠物品种专栏页面
- 💊 健康记录管理（疫苗、体检、用药）
- ⏰ 智能提醒服务
- 📁 宠物证件夹

### 3. AI健康管家 ✅
- 📊 每日健康日志
- 📈 健康数据可视化
- 🤖 AI健康分析（评分、趋势、预警）
- ⚠️ 智能健康预警系统
- 💡 个性化健康建议
- 🔍 趋势分析和预测

### 4. AI智能功能 ✅
- 🤖 AI健康分析（自动分析健康数据）
- 🎭 AI宠物头像生成（多风格）
- 🍽️ AI喂养建议（个性化饮食计划）
- 🔍 AI图片识别（品种识别）
- 📊 数据驱动的智能建议

### 5. 服务与电商 ✅
- 🏥 本地服务对接（医院、美容、寄养等）
- 📅 在线预约系统
- 🛒 宠物用品商城
- ⭐ 评价和评级系统
- 📦 订单管理系统

### 6. 个人中心 ✅
- 👤 用户资料管理
- 💼 内容管理（我的帖子、收藏、宠物）
- 📦 订单管理
- 🎁 积分系统
- 📊 浏览历史追踪
- 🎨 现代化UI设计
- 📱 完整的移动端支持

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

这将创建完整的测试数据，包括：
- **用户账户** (4个)
  - 管理员账户（Email: admin@mengchong.com, Password: admin123）
  - 普通用户账户（Email: catprince@example.com / doglover@example.com / photographer@example.com, Password: user123）
- **宠物档案** (4个) - 不同种类和品种的宠物
- **商品数据** (6个) - 涵盖食品、用品、玩具、美容、健康、服装等类别
- **服务数据** (4个) - 医院、美容、寄养、训练等服务
- **社区帖子** (6个) - 不同类别和话题标签的帖子
- **健康日志** (12条) - 包含体重、饮食、症状等详细记录
- **服务预约** (5个) - 不同状态的预约记录（待确认、已确认、已完成、已取消等）
- **商品订单** (3个) - 不同支付状态和物流状态的订单
- **宠物相册** (5张) - 带AI分析、里程碑标记的照片
- **用户反馈** (6条) - 包括bug报告、建议、问题等

**注意：** 运行种子脚本会清空现有的所有数据。

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
- `GET /api/pets/:petId/ratings` - 获取宠物评分列表
- `POST /api/pets/:petId/ratings` - 添加宠物评分
- `DELETE /api/pets/:petId/ratings/:ratingId` - 删除评分
- `PUT /api/pets/:petId/ratings/:ratingId/helpful` - 标记评分为有用
- `GET /api/pets/:petId/ratings/me` - 获取当前用户的评分

### 帖子接口
- `GET /api/posts` - 获取帖子列表
- `POST /api/posts` - 创建帖子
- `GET /api/posts/:id` - 获取帖子详情
- `PUT /api/posts/:id` - 更新帖子
- `DELETE /api/posts/:id` - 删除帖子
- `PUT /api/posts/:id/like` - 点赞/取消点赞
- `POST /api/posts/:id/comments` - 添加评论

### 收藏接口
- `GET /api/bookmarks` - 获取用户收藏列表
- `POST /api/bookmarks/:postId` - 收藏帖子
- `DELETE /api/bookmarks/:postId` - 取消收藏
- `GET /api/bookmarks/check/:postId` - 检查收藏状态

### 关注接口
- `POST /api/users/:id/follow` - 关注/取消关注用户
- `GET /api/users/:id/followers` - 获取粉丝列表
- `GET /api/users/:id/following` - 获取关注列表

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

### 浏览历史接口
- `POST /api/history` - 添加浏览记录
- `GET /api/history` - 获取浏览历史（支持类型筛选）
- `DELETE /api/history` - 清空浏览历史
- `DELETE /api/history/:id` - 删除单条浏览记录

### AI功能接口（模拟实现，可接入真实AI）
- AI健康分析 - 分析宠物健康数据，提供趋势、预警和建议
- AI头像生成 - 根据宠物特征生成自定义头像
- AI喂养建议 - 个性化饮食计划和营养建议
- AI图片识别 - 识别宠物品种和特征

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
- [x] **图片显示修复** - 所有页面图片正常加载（imageUtils工具）
- [x] **移动端导航增强** - Profile按钮添加到底部导航栏
- [x] **关注/收藏功能** - 完整的后端API和前端集成
- [x] **宠物评分系统** - 多维度评分（粘人度、聪明度、活跃度、掉毛）
- [x] **浏览历史追踪** - 自动记录用户浏览，支持筛选和管理
- [x] **通知系统** - 完整的通知页面，支持类型筛选和标记已读
- [x] **定位选择器** - 城市选择模态框，本地存储
- [x] **搜索功能** - 全局搜索，结果页面，图片正常显示
- [x] **宠物品种专栏** - 按品种分类的专属页面，榜单和收养板块
- [x] **AI健康分析** - 健康评分、趋势分析、智能预警、个性化建议
- [x] **AI喂养建议** - 个性化饮食计划、营养补充建议
- [x] **AI头像生成** - 多风格宠物头像生成组件
- [x] **AI图片识别** - 宠物品种识别服务
- [x] **UI全面美化** - 玻璃态导航、渐变配色、动画效果、加载骨架屏
- [x] **用户统计系统** - 真实数据API，动态等级系统（Lv.1-10）
- [x] **个人中心优化** - 真实粉丝/关注/获赞数据，移动端完全适配
- [x] **AI虚拟宠物互动** - 抚摸、喂食、玩耍功能，emoji动画反馈
- [x] **电商页面优化** - 移动端响应式布局，网格系统优化
- [x] **二维码扫描** - 完整扫码页面，支持商品/用户/宠物识别
- [x] **设置页面优化** - 移动端横向滚动标签，完整设置功能
- [x] **移动端全面优化** - Profile、Shop、Pets、Settings页面完全适配
- [x] **安全加固** - API速率限制，防止滥用

### 进行中 🚧
- [ ] 真实AI API集成（当前使用模拟数据，接口已就绪）
- [ ] 支付集成
- [ ] 图片上传功能完善
- [ ] 实时聊天功能（基础框架已搭建）

### 待开发 📋
- [ ] 推送通知系统
- [ ] 视频上传和处理
- [ ] 数据导出功能
- [ ] 移动端原生应用
- [ ] 小程序版本
- [ ] 暗黑模式

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

ISC

## 联系方式

如有问题，请通过GitHub Issues联系我们。
