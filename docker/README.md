# =============================================================================
# Docker Setup Guide for SEMO Application
# =============================================================================
# هذا الدليل يشرح كيفية استخدام Docker مع تطبيق SEMO
# This guide explains how to use Docker with SEMO application
# =============================================================================

## متطلبات النظام (System Requirements)

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM على الأقل (4GB RAM minimum)
- 10GB مساحة خالية (10GB free disk space)

## هيكل ملفات Docker (Docker Files Structure)

```
semo/
├── Dockerfile                          # ملف بناء صورة التطبيق
├── docker-compose.yml                  # إعدادات الخدمات
├── .dockerignore                       # ملفات يتجاهلها Docker
├── .env.docker                         # قالب متغيرات البيئة
├── docker/
│   ├── apache/
│   │   └── 000-default.conf           # إعدادات Apache
│   ├── nginx/
│   │   ├── nginx.conf                 # إعدادات Nginx الرئيسية
│   │   └── default.conf               # إعدادات الخادم الافتراضي
│   └── mysql/
│       └── init/
│           └── 01-init.sql            # سكربت تهيئة MySQL
```

## البدء السريع (Quick Start)

### 1. إعداد ملف البيئة (Setup Environment File)

```bash
# نسخ ملف البيئة
# Copy environment file
copy .env.docker .env

# تحرير الملف وتغيير القيم المطلوبة
# Edit the file and change required values
# خاصة: APP_KEY, DB_PASSWORD, MYSQL_ROOT_PASSWORD
```

### 2. بناء وتشغيل التطبيق (Build and Run Application)

```bash
# بناء الصور وتشغيل الخدمات
# Build images and run services
docker-compose up -d --build

# انتظار دقيقتين حتى يكتمل البناء
# Wait 2 minutes for build to complete
```

### 3. الوصول للتطبيق (Access Application)

```
التطبيق: http://localhost:8080
Application: http://localhost:8080

قاعدة البيانات: localhost:3306 (MySQL)
Database: localhost:3306 (MySQL)

Redis: localhost:6379
```

## الأوامر الأساسية (Basic Commands)

### تشغيل الخدمات (Start Services)
```bash
docker-compose up -d
```

### إيقاف الخدمات (Stop Services)
```bash
docker-compose down
```

### إعادة بناء التطبيق (Rebuild Application)
```bash
docker-compose up -d --build
```

### عرض السجلات (View Logs)
```bash
# جميع الخدمات
# All services
docker-compose logs -f

# خدمة محددة
# Specific service
docker-compose logs -f app
docker-compose logs -f db
docker-compose logs -f redis
```

### تنفيذ أوامر Laravel (Run Laravel Commands)
```bash
# تشغيل هجرات قاعدة البيانات
# Run database migrations
docker-compose exec app php artisan migrate

# توليد مفتاح التطبيق
# Generate application key
docker-compose exec app php artisan key:generate

# تحسين الأداء
# Performance optimization
docker-compose exec app php artisan config:cache
docker-compose exec app php artisan route:cache
docker-compose exec app php artisan view:cache

# إنشاء مستخدم مشرف
# Create admin user
docker-compose exec app php artisan tinker
```

### إدارة الحاويات (Container Management)
```bash
# قائمة الحاويات
# List containers
docker-compose ps

# إعادة تشغيل خدمة
# Restart service
docker-compose restart app

# إعادة بناء خدمة محددة
# Rebuild specific service
docker-compose up -d --build app
```

## الخدمات المتاحة (Available Services)

| الخدمة (Service) | المنفذ (Port) | الوصف (Description) |
|-----------------|---------------|-------------------|
| app | 8080 | تطبيق PHP/Apache (PHP/Apache Application) |
| db | 3306 | قاعدة بيانات MySQL (MySQL Database) |
| redis | 6379 | خادم Redis للكاش (Redis Cache Server) |
| nginx | 80/443 | بروكسي عكسي Nginx (Nginx Reverse Proxy) - اختياري |

