# Jit-Hub 在线课程学习平台 - 接口测试文档

**版本**: v1.0
**编写日期**: 2025-06-01
**编写人**: XXX

---

## 接口测试环境

| 配置项 | 值 |
|--------|-----|
| 后端地址 | http://localhost:8088 |
| 数据库 | MySQL 8.0 (localhost:3306) |
| 测试工具 | Postman / Apifox |
| Content-Type | application/json |

---

## 一、用户模块接口

### 1.1 用户注册

**接口信息**

| 属性 | 值 |
|------|-----|
| URL | `POST /user/register` |
| 方法 | POST |
| Content-Type | application/json |

**请求体**

```json
{
  "userName": "testuser001",
  "email": "test001@jit-hub.com",
  "password": "Test@123456"
}
```

**成功响应 (200)**

```json
{
  "success": true,
  "message": "注册成功"
}
```

**失败响应 - 用户名已存在 (200)**

```json
{
  "success": false,
  "message": "用户名或邮箱已存在"
}
```

**失败响应 - 参数为空 (200)**

```json
{
  "success": false,
  "message": "参数错误"
}
```

---

### 1.2 用户登录

**接口信息**

| 属性 | 值 |
|------|-----|
| URL | `POST /user/login` |
| 方法 | POST |
| Content-Type | application/json |

**请求体**

```json
{
  "account": "testuser001",
  "password": "Test@123456"
}
```

**成功响应 (200)**

```json
{
  "success": true,
  "message": "登录成功",
  "userInfo": {
    "user_id": 1,
    "user_name": "testuser001",
    "email": "test001@jit-hub.com"
  }
}
```

**失败响应 - 密码错误 (200)**

```json
{
  "success": false,
  "message": "用户名或密码错误"
}
```

**失败响应 - 用户不存在 (200)**

```json
{
  "success": false,
  "message": "用户不存在"
}
```

---

### 1.3 获取用户信息

**接口信息**

| 属性 | 值 |
|------|-----|
| URL | `GET /user/info?userId={id}` |
| 方法 | GET |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | Long | 是 | 用户ID |

**成功响应 (200)**

```json
{
  "userId": 1,
  "userName": "testuser001",
  "password": "Test@123456",
  "email": "test001@jit-hub.com",
  "createTime": "2025-05-20T10:30:00"
}
```

---

## 二、商品模块接口

### 2.1 精选商品列表

**接口信息**

| 属性 | 值 |
|------|-----|
| URL | `GET /product/featured` |
| 方法 | GET |

**成功响应 (200)**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "Java 基础教程",
      "origin": "Jit-Hub",
      "categoryId": 1,
      "categoryName": "编程开发",
      "imageUrl": "/static/images/java.png",
      "shortDesc": "适合零基础学习",
      "detailDesc": "本课程详细讲解 Java 基础语法...",
      "price": 99.00,
      "status": 1,
      "createTime": "2025-05-15T08:00:00",
      "updateTime": "2025-05-20T10:00:00"
    }
  ]
}
```

---

### 2.2 商品搜索

**接口信息**

| 属性 | 值 |
|------|-----|
| URL | `GET /product/search?keyword={keyword}` |
| 方法 | GET |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | String | 是 | 搜索关键词 |

**成功响应 (200)**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "Java 基础教程",
      "origin": "Jit-Hub",
      "categoryId": 1,
      "categoryName": "编程开发",
      "imageUrl": "/static/images/java.png",
      "shortDesc": "适合零基础学习",
      "price": 99.00,
      "status": 1
    }
  ]
}
```

---

### 2.3 商品详情

**接口信息**

| 属性 | 值 |
|------|-----|
| URL | `GET /product/detail/{id}` |
| 方法 | GET |

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | Integer | 商品ID |

**成功响应 (200)**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "Java 基础教程",
    "origin": "Jit-Hub",
    "categoryId": 1,
    "categoryName": "编程开发",
    "imageUrl": "/static/images/java.png",
    "shortDesc": "适合零基础学习",
    "detailDesc": "本课程详细讲解 Java 基础语法、面向对象、异常处理等核心知识...",
    "price": 99.00,
    "status": 1,
    "createTime": "2025-05-15T08:00:00",
    "updateTime": "2025-05-20T10:00:00"
  }
}
```

---

### 2.4 新增商品

**接口信息**

| 属性 | 值 |
|------|-----|
| URL | `POST /product/add` |
| 方法 | POST |
| Content-Type | application/json |

**请求体**

```json
{
  "name": "Python 爬虫实战",
  "origin": "Jit-Hub",
  "categoryId": 1,
  "categoryName": "编程开发",
  "imageUrl": "/static/images/python.png",
  "shortDesc": "手把手教你写爬虫",
  "detailDesc": "从零开始学习 Python 爬虫技术...",
  "price": 129.00,
  "status": 1
}
```

**成功响应 (200)**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 10,
    "name": "Python 爬虫实战",
    ...
  }
}
```

