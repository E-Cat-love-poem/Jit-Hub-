# Jit-Hub 学习平台 - Code Wiki 文档

## 1. 项目概述

Jit-Hub 是一个基于 **Spring Boot** 和 **UniApp** 开发的微信小程序学习平台，提供用户注册登录、商品浏览、在线购物、订单管理等完整的电商功能。

### 1.1 项目定位

- **目标用户**: 学生、学习者
- **核心价值**: 提供在线课程学习、知识交流、AI解答等服务
- **技术定位**: 前后端分离架构，后端提供RESTful API，前端使用UniApp实现跨平台

### 1.2 技术栈

| 分类 | 技术 | 版本 | 说明 |
| :--- | :--- | :--- | :--- |
| 后端框架 | Spring Boot | 3.4.4 | Java后端框架 |
| 开发语言 | Java | 17 | JDK版本 |
| ORM框架 | MyBatis Plus | 3.5.11 | 数据库访问 |
| 数据库 | MySQL | 8.0+ | 关系型数据库 |
| 身份认证 | JWT | 4.4.0 | Token认证 |
| 前端框架 | UniApp | - | 跨平台小程序框架 |
| 前端语言 | Vue 3 | - | 前端框架 |
| CSS预处理器 | SCSS | - | 样式处理 |
| 目标平台 | 微信小程序 | - | 运行平台 |

---

