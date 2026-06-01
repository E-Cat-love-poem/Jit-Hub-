# Jit-Hub - 微信小程序商城系统

## 项目简介

Jit-Hub 是一个基于 Spring Boot 和 UniApp 开发的微信小程序商城系统，提供用户注册登录、商品浏览、在线购物、订单管理等完整的电商功能。

## 技术栈

### 后端技术
| 技术 | 版本 | 说明 |
| :--- | :--- | :--- |
| Spring Boot | 3.4.4 | 后端框架 |
| Java | 17 | 开发语言 |
| MyBatis Plus | 3.5.11 | ORM 框架 |
| MySQL | 8.0+ | 数据库 |
| Redis | - | 缓存（可选） |
| JWT | 4.4.0 | 身份认证 |

### 前端技术
| 技术 | 说明 |
| :--- | :--- |
| UniApp | 跨平台小程序框架 |
| Vue 3 | 前端框架 |
| SCSS | CSS 预处理器 |
| 微信小程序 | 目标平台 |

## 项目结构

```
Jit-Hub/
├── VxSpring/                    # Spring Boot 后端项目
│   ├── src/main/java/frost/vxspring/
│   │   ├── controller/          # REST API 控制器
│   │   ├── service/             # 业务逻辑层
│   │   ├── mapper/              # 数据访问层
│   │   ├── pojo/                # 实体类
│   │   └── VxSpringApplication.java
│   ├── src/main/resources/
│   │   ├── application.yml.example  # 配置文件模板
│   │   └── mappers/             # MyBatis XML 映射文件
│   └── pom.xml                  # Maven 依赖配置
├── pages/                       # UniApp 前端页面
│   ├── Home/                    # 首页
│   ├── Login/                   # 登录页
│   ├── Register/                # 注册页
│   ├── shop/                    # 商城页
│   ├── detail/                  # 商品详情页
│   ├── purchased/               # 订单页
│   ├── chat/                    # 聊天页
│   ├── exam/                    # 考试页
│   └── ...
├── static/                      # 静态资源
├── utils/                       # 工具函数
├── unpackage/                   # 构建产物
├── App.vue                      # 应用入口
├── main.js                      # 主入口文件
├── pages.json                   # 页面路由配置
├── manifest.json                # 应用配置
├── uni.scss                     # 全局样式
└── wxshop.sql                   # 数据库初始化脚本
```

## 快速开始

### 环境要求

- JDK 17+
- Maven 3.8+
- MySQL 8.0+
- Node.js 14+
- HBuilderX（UniApp 开发工具）

### 后端部署

1. **克隆项目**
```bash
git clone https://github.com/E-Cat-love-poem/Jit-Hub-
cd Jit-Hub-/VxSpring
```

2. **创建数据库**
```sql
CREATE DATABASE wxshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **配置数据库连接**
```bash
cp src/main/resources/application.yml.example src/main/resources/application.yml
```
编辑 `application.yml`，配置数据库用户名和密码：
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

### 前端部署

1. **打开项目**
   - 使用 HBuilderX 打开项目根目录
   - 等待依赖安装完成

2. **运行项目**
   - 点击工具栏的"运行" -> "运行到小程序模拟器" -> "微信开发者工具"

3. **预览项目**
   - 微信开发者工具会自动打开并加载项目

## API 接口

### 用户接口

| 方法 | 路径 | 描述 |
| :--- | :--- | :--- |
| POST | `/user/register` | 用户注册 |
| POST | `/user/login` | 用户登录 |
| GET | `/user/info` | 获取用户信息 |

### 商品接口

| 方法 | 路径 | 描述 |
| :--- | :--- | :--- |
| GET | `/product/list` | 获取商品列表 |
| GET | `/product/detail` | 获取商品详情 |

### 订单接口

| 方法 | 路径 | 描述 |
| :--- | :--- | :--- |
| POST | `/order/create` | 创建订单 |
| GET | `/order/list` | 获取订单列表 |

## 数据库结构

### 用户表 (wx_user)
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| user_id | BIGINT | 用户ID（主键） |
| user_name | VARCHAR | 用户名 |
| email | VARCHAR | 邮箱 |
| password | VARCHAR | 密码 |

### 商品表 (wx_product)
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| product_id | BIGINT | 商品ID（主键） |
| product_name | VARCHAR | 商品名称 |
| price | DECIMAL | 价格 |
| description | TEXT | 商品描述 |

### 订单表 (wx_order)
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| order_id | BIGINT | 订单ID（主键） |
| user_id | BIGINT | 用户ID（外键） |
| product_id | BIGINT | 商品ID（外键） |
| quantity | INT | 数量 |
| total_price | DECIMAL | 总价 |

## 开发指南

### 代码规范

- Java 代码遵循阿里巴巴 Java 开发手册
- Vue 代码遵循 ESLint 规范
- 提交信息遵循 Conventional Commits 规范

### 分支管理

- `main` - 主分支，稳定版本
- `feature/*` - 功能开发分支
- `bugfix/*` - Bug 修复分支

### 开发流程

1. 从 `main` 分支拉取最新代码
2. 创建功能分支 `feature/xxx`
3. 开发完成后提交代码
4. 创建 Pull Request 到 `main` 分支
5. 代码审查通过后合并

## 注意事项

### 敏感配置

`application.yml` 文件包含敏感信息（如数据库密码），已被添加到 `.gitignore`。团队成员需要：
1. 从 `application.yml.example` 复制一份
2. 修改为自己的本地配置
3. 切勿将 `application.yml` 提交到仓库

### 数据库初始化

首次运行项目前，请执行 `wxshop.sql` 脚本初始化数据库表结构。

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支
3. 提交代码
4. 推送到分支
5. 创建 Pull Request

## 许可证

本项目仅供学习和实训使用。

## 联系方式

如有问题，请通过 GitHub Issues 联系项目维护者。