---

### 2.5 按分类查询

**接口信息**

| 属性 | 值 |
|------|-----|
| URL | `GET /product/category/{categoryId}` |
| 方法 | GET |

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| categoryId | Integer | 分类ID |

**成功响应 (200)**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "Java 基础教程",
      "categoryId": 1,
      "price": 99.00,
      ...
    },
    {
      "id": 5,
      "name": "JavaScript 入门",
      "categoryId": 1,
      "price": 89.00,
      ...
    }
  ]
}
```

---

## 三、订单模块接口

### 3.1 创建订单

**接口信息**

| 属性 | 值 |
|------|-----|
| URL | `POST /order/create` |
| 方法 | POST |
| Content-Type | application/json |

**请求体**

```json
{
  "product_id": 1,
  "product_name": "Java 基础教程",
  "price": 9900
}
```

**成功响应 (200)**

```json
{
  "success": true,
  "message": "课程创建成功",
  "data": {
    "id": 1,
    "productId": 1,
    "productName": "Java 基础教程",
    "price": 9900,
    "status": 0,
    "createTime": "2025-06-01T15:30:00",
    "payTime": null
  }
}
```

---

### 3.2 支付订单

**接口信息**

| 属性 | 值 |
|------|-----|
| URL | `PUT /order/{orderId}/pay` |
| 方法 | PUT |

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| orderId | Long | 订单ID |

**成功响应 (200)**

```json
{
  "success": true,
  "message": "课程确认成功",
  "orderId": 1
}
```

**失败响应 - 订单不存在 (200)**

```json
{
  "success": false,
  "message": "订单不存在"
}
```

---

### 3.3 获取所有订单

**接口信息**

| 属性 | 值 |
|------|-----|
| URL | `GET /order/all` |
| 方法 | GET |

**成功响应 (200)**

```json
{
  "success": true,
  "message": "获取订单列表成功",
  "data": [
    {
      "id": 1,
      "productId": 1,
      "productName": "Java 基础教程",
      "price": 9900,
      "status": 1,
      "createTime": "2025-06-01T15:30:00",
      "payTime": "2025-06-01T15:35:00"
    },
    {
      "id": 2,
      "productId": 3,
      "productName": "Python 爬虫实战",
      "price": 12900,
      "status": 0,
      "createTime": "2025-06-01T16:00:00",
      "payTime": null
    }
  ]
}
```

---

### 3.4 按状态查询订单

**接口信息**

| 属性 | 值 |
|------|-----|
| URL | `GET /order/status/{status}` |
| 方法 | GET |

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| status | Integer | 订单状态：0=待付款，1=已付款 |

**查询待付款订单 (status=0)**

```json
{
  "success": true,
  "message": "根据状态获取订单成功",
  "data": [
    {
      "id": 2,
      "productId": 3,
      "productName": "Python 爬虫实战",
      "price": 12900,
      "status": 0,
      "createTime": "2025-06-01T16:00:00",
      "payTime": null
    }
  ]
}
```

**查询已付款订单 (status=1)**

```json
{
  "success": true,
  "message": "根据状态获取订单成功",
  "data": [
    {
      "id": 1,
      "productId": 1,
      "productName": "Java 基础教程",
      "price": 9900,
      "status": 1,
      "createTime": "2025-06-01T15:30:00",
      "payTime": "2025-06-01T15:35:00"
    }
  ]
}
```

---

## 附录：Postman 测试脚本

### 环境变量配置

```javascript
{
  "id": "jit-hub-env",
  "name": "Jit-Hub 环境",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8088",
      "enabled": true
    },
    {
      "key": "userId",
      "value": "",
      "enabled": true
    },
    {
      "key": "orderId",
      "value": "",
      "enabled": true
    }
  ]
}
```

### 完整测试流程脚本（Postman Collection）

```
Jit-Hub API 测试集
├── 1. 用户注册
│   └── POST {{baseUrl}}/user/register
├── 2. 用户登录
│   └── POST {{baseUrl}}/user/login
│   └── [保存 userId 到环境变量]
├── 3. 获取用户信息
│   └── GET {{baseUrl}}/user/info?userId={{userId}}
├── 4. 精选商品列表
│   └── GET {{baseUrl}}/product/featured
├── 5. 商品搜索
│   └── GET {{baseUrl}}/product/search?keyword=Java
├── 6. 商品详情
│   └── GET {{baseUrl}}/product/detail/1
├── 7. 创建订单
│   └── POST {{baseUrl}}/order/create
│   └── [保存 orderId 到环境变量]
├── 8. 支付订单
│   └── PUT {{baseUrl}}/order/{{orderId}}/pay
├── 9. 获取所有订单
│   └── GET {{baseUrl}}/order/all
└── 10. 按状态查询订单
    └── GET {{baseUrl}}/order/status/0
```

---

**文档结束**