## 2. 项目架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        微信小程序客户端                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │  Login  │ │  Home   │ │  Shop   │ │  User   │ │  Chat   │   │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │
│       │           │           │           │           │        │
└───────┼───────────┼───────────┼───────────┼───────────┼────────┘
        │           │           │           │           │
        ▼           ▼           ▼           ▼           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RESTful API Gateway                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  /user/*   /product/*   /order/*   /chat/*   /ai/*     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                         Spring Boot 后端                        │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐            │
│  │ Controller │───▶│   Service  │───▶│   Mapper   │            │
│  │   控制层   │    │   业务层   │    │   数据层   │            │
│  └────────────┘    └────────────┘    └──────┬─────┘            │
│                                              │                 │
└───────────────────────────────────────────────┼─────────────────┘
                                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MySQL 数据库                            │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                   │
│  │ wx_user   │  │  product  │  │  orders   │                   │
│  └───────────┘  └───────────┘  └───────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 模块职责划分

| 模块 | 包路径 | 职责说明 |
| :--- | :--- | :--- |
| **Controller层** | `frost.vxspring.controller` | 处理HTTP请求，参数校验，调用Service层 |
| **Service层** | `frost.vxspring.service` | 业务逻辑处理，事务管理 |
| **Mapper层** | `frost.vxspring.mapper` | 数据库CRUD操作，SQL映射 |
| **POJO层** | `frost.vxspring.pojo` | 数据库实体映射，数据传输对象 |
| **配置层** | `frost.vxspring` | Spring Boot启动类，配置类 |

---

## 3. 目录结构

```
Jit-Hub/
├── VxSpring/                    # Spring Boot 后端项目
│   ├── src/main/java/frost/vxspring/
│   │   ├── controller/          # REST API 控制器 (3个文件)
│   │   │   ├── UserController.java
│   │   │   ├── ProductController.java
│   │   │   └── OrderController.java
│   │   ├── service/             # 业务逻辑层 (6个文件)
│   │   │   ├── impl/            # 服务实现类
│   │   │   │   ├── UserServiceImpl.java
│   │   │   │   ├── ProductServiceImpl.java
│   │   │   │   └── OrderServiceImpl.java
│   │   │   ├── IUserService.java
│   │   │   ├── IProductService.java
│   │   │   └── IOrderService.java
│   │   ├── mapper/              # 数据访问层 (3个文件)
│   │   │   ├── UserMapper.java
│   │   │   ├── ProductMapper.java
│   │   │   └── OrderMapper.java
│   │   ├── pojo/                # 实体类 (3个文件)
│   │   │   ├── User.java
│   │   │   ├── Product.java
│   │   │   └── Order.java
│   │   ├── mappers/             # MyBatis XML 映射文件
│   │   │   └── UserMapper.xml
│   │   └── VxSpringApplication.java  # 启动类
│   ├── src/main/resources/
│   │   └── application.yml.example    # 配置文件模板
│   ├── src/test/java/           # 测试代码
│   └── pom.xml                  # Maven 依赖配置
├── pages/                       # UniApp 前端页面 (14个页面)
│   ├── Home/                    # 首页
│   ├── Login/                   # 登录页
│   ├── Register/                # 注册页
│   ├── shop/                    # 商城页
│   ├── detail/                  # 商品详情页
│   ├── purchased/               # 订单页
│   ├── chat/                    # 聊天页
│   ├── chat2/                   # 聊天页2
│   ├── ai/                      # AI解答页
│   ├── exam/                    # 考试页
│   ├── upload/                  # 上传页
│   ├── user/                    # 个人中心
│   ├── yue/                     # 联系我们
│   └── about/                   # 关于页
├── static/                      # 静态资源
│   ├── avatars/                 # 用户头像
│   └── images/                  # 页面图片
├── utils/                       # 工具函数
│   └── request.js               # 网络请求封装
├── unpackage/                   # 构建产物
├── App.vue                      # 应用入口组件
├── main.js                      # 主入口文件
├── pages.json                   # 页面路由配置
├── manifest.json                # 应用配置
├── uni.scss                     # 全局样式
├── wxshop.sql                   # 数据库初始化脚本
└── README.md                    # 项目说明文档
```

---

## 4. 核心模块详解

### 4.1 后端模块

#### 4.1.1 Controller层

**UserController** - 用户控制器

| 方法名 | HTTP方法 | 路径 | 功能说明 |
| :--- | :--- | :--- | :--- |
| `register` | POST | `/user/register` | 用户注册 |
| `login` | POST | `/user/login` | 用户登录 |
| `getUserInfo` | GET | `/user/info` | 获取用户信息 |

**ProductController** - 商品控制器

| 方法名 | HTTP方法 | 路径 | 功能说明 |
| :--- | :--- | :--- | :--- |
| `addProduct` | POST | `/product/add` | 新增商品 |
| `getFeaturedProducts` | GET | `/product/featured` | 获取精选商品 |
| `getByCategory` | GET | `/product/category/{categoryId}` | 按分类查询 |
| `getProductDetail` | GET | `/product/detail/{id}` | 获取商品详情 |
| `searchProducts` | GET | `/product/search` | 搜索商品 |

**OrderController** - 订单控制器

| 方法名 | HTTP方法 | 路径 | 功能说明 |
| :--- | :--- | :--- | :--- |
| `createOrder` | POST | `/order/create` | 创建订单 |
| `payOrder` | PUT | `/order/{orderId}/pay` | 支付订单 |
| `getAllOrders` | GET | `/order/all` | 获取所有订单 |
| `getOrdersByStatus` | GET | `/order/status/{status}` | 按状态获取订单 |

#### 4.1.2 Service层

**IUserService** - 用户服务接口

| 方法名 | 参数 | 返回值 | 功能说明 |
| :--- | :--- | :--- | :--- |
| `register` | `User user` | `boolean` | 用户注册 |
| `login` | `String account, String password` | `User` | 用户登录 |
| `getUserById` | `Long userId` | `User` | 根据ID获取用户 |

**IProductService** - 商品服务接口

| 方法名 | 参数 | 返回值 | 功能说明 |
| :--- | :--- | :--- | :--- |
| `getFeaturedProducts` | 无 | `List<Product>` | 获取精选商品 |
| `getProductsByCategory` | `Integer categoryId` | `List<Product>` | 按分类获取商品 |
| `searchProducts` | `String keyword` | `List<Product>` | 搜索商品 |

**IOrderService** - 订单服务接口

| 方法名 | 参数 | 返回值 | 功能说明 |
| :--- | :--- | :--- | :--- |
| `createOrder` | `Order order` | `boolean` | 创建订单 |
| `payOrder` | `Long orderId` | `boolean` | 支付订单 |
| `getAllOrders` | 无 | `List<Order>` | 获取所有订单 |
| `getOrdersByStatus` | `Integer status` | `List<Order>` | 按状态获取订单 |
| `getOrderDetail` | `Long orderId` | `Order` | 获取订单详情 |

#### 4.1.3 Mapper层

**UserMapper** - 用户数据访问

| 方法名 | 参数 | 返回值 | SQL说明 |
| :--- | :--- | :--- | :--- |
| `selectForLogin` | `String account, String password` | `User` | 根据用户名和密码查询 |

**ProductMapper** - 商品数据访问

| 方法名 | 参数 | 返回值 | SQL说明 |
| :--- | :--- | :--- | :--- |
| `selectFeaturedProducts` | 无 | `List<Product>` | 查询精选商品(状态=1) |
| `searchProductsByKeyword` | `String keyword` | `List<Product>` | 根据关键词搜索 |

**OrderMapper** - 订单数据访问

| 方法名 | 参数 | 返回值 | SQL说明 |
| :--- | :--- | :--- | :--- |
| `createOrder` | `Order order` | `int` | 插入订单记录 |
| `updateOrderStatus` | `Integer id, Integer status` | `int` | 更新订单状态 |
| `getOrdersByStatus` | `Integer status` | `List<Order>` | 按状态查询订单 |
| `getAllOrders` | 无 | `List<Order>` | 查询所有订单 |

#### 4.1.4 POJO实体类

**User** - 用户实体

| 字段名 | 类型 | 数据库字段 | 说明 |
| :--- | :--- | :--- | :--- |
| `userId` | `Long` | `user_id` | 用户ID(主键) |
| `userName` | `String` | `user_name` | 用户名 |
| `password` | `String` | `password` | 密码 |
| `email` | `String` | `email` | 邮箱 |
| `createTime` | `Date` | `create_time` | 创建时间 |

**Product** - 商品实体

| 字段名 | 类型 | 数据库字段 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | `Integer` | `id` | 商品ID(主键) |
| `name` | `String` | `name` | 商品名称 |
| `origin` | `String` | `origin` | 来源/产地 |
| `categoryId` | `Integer` | `category_id` | 分类ID |
| `categoryName` | `String` | `category_name` | 分类名称 |
| `imageUrl` | `String` | `image_url` | 图片URL |
| `shortDesc` | `String` | `short_desc` | 简短描述 |
| `detailDesc` | `String` | `detail_desc` | 详细描述 |
| `price` | `BigDecimal` | `price` | 价格 |
| `status` | `Integer` | `status` | 状态(1=上架) |
| `createTime` | `Date` | `create_time` | 创建时间 |
| `updateTime` | `Date` | `update_time` | 更新时间 |

**Order** - 订单实体

| 字段名 | 类型 | 数据库字段 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `id` | 订单ID(主键) |
| `productId` | `Integer` | `product_id` | 商品ID |
| `productName` | `String` | `product_name` | 商品名称 |
| `price` | `Long` | `price` | 订单金额 |
| `status` | `Integer` | `status` | 状态(0=待付款,1=已付款) |
| `createTime` | `Date` | `create_time` | 创建时间 |
| `payTime` | `Date` | `pay_time` | 支付时间 |

### 4.2 前端模块

#### 4.2.1 页面路由配置

**pages.json** 定义了应用的页面路由和tabBar配置：

| 页面路径 | 标题 | tabBar显示 | 图标 |
| :--- | :--- | :--- | :--- |
| `/pages/Login/Login` | - | 否 | - |
| `/pages/Home/Home` | 平台主页 | 是 | Home.png |
| `/pages/yue/yue` | 联系我们 | 是 | booking.png |
| `/pages/shop/shop` | 课程购买 | 是 | shop.png |
| `/pages/user/user` | 个人中心 | 是 | logo1.png |
| `/pages/detail/detail` | 商品详情 | 否 | - |
| `/pages/chat/chat` | 聊天室 | 否 | - |
| `/pages/ai/ai` | AI解答 | 否 | - |
| `/pages/exam/exam` | 在线测试 | 否 | - |
| `/pages/purchased/purchased` | 已购课程 | 否 | - |

#### 4.2.2 工具函数

**request.js** - 网络请求封装

| 方法名 | 参数 | 返回值 | 功能说明 |
| :--- | :--- | :--- | :--- |
| `request` | `options(url, method, data, header)` | `Promise` | 统一请求封装 |
| `get` | `url, data` | `Promise` | GET请求 |
| `post` | `url, data` | `Promise` | POST请求 |
| `put` | `url, data` | `Promise` | PUT请求 |

**配置说明**:
- 基础URL: `http://localhost:8088`
- 请求头自动携带token
- 统一错误处理和Toast提示

---

## 5. 数据库结构

### 5.1 用户表 (wx_user)

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `user_id` | `BIGINT` | PRIMARY KEY, AUTO_INCREMENT | 用户ID |
| `user_name` | `VARCHAR(50)` | NOT NULL, UNIQUE | 用户名 |
| `email` | `VARCHAR(100)` | NOT NULL, UNIQUE | 邮箱 |
| `password` | `VARCHAR(255)` | NOT NULL | 密码(加密存储) |
| `create_time` | `DATETIME` | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

### 5.2 商品表 (product)

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | PRIMARY KEY, AUTO_INCREMENT | 商品ID |
| `name` | `VARCHAR(100)` | NOT NULL | 商品名称 |
| `origin` | `VARCHAR(50)` | - | 来源 |
| `category_id` | `INT` | - | 分类ID |
| `category_name` | `VARCHAR(50)` | - | 分类名称 |
| `image_url` | `VARCHAR(255)` | - | 图片URL |
| `short_desc` | `VARCHAR(255)` | - | 简短描述 |
| `detail_desc` | `TEXT` | - | 详细描述 |
| `price` | `DECIMAL(10,2)` | NOT NULL | 价格 |
| `status` | `TINYINT` | DEFAULT 1 | 状态(0=下架,1=上架) |
| `create_time` | `DATETIME` | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| `update_time` | `DATETIME` | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

### 5.3 订单表 (orders)

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | PRIMARY KEY, AUTO_INCREMENT | 订单ID |
| `product_id` | `INT` | NOT NULL | 商品ID |
| `product_name` | `VARCHAR(100)` | NOT NULL | 商品名称 |
| `price` | `BIGINT` | NOT NULL | 订单金额(分) |
| `status` | `TINYINT` | DEFAULT 0 | 状态(0=待付款,1=已付款) |
| `create_time` | `DATETIME` | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| `pay_time` | `DATETIME` | - | 支付时间 |

---

## 6. API接口文档

### 6.1 用户接口

#### POST /user/register - 用户注册

**请求体**:
```json
{
  "userName": "string",
  "email": "string",
  "password": "string"
}
```

**响应**:
```json
{
  "success": true,
  "message": "注册成功"
}
```

#### POST /user/login - 用户登录

**请求体**:
```json
{
  "account": "string",
  "password": "string"
}
```

**响应**:
```json
{
  "success": true,
  "message": "登录成功:username",
  "userInfo": {
    "user_id": 1,
    "user_name": "username",
    "email": "email@example.com"
  }
}
```

#### GET /user/info - 获取用户信息

**请求参数**: `userId=1`

**响应**:
```json
{
  "userId": 1,
  "userName": "username",
  "password": "***",
  "email": "email@example.com"
}
```

### 6.2 商品接口

#### POST /product/add - 新增商品

**请求体**:
```json
{
  "name": "string",
  "origin": "string",
  "categoryId": 1,
  "categoryName": "string",
  "imageUrl": "string",
  "shortDesc": "string",
  "detailDesc": "string",
  "price": 99.99,
  "status": 1
}
```

**响应**:
```json
{
  "code": 200,
  "data": {...},
  "message": "success"
}
```

#### GET /product/featured - 获取精选商品

**响应**:
```json
{
  "code": 200,
  "data": [...],
  "message": "success"
}
```

#### GET /product/detail/{id} - 获取商品详情

**响应**:
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "name": "商品名称",
    "price": 99.99,
    ...
  },
  "message": "success"
}
```

#### GET /product/search?keyword=xxx - 搜索商品

**响应**:
```json
{
  "code": 200,
  "data": [...],
  "message": "success"
}
```

### 6.3 订单接口

#### POST /order/create - 创建订单

**请求体**:
```json
{
  "product_id": 1,
  "product_name": "string",
  "price": 9999
}
```

**响应**:
```json
{
  "success": true,
  "message": "课程创建成功",
  "data": {...}
}
```

#### PUT /order/{orderId}/pay - 支付订单

**响应**:
```json
{
  "success": true,
  "message": "课程确认成功",
  "orderId": 1
}
```

#### GET /order/all - 获取所有订单

**响应**:
```json
{
  "success": true,
  "message": "获取订单列表成功",
  "data": [...]
}
```

#### GET /order/status/{status} - 按状态获取订单

**响应**:
```json
{
  "success": true,
  "message": "根据状态获取订单成功",
  "data": [...]
}
```

---

## 7. 项目运行方式

### 7.1 环境要求

| 工具 | 版本 | 说明 |
| :--- | :--- | :--- |
| JDK | 17+ | Java开发环境 |
| Maven | 3.8+ | 依赖管理工具 |
| MySQL | 8.0+ | 数据库 |
| Node.js | 14+ | 前端依赖安装 |
| HBuilderX | 最新版 | UniApp开发工具 |

### 7.2 后端部署

1. **克隆项目**
```bash
cd f:/2025-2026 2/软件工程项目实训/project/Jit-Hub-/VxSpring
```

2. **创建数据库**
```sql
CREATE DATABASE wxshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **配置数据库连接**
```bash
cp src/main/resources/application.yml.example src/main/resources/application.yml
```

编辑 `application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/wxshop?useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
```

4. **运行项目**
```bash
mvn spring-boot:run
```

### 7.3 前端部署

1. **打开项目**
   - 使用 HBuilderX 打开项目根目录 `Jit-Hub-/`
   - 等待依赖安装完成

2. **运行项目**
   - 点击工具栏的"运行" -> "运行到小程序模拟器" -> "微信开发者工具"

3. **预览项目**
   - 微信开发者工具会自动打开并加载项目

---

## 8. 依赖关系

### 8.1 后端依赖

| 依赖名称 | GroupId | ArtifactId | 版本 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| Spring Boot Starter Web | org.springframework.boot | spring-boot-starter-web | 3.4.4 | Web框架 |
| Spring Boot Starter Validation | org.springframework.boot | spring-boot-starter-validation | 3.4.4 | 参数校验 |
| MyBatis Plus Boot Starter | com.baomidou | mybatis-plus-spring-boot3-starter | 3.5.11 | ORM框架 |
| MySQL Connector | com.mysql | mysql-connector-j | 8.0.33 | 数据库驱动 |
| Lombok | org.projectlombok | lombok | 1.18.32 | 简化代码 |
| JJWT API | io.jsonwebtoken | jjwt-api | 4.4.0 | JWT认证 |
| JJWT Impl | io.jsonwebtoken | jjwt-impl | 4.4.0 | JWT实现 |
| JJWT Jackson | io.jsonwebtoken | jjwt-jackson | 4.4.0 | JWT JSON支持 |

### 8.2 模块依赖关系

```
Controller层
    │
    ▼
Service层 (依赖Mapper层)
    │
    ▼
Mapper层 (依赖POJO层)
    │
    ▼
POJO层
```

---

## 9. 代码规范

### 9.1 Java代码规范

- 遵循阿里巴巴 Java 开发手册
- 类名采用大驼峰命名法
- 方法名和变量名采用小驼峰命名法
- 常量名采用全大写，下划线分隔
- 使用 Lombok 注解简化代码

### 9.2 Vue代码规范

- 遵循 ESLint 规范
- 组件名采用 PascalCase
- 使用 Composition API (Vue 3)
- 响应式数据使用 `ref` 和 `reactive`
- 方法命名使用小驼峰

### 9.3 Git提交规范

遵循 Conventional Commits 规范：

| 类型 | 说明 |
| :--- | :--- |
| `feat` | 新增功能 |
| `fix` | 修复Bug |
| `docs` | 文档更新 |
| `style` | 代码格式 |
| `refactor` | 代码重构 |
| `test` | 测试代码 |
| `chore` | 构建/工具更新 |

---

## 10. 注意事项

### 10.1 敏感配置

`application.yml` 文件包含敏感信息（如数据库密码），已被添加到 `.gitignore`。团队成员需要：
1. 从 `application.yml.example` 复制一份
2. 修改为自己的本地配置
3. 切勿将 `application.yml` 提交到仓库

### 10.2 数据库初始化

首次运行项目前，请执行 `wxshop.sql` 脚本初始化数据库表结构。

### 10.3 跨域配置

开发环境下需要配置跨域，确保前端能正常访问后端API。

---

## 11. 开发流程

```
1. 从 main 分支拉取最新代码
2. 创建功能分支 feature/xxx
3. 开发完成后提交代码
4. 创建 Pull Request 到 main 分支
5. 代码审查通过后合并
```

---

## 附录：文件清单

### 后端文件

| 文件路径 | 说明 |
| :--- | :--- |
| `VxSpring/src/main/java/frost/vxspring/VxSpringApplication.java` | 启动类 |
| `VxSpring/src/main/java/frost/vxspring/controller/UserController.java` | 用户控制器 |
| `VxSpring/src/main/java/frost/vxspring/controller/ProductController.java` | 商品控制器 |
| `VxSpring/src/main/java/frost/vxspring/controller/OrderController.java` | 订单控制器 |
| `VxSpring/src/main/java/frost/vxspring/service/IUserService.java` | 用户服务接口 |
| `VxSpring/src/main/java/frost/vxspring/service/IProductService.java` | 商品服务接口 |
| `VxSpring/src/main/java/frost/vxspring/service/IOrderService.java` | 订单服务接口 |
| `VxSpring/src/main/java/frost/vxspring/service/impl/UserServiceImpl.java` | 用户服务实现 |
| `VxSpring/src/main/java/frost/vxspring/service/impl/ProductServiceImpl.java` | 商品服务实现 |
| `VxSpring/src/main/java/frost/vxspring/service/impl/OrderServiceImpl.java` | 订单服务实现 |
| `VxSpring/src/main/java/frost/vxspring/mapper/UserMapper.java` | 用户Mapper |
| `VxSpring/src/main/java/frost/vxspring/mapper/ProductMapper.java` | 商品Mapper |
| `VxSpring/src/main/java/frost/vxspring/mapper/OrderMapper.java` | 订单Mapper |
| `VxSpring/src/main/java/frost/vxspring/pojo/User.java` | 用户实体 |
| `VxSpring/src/main/java/frost/vxspring/pojo/Product.java` | 商品实体 |
| `VxSpring/src/main/java/frost/vxspring/pojo/Order.java` | 订单实体 |

### 前端文件

| 文件路径 | 说明 |
| :--- | :--- |
| `pages/Home/Home.vue` | 首页 |
| `pages/Login/Login.vue` | 登录页 |
| `pages/Register/Register.vue` | 注册页 |
| `pages/shop/shop.vue` | 商城页 |
| `pages/detail/detail.vue` | 商品详情页 |
| `pages/purchased/purchased.vue` | 订单页 |
| `pages/user/user.vue` | 个人中心 |
| `pages/chat/chat.vue` | 聊天室 |
| `pages/ai/ai.vue` | AI解答 |
| `pages/exam/exam.vue` | 考试页 |
| `utils/request.js` | 网络请求封装 |
| `App.vue` | 应用入口 |
| `main.js` | 主入口 |
| `pages.json` | 页面路由配置 |
