/*
 Navicat Premium Data Transfer

 Source Server         : JAVATest
 Source Server Type    : MySQL
 Source Server Version : 80300 (8.3.0)
 Source Host           : localhost:3306
 Source Schema         : wxshop

 Target Server Type    : MySQL
 Target Server Version : 80300 (8.3.0)
 File Encoding         : 65001

 Date: 23/12/2025 18:55:19
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `product_id` int NOT NULL COMMENT '商品ID',
  `product_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '商品名称',
  `price` bigint NOT NULL COMMENT '订单金额（单位：分）',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '订单状态：0-待付款，1-已付费',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '订单创建时间',
  `pay_time` datetime NULL DEFAULT NULL COMMENT '支付时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_product_id`(`product_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_create_time`(`create_time` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 49 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '订单表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orders
-- ----------------------------
INSERT INTO `orders` VALUES (34, -27725823, 'Python', 125, 0, '2025-12-17 21:56:01', NULL);
INSERT INTO `orders` VALUES (35, -27725823, 'Python', 125, 0, '2025-12-17 21:57:48', NULL);
INSERT INTO `orders` VALUES (36, -27725823, 'Python', 125, 0, '2025-12-17 21:57:58', NULL);
INSERT INTO `orders` VALUES (37, -27725823, 'Python', 125, 0, '2025-12-17 22:01:18', NULL);
INSERT INTO `orders` VALUES (38, -27725823, 'Python', 125, 1, '2025-12-17 22:01:35', '2025-12-17 22:01:43');
INSERT INTO `orders` VALUES (39, -27725823, 'Python', 125, 1, '2025-12-17 22:02:58', '2025-12-18 12:39:25');
INSERT INTO `orders` VALUES (40, -1940328446, 'Java', 250, 1, '2025-12-18 12:19:09', '2025-12-18 12:40:40');
INSERT INTO `orders` VALUES (41, -1940328446, 'Java', 250, 0, '2025-12-18 12:19:29', NULL);
INSERT INTO `orders` VALUES (42, -27725823, 'Python', 125, 0, '2025-12-18 12:39:34', NULL);
INSERT INTO `orders` VALUES (43, -1940328446, 'Java', 250, 0, '2025-12-18 12:40:56', NULL);
INSERT INTO `orders` VALUES (44, -1940328446, 'Java', 250, 1, '2025-12-18 12:41:03', '2025-12-18 14:49:33');
INSERT INTO `orders` VALUES (45, -27725823, 'Python', 125, 1, '2025-12-18 12:42:08', '2025-12-18 14:49:30');
INSERT INTO `orders` VALUES (46, 1833533442, '这是个测试文件哦', 323, 1, '2025-12-18 13:16:08', '2025-12-18 13:16:12');
INSERT INTO `orders` VALUES (47, 1833533442, '这是个测试文件哦', 323, 1, '2025-12-18 13:16:14', '2025-12-18 13:16:18');
INSERT INTO `orders` VALUES (48, -1940328446, 'Java', 250, 1, '2025-12-18 14:23:33', '2025-12-18 14:23:37');

-- ----------------------------
-- Table structure for product
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '产品名称',
  `origin` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '产地',
  `category_id` int NULL DEFAULT NULL,
  `category_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '分类名称',
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图片URL',
  `short_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '简短描述',
  `detail_desc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '详细描述',
  `price` decimal(10, 2) NULL DEFAULT NULL COMMENT '价格',
  `status` tinyint(1) NULL DEFAULT 1 COMMENT '状态(1:上架,0:下架)',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1833533443 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '手工艺品表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of product
-- ----------------------------
INSERT INTO `product` VALUES (-1940328446, 'Java', 'Java是一个面向对象的语言。对程序员来说，这意味着要注意其中的数据和操纵数据的方法', 2, '计算机', 'http://localhost:8090/java.png', 'Java是一门面向对象的编程语言，由Sun公司于1995年正式发布，其设计理念源于对C 语言的改进，摒弃了多继承和指针等复杂概念，实现了功能强大与简单易用的结合。作为静态面向对象编程语言的代表，Java通过JVM（Java虚拟机）实现跨平台运行，具备分布式、健壮性、安全性、多线程等特性，支持桌面应用、Web应用和嵌入式系统开发', 'Java看起来设计得很像C++，但是为了使语言小和容易熟悉，设计者们把C++语言中许多可用的特征去掉了，这些特征是一般程序员很少使用的。例如，Java不支持goto语句，代之以提供break和continue语句以及异常处理。Java还剔除了C++的操作符过载（overload）和多继承特征，并且不使用主文件，免去了预处理程序。因为Java没有结构，数组和串都是对象，所以不需要指针。Java能够自动处理对象的引用和间接引用，实现自动的无用单元收集，使用户不必为存储管理问题烦恼，能更多的时间和精力花在研发上。\r\n面向对象\r\nJava是一个面向对象的语言。对程序员来说，这意味着要注意其中的数据和操纵数据的方法（method），而不是严格地用过程来思考。在一个面向对象的系统中，类（class）是数据和操作数据的方法的集合。数据和方法一起描述对象（object）的状态和行为。每一对象是其状态和行为的封装。类是按一定体系和层次安排的，使得子类可以从超类继承行为。在这个类层次体系中有一个根类，它是具有一般行为的类。Java程序是用类来组织的。', 250.00, 1, '2025-06-21 20:50:15', '2025-12-18 11:57:45');
INSERT INTO `product` VALUES (-645300223, '大学英语四六级考试', '由中国教育部高等教育司主持的全国性教学考试', 2, '语言', 'English.png', '大学英语四六级考试（CET-4/CET-6）是中国针对非英语专业本科生的一项标准化英语能力水平测试，旨在测量和评估学生的英语综合应用能力，其成绩普遍与学位授予、求职升学挂钩，在社会上具有广泛的认可度', '大学英语四六级考试始于1987年，是中国规模最大的单科性标准化考试之一。考试分为四级（CET-4）和六级（CET-6）两个级别，每年举行两次。考试内容涵盖听力理解、阅读理解、写作和翻译四个部分，全面考查学生在听、说（部分试点有口语考试）、读、写、译等方面的英语语言能力。四级要求掌握约4500个词汇，六级要求约5500个词汇。通过四级通常是本科生获得学士学位的必备条件之一，而六级证书则在研究生保送、外企求职、公务员考试等场景中作为重要的英语能力证明。该考试对中国大学生的英语学习目标和大学英语教学方向有着显著的导向作用', 130.00, 1, '2025-12-18 14:40:30', '2025-12-18 14:40:30');
INSERT INTO `product` VALUES (-27725823, 'Python', '新一代的电脑编程技术', 2, '计算机', 'http://localhost:8090/python.png', 'Python由荷兰国家数学与计算机科学研究中心的吉多·范罗苏姆于1990年代初设计，作为一门叫做ABC语言的替代品。Python提供了高效的高级数据结构，还能简单有效地面向对象编程。Python语法和动态类型，以及解释型语言的本质，使它成为多数平台上写脚本和快速开发应用的编程语言， 随着版本的不断更新和语言新功能的添加，逐渐被用于独立的、大型项目的开发。', 'Python语言的简洁性、易读性以及可扩展性，在国外用Python做科学计算的研究机构日益增多，一些知名大学已经采用Python来教授程序设计课程。例如卡耐基梅隆大学的编程基础、麻省理工学院的计算机科学及编程导论就使用Python语言讲授。众多开源的科学计算软件包都提供了Python的调用接口，例如著名的计算机视觉库OpenCV、三维可视化库VTK、医学图像处理库ITK。而Python专用的科学计算扩展库就更多了，例如如下3个十分经典的科学计算扩展库：NumPy、SciPy和matplotlib，它们分别为Python提供了快速数组处理、数值运算以及绘图功能。因此Python语言及其众多的扩展库所构成的开发环境十分适合工程技术，科研人员处理实验数据，制作图表，甚至开发科学计算应用程序。', 125.00, 1, '2025-06-21 20:53:55', '2025-12-17 21:31:29');
INSERT INTO `product` VALUES (948535298, 'JavaScript', '由网景公司的布兰登·艾克开发', 2, '计算机', 'JavaScript.png', 'JavaScript是一种高级的、解释型的编程语言，最初被设计用于在网页浏览器中为网页添加动态交互功能。它是Web的三大核心技术之一（与HTML和CSS并列），支持事件驱动、函数式以及基于原型的面向对', 'JavaScript的诞生彻底改变了Web的面貌，使其从静态文档平台发展为丰富的交互式应用平台。在浏览器端，它通过操作文档对象模型（DOM）和浏览器对象模型（BOM）来实现页面的动态更新、表单验证、动画效果以及与用户的实时交互。随着Ajax技术的普及和ES6（ECMAScript 2015）等现代标准的推出，JavaScript的能力得到了巨大提升，催生了React、Vue、Angular等强大的前端框架，使得开发复杂单页面应用（SPA）成为可能。在服务器端，Node.js的兴起让JavaScript能够用于构建高性能、可扩展的后端服务，统一了Web应用的开发语言栈。其非阻塞I/O和事件循环模型特别适合高并发的I/O密集型应用。此外，JavaScript还通过Electron、React Native等框架扩展到了桌面应用和移动原生应用开发领域，展现出极强的生态活力和广泛的适用性', 120.00, 1, '2025-12-18 14:43:08', '2025-12-18 14:43:08');
INSERT INTO `product` VALUES (1053392898, '高等数学', '数学的一个基础分支，其现代体系形成于17世纪微积分创立之后', 2, '数学', 'math.png', '高等数学是理工科专业的基础核心课程，以微积分学为主要内容，包括函数、极限、连续、一元及多元微积分、无穷级数、常微分方程和空间解析几何等基本模块。它旨在培养学生运用数学工具分析问题、建立模型并进行定量计', '高等数学（通常简称高数）是大学阶段数学教育的基石，其核心思想是研究变化和累积。通过学习极限理论，学生理解瞬时变化率（导数）和累积量（积分）的精确定义。微积分不仅用于求解曲线的切线、图形的面积和体积等几何问题，更是描述物理世界运动规律（如牛顿力学）、刻画经济变化（如边际分析）和优化工程设计的强大工具。无穷级数理论为函数近似表达和数值计算提供了方法。常微分方程部分则教会学生如何建立和求解描述动态系统的基本方程。掌握高等数学的思维和方法，对于后续学习物理学、工程学、经济学乃至计算机科学中的算法分析都至关重要', 25.00, 1, '2025-12-18 14:39:47', '2025-12-18 14:39:47');
INSERT INTO `product` VALUES (1833533442, '这是个测试文件哦', '测试', 1, '测试', 'logo.png', '测试测试测试', '测试测试测试测试测试测试测试', 323.00, 1, '2025-12-18 13:14:15', '2025-12-18 13:14:15');

-- ----------------------------
-- Table structure for wx_user
-- ----------------------------
DROP TABLE IF EXISTS `wx_user`;
CREATE TABLE `wx_user`  (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of wx_user
-- ----------------------------
INSERT INTO `wx_user` VALUES (1, '123@qq.com', '180801', 'fros');
INSERT INTO `wx_user` VALUES (2, '1230@qq.com', '180801', 'FROST');
INSERT INTO `wx_user` VALUES (3, '12@qq.com', '180801', 'hhhhh');
INSERT INTO `wx_user` VALUES (5, '156@qq..com', '180801', 'tes44');
INSERT INTO `wx_user` VALUES (6, 'test123@qq.com', '123456', 'test123');
INSERT INTO `wx_user` VALUES (7, '18080@qq.com', '180801', 'dwdad');
INSERT INTO `wx_user` VALUES (8, '156416@qq.com', '123456', 'test1');
INSERT INTO `wx_user` VALUES (9, '888@qq.com', '123456', 'ffff');
INSERT INTO `wx_user` VALUES (11, '123456@qq.com', '123456', 'test');

SET FOREIGN_KEY_CHECKS = 1;
