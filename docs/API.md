# API 文档

## 基础信息

**Base URL**: `http://localhost:5000/api`

**认证方式**: JWT Token (Bearer Authentication)

所有需要认证的接口，请在请求头中添加：
```
Authorization: Bearer <your_token>
```

## 响应格式

### 成功响应
```json
{
  "success": true,
  "data": { ... }
}
```

### 错误响应
```json
{
  "success": false,
  "message": "错误信息"
}
```

## 认证接口 (Authentication)

### 用户注册
```http
POST /auth/register
```

**请求体**:
```json
{
  "username": "string (3-30字符)",
  "email": "string (有效邮箱)",
  "password": "string (至少6字符)"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string",
    "token": "string"
  }
}
```

### 用户登录
```http
POST /auth/login
```

**请求体**:
```json
{
  "email": "string",
  "password": "string"
}
```

**响应**: 同注册接口

### 获取当前用户信息
```http
GET /auth/me
```
🔒 需要认证

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string",
    "bio": "string",
    "location": { ... },
    "preferences": { ... },
    "points": "number",
    "followers": ["array"],
    "following": ["array"]
  }
}
```

### 更新用户信息
```http
PUT /auth/updatedetails
```
🔒 需要认证

**请求体**:
```json
{
  "username": "string (可选)",
  "bio": "string (可选)",
  "location": { ... } (可选)
}
```

### 修改密码
```http
PUT /auth/updatepassword
```
🔒 需要认证

**请求体**:
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

## 宠物管理接口 (Pets)

### 获取用户的所有宠物
```http
GET /pets
```
🔒 需要认证

**响应**:
```json
{
  "success": true,
  "count": "number",
  "data": [
    {
      "_id": "string",
      "name": "string",
      "species": "cat|dog|rabbit|hamster|bird|fish|other",
      "breed": "string",
      "birthDate": "date",
      "avatar": "string",
      ...
    }
  ]
}
```

### 获取单个宠物详情
```http
GET /pets/:id
```
🔒 需要认证

### 创建宠物档案
```http
POST /pets
```
🔒 需要认证

**请求体**:
```json
{
  "name": "string (必需)",
  "species": "cat|dog|rabbit|hamster|bird|fish|other (必需)",
  "breed": "string (必需)",
  "gender": "male|female|unknown",
  "birthDate": "date",
  "appearance": {
    "color": "string",
    "weight": "number",
    "height": "number"
  },
  "personality": {
    "traits": ["string"],
    "temperament": "string"
  },
  "habits": { ... }
}
```

### 更新宠物信息
```http
PUT /pets/:id
```
🔒 需要认证

**请求体**: 同创建接口，所有字段可选

### 删除宠物档案
```http
DELETE /pets/:id
```
🔒 需要认证

### 添加健康记录
```http
POST /pets/:id/health
```
🔒 需要认证

**请求体**:
```json
{
  "type": "vaccination|medical|checkup|medication",
  "data": {
    // 根据type不同，数据结构不同
    "name": "string",
    "date": "date",
    ...
  }
}
```

### 添加提醒
```http
POST /pets/:id/reminders
```
🔒 需要认证

**请求体**:
```json
{
  "type": "vaccination|deworming|grooming|checkup|medication|other",
  "date": "date",
  "frequency": "string (可选)",
  "note": "string (可选)"
}
```

## 帖子接口 (Posts)

### 获取帖子列表（信息流）
```http
GET /posts
```

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `category`: 分类过滤 (daily|medical|training|food|travel|funny|other)
- `tag`: 标签过滤
- `hashtag`: 话题过滤

**响应**:
```json
{
  "success": true,
  "count": "number",
  "total": "number",
  "page": "number",
  "pages": "number",
  "data": [
    {
      "_id": "string",
      "author": {
        "username": "string",
        "avatar": "string"
      },
      "pet": {
        "name": "string",
        "avatar": "string"
      },
      "content": "string",
      "mediaType": "image|video|text",
      "media": [...],
      "tags": [...],
      "hashtags": [...],
      "likesCount": "number",
      "commentsCount": "number",
      "views": "number",
      "createdAt": "date"
    }
  ]
}
```

### 获取单个帖子
```http
GET /posts/:id
```

### 创建帖子
```http
POST /posts
```
🔒 需要认证

**请求体**:
```json
{
  "content": "string (必需)",
  "pet": "string (宠物ID, 可选)",
  "mediaType": "image|video|text",
  "media": [
    {
      "type": "image|video",
      "url": "string",
      "thumbnail": "string"
    }
  ],
  "tags": ["string"],
  "hashtags": ["string"],
  "category": "daily|medical|training|food|travel|funny|other",
  "location": {
    "name": "string",
    "coordinates": [number, number]
  }
}
```

### 更新帖子
```http
PUT /posts/:id
```
🔒 需要认证（仅作者可更新）

### 删除帖子
```http
DELETE /posts/:id
```
🔒 需要认证（仅作者可删除）

### 点赞/取消点赞
```http
PUT /posts/:id/like
```
🔒 需要认证

**响应**:
```json
{
  "success": true,
  "data": {
    "likesCount": "number",
    "isLiked": "boolean"
  }
}
```

### 添加评论
```http
POST /posts/:id/comments
```
🔒 需要认证

**请求体**:
```json
{
  "content": "string"
}
```

### 获取用户的帖子
```http
GET /posts/user/:userId
```

## 健康管理接口 (Health)

### 获取健康日志
```http
GET /health/:petId
```
🔒 需要认证

**查询参数**:
- `startDate`: 开始日期
- `endDate`: 结束日期

### 创建健康日志
```http
POST /health/:petId
```
🔒 需要认证

**请求体**:
```json
{
  "date": "date (默认当天)",
  "weight": "number",
  "temperature": "number",
  "diet": {
    "foodAmount": "number",
    "waterAmount": "number",
    "appetite": "excellent|good|fair|poor"
  },
  "bowelMovement": {
    "frequency": "number",
    "consistency": "normal|soft|hard|diarrhea"
  },
  "energy": {
    "level": "very-low|low|normal|high|very-high",
    "notes": "string"
  },
  "mood": "happy|normal|anxious|sad|irritable",
  "symptoms": ["string"],
  "notes": "string"
}
```

### 获取健康分析
```http
GET /health/:petId/analytics
```
🔒 需要认证

**查询参数**:
- `days`: 分析天数 (默认: 30)

**响应**:
```json
{
  "success": true,
  "data": {
    "weight": {
      "current": "number",
      "trend": "increasing|decreasing|stable",
      "data": [...]
    },
    "water": {
      "average": "number",
      "trend": "string",
      "data": [...]
    },
    "food": {
      "average": "number",
      "trend": "string",
      "data": [...]
    },
    "energy": {
      "average": "number",
      "distribution": {...}
    },
    "alerts": [...]
  }
}
```

## 错误代码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（需要登录） |
| 403 | 禁止访问（权限不足） |
| 404 | 资源未找到 |
| 500 | 服务器内部错误 |

## 速率限制

- 未认证用户: 100 请求/小时
- 已认证用户: 1000 请求/小时
- 文件上传: 10 请求/小时

## 文件上传

最大文件大小: 10MB

支持的文件类型:
- 图片: jpg, jpeg, png, gif
- 视频: mp4, mov, avi
- 文档: pdf, doc, docx

## Webhooks (计划中)

未来将支持以下Webhooks事件：
- 新帖子创建
- 健康预警触发
- 提醒到期
- 订单状态变更
