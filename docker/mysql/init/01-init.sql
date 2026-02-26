-- =============================================================================
-- MySQL Initialization Script for SEMO Application
-- =============================================================================
-- هذا السكربت يُنفذ تلقائياً عند أول تشغيل لحاوية MySQL
-- This script is automatically executed on the first run of MySQL container
-- =============================================================================

-- -----------------------------------------------------------------------------
-- إنشاء قاعدة البيانات الرئيسية
-- Create main database
-- -----------------------------------------------------------------------------
-- التحقق من وجود قاعدة البيانات قبل إنشائها
-- Check if database exists before creating
CREATE DATABASE IF NOT EXISTS semo 
    -- مجموعة الأحرف المستخدمة
    -- Character set
    CHARACTER SET utf8mb4 
    -- مجموعة الترتيب (لدعم اللغة العربية والرموز التعبيرية)
    -- Collation (supports Arabic and emojis)
    COLLATE utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- إنشاء مستخدم التطبيق
-- Create application user
-- -----------------------------------------------------------------------------
-- إنشاء مستخدم محدد للتطبيق مع صلاحيات محدودة
-- Create a specific user for the application with limited privileges
CREATE USER IF NOT EXISTS 'semo_user'@'%' 
    -- كلمة المرور (يجب تغييرها في الإنتاج)
    -- Password (should be changed in production)
    IDENTIFIED BY 'secret123';

-- -----------------------------------------------------------------------------
-- منح الصلاحيات
-- Grant privileges
-- -----------------------------------------------------------------------------
-- منح جميع صلاحيات CRUD على قاعدة البيانات
-- Grant all CRUD privileges on the database
GRANT ALL PRIVILEGES ON semo.* TO 'semo_user'@'%';

-- منح صلاحية استخدام PROCEDURE
-- Grant privilege to use PROCEDURE
GRANT EXECUTE ON semo.* TO 'semo_user'@'%';

-- -----------------------------------------------------------------------------
-- إعدادات إضافية للمستخدم
-- Additional user settings
-- -----------------------------------------------------------------------------
-- تحديث معلومات المستخدم
-- Update user information
ALTER USER 'semo_user'@'%' 
    -- تعيين عدد الاستعلامات في الساعة
    -- Set queries per hour limit
    WITH 
    MAX_QUERIES_PER_HOUR 1000 
    -- تعيين عدد التحديثات في الساعة
    -- Set updates per hour limit  
    MAX_UPDATES_PER_HOUR 500
    -- تعيين عدد الاتصالات المتزامنة
    -- Set concurrent connections limit
    MAX_USER_CONNECTIONS 100;

-- -----------------------------------------------------------------------------
-- تطبيق التغييرات
-- Flush privileges
-- -----------------------------------------------------------------------------
-- إعادة تحميل جدول الصلاحيات
-- Reload privilege tables
FLUSH PRIVILEGES;

-- -----------------------------------------------------------------------------
-- إنشاء جدول للجلسات (Sessions) - اختياري
-- Create sessions table (optional)
-- -----------------------------------------------------------------------------
-- هذا الجدول يمكن استخدامه لتخزين الجلسات في قاعدة البيانات
-- This table can be used to store sessions in the database
USE semo;

-- -----------------------------------------------------------------------------
-- رسالة تأكيد
-- Confirmation message
-- -----------------------------------------------------------------------------
-- طباعة رسالة تأكيد (للسجلات)
-- Print confirmation message (for logs)
SELECT 'SEMO database and user created successfully!' AS 'Initialization Status';