## إعدادات الإنتاج (Production Setup)

### 1. تغيير كلمات المرور (Change Passwords)

```bash
# في ملف .env
# In .env file
DB_PASSWORD=your_strong_password_here
MYSQL_ROOT_PASSWORD=your_strong_root_password_here
APP_KEY=base64:your_generated_key
```

### 2. إيقاف وضع التصحيح (Disable Debug Mode)

```bash
# في ملف .env
# In .env file
APP_DEBUG=false
APP_ENV=production
```

### 3. استخدام Nginx + SSL (Use Nginx + SSL)

```bash
# تفعيل خدمة Nginx في docker-compose.yml
# Enable Nginx service in docker-compose.yml
# إضافة شهادات SSL إلى docker/ssl/
# Add SSL certificates to docker/ssl/
```

### 4. إعداد النسخ الاحتياطي (Setup Backup)

```bash
# نسخ احتياطي لقاعدة البيانات
# Database backup
docker-compose exec db mysqldump -u root -p semo > backup.sql

# استعادة النسخ الاحتياطي
# Restore backup
docker-compose exec -T db mysql -u root -p semo < backup.sql
```

## استكشاف الأخطاء (Troubleshooting)

### مشكلة: التطبيق لا يعمل (Application not working)

```bash
# التحقق من حالة الحاويات
# Check container status
docker-compose ps

# عرض سجلات الأخطاء
# View error logs
docker-compose logs app

# التحقق من صحة الحاوية
# Check container health
docker-compose exec app curl http://localhost/health
```

### مشكلة: قاعدة البيانات غير متصلة (Database not connected)

```bash
# التحقق من حالة قاعدة البيانات
# Check database status
docker-compose ps db

# إعادة تشغيل قاعدة البيانات
# Restart database
docker-compose restart db

# التحقق من الاتصال
# Check connection
docker-compose exec app php artisan migrate:status
```

### مشكلة: مشاكل في الأذونات (Permission Issues)

```bash
# إصلاح أذونات Laravel
# Fix Laravel permissions
docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
docker-compose exec app chmod -R 775 storage bootstrap/cache
```

### مشكلة: مشاكل في الذاكرة (Memory Issues)

```bash
# زيادة حد الذاكرة
# Increase memory limit
docker-compose exec app php -d memory_limit=512M artisan your:command
```

## الأمان (Security)

### قائمة مراجعة الأمان (Security Checklist)

- [ ] تغيير جميع كلمات المرور الافتراضية
  Change all default passwords
- [ ] تعطيل وضع التصحيح في الإنتاج
  Disable debug mode in production
- [ ] استخدام HTTPS مع شهادات SSL صالحة
  Use HTTPS with valid SSL certificates
- [ ] تقييد الوصول لمنفذ قاعدة البيانات
  Restrict database port access
- [ ] إعداد جدار ناري (Firewall)
  Setup firewall
- [ ] تحديث الصور بانتظام
  Update images regularly

## دعم اللغة العربية (Arabic Language Support)

التطبيق يدعم اللغة العربية بالكامل عبر:

1. **قاعدة البيانات**: استخدام utf8mb4_unicode_ci
   **Database**: Using utf8mb4_unicode_ci

2. **Nginx**: إعدادات الرؤوس تدعم UTF-8
   **Nginx**: Headers configured for UTF-8

3. **PHP**: إعدادات mbstring مفعلة
   **PHP**: mbstring settings enabled

## دعم فني (Support)

للمساعدة أو الإبلاغ عن مشاكل:
For help or reporting issues:

1. تحقق من السجلات: `docker-compose logs`
   Check logs: `docker-compose logs`

2. تأكد من إعدادات البيئة
   Verify environment settings

3. أعد بناء الصور: `docker-compose up -d --build`
   Rebuild images: `docker-compose up -d --build`

---

**ملاحظة**: هذا الإعداد مُحسّن للإنتاج مع دعم كامل للأمان والأداء.
**Note**: This setup is optimized for production with full security and performance support.
