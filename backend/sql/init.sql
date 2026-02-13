/*
 Navicat Premium Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 80026
 Source Host           : localhost:3306
 Source Schema         : jobnavi

 Target Server Type    : MySQL
 Target Server Version : 80026
 File Encoding         : 65001

 Date: 09/02/2026 00:00:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Create Database
-- ----------------------------
CREATE DATABASE IF NOT EXISTS `jobnavi` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `jobnavi`;

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '加密密码',
  `nickname` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '昵称',
  `email` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `email_verified` tinyint DEFAULT 0 COMMENT '邮箱是否已验证:0-否,1-是',
  `email_verified_time` datetime DEFAULT NULL COMMENT '邮箱验证时间',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像URL',
  `wx_openid` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '微信OpenID',
  `mobile` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号',
  `status` tinyint DEFAULT 0 COMMENT '状态:0-正常,1-注销中,2-禁用',
  `delete_time` datetime DEFAULT NULL COMMENT '注销申请时间',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表(系统)';

-- ----------------------------
-- Table structure for sys_email_verification_code
-- ----------------------------
DROP TABLE IF EXISTS `sys_email_verification_code`;
CREATE TABLE `sys_email_verification_code` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `email` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '邮箱',
  `scene` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '场景:REGISTER,BIND_EMAIL,RESET_PASSWORD',
  `code_hash` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '验证码Hash(SHA-256)',
  `expire_time` datetime NOT NULL COMMENT '过期时间',
  `used` tinyint DEFAULT 0 COMMENT '是否已使用:0-否,1-是',
  `used_time` datetime DEFAULT NULL COMMENT '使用时间',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_email_scene_used` (`email`,`scene`,`used`),
  KEY `idx_expire_time` (`expire_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='邮箱验证码表(系统)';

-- ----------------------------
-- Table structure for sys_password_reset_token
-- ----------------------------
DROP TABLE IF EXISTS `sys_password_reset_token`;
CREATE TABLE `sys_password_reset_token` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `email` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱(冗余便于排查)',
  `token_hash` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '重置Token Hash(SHA-256)',
  `expire_time` datetime NOT NULL COMMENT '过期时间',
  `used` tinyint DEFAULT 0 COMMENT '是否已使用:0-否,1-是',
  `used_time` datetime DEFAULT NULL COMMENT '使用时间',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_used` (`user_id`,`used`),
  KEY `idx_expire_time` (`expire_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='重置密码Token表(系统)';

-- ----------------------------
-- Table structure for biz_company_profile
-- ----------------------------
DROP TABLE IF EXISTS `biz_company_profile`;
CREATE TABLE `biz_company_profile` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `company_name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公司名称',
  `kpi_risk_score` int DEFAULT '0' COMMENT 'KPI风险分(0-100)',
  `wishing_score` int DEFAULT '0' COMMENT '许愿指数(0-100)',
  `tags` json DEFAULT NULL COMMENT '公司标签JSON',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_company_name` (`company_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='公司画像/黑名单表(业务)';

-- ----------------------------
-- Table structure for biz_job_snapshot
-- ----------------------------
DROP TABLE IF EXISTS `biz_job_snapshot`;
CREATE TABLE `biz_job_snapshot` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `platform_job_id` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '平台职位ID(如Boss的jobId)',
  `job_name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '职位名称',
  `salary_raw` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '原始薪资(如20-30K)',
  `company_name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公司名称',
  `jd_text` longtext COLLATE utf8mb4_unicode_ci COMMENT '职位描述全文',
  `hr_active_status` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'HR活跃状态',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_company_name` (`company_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='职位快照表(业务)';

-- ----------------------------
-- Table structure for biz_interview_schedule
-- ----------------------------
DROP TABLE IF EXISTS `biz_interview_schedule`;
CREATE TABLE `biz_interview_schedule` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `company_name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公司名称',
  `interview_time` datetime NOT NULL COMMENT '面试时间',
  `location_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '面试地点(文本)',
  `location_geo` point NOT NULL /*!80003 SRID 4326 */ COMMENT '地理坐标',
  `buffer_time_minutes` int DEFAULT '30' COMMENT '建议缓冲时间(分)',
  `status` tinyint DEFAULT '0' COMMENT '状态:0-待面试,1-已完成,2-已取消',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_time` (`user_id`,`interview_time`),
  SPATIAL KEY `idx_location_geo` (`location_geo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='面试日程表(业务)';

-- ----------------------------
-- Table structure for biz_safe_house
-- ----------------------------
DROP TABLE IF EXISTS `biz_safe_house`;
CREATE TABLE `biz_safe_house` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '地点名称',
  `location_geo` point NOT NULL /*!80003 SRID 4326 */ COMMENT '地理坐标',
  `type` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '类型:Cafe,Library,Mall',
  `features` json DEFAULT NULL COMMENT '设施标签JSON',
  `avg_cost` decimal(10,2) DEFAULT '0.00' COMMENT '人均消费',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  SPATIAL KEY `idx_location_geo` (`location_geo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='安全屋表(业务)';

SET FOREIGN_KEY_CHECKS = 1;
