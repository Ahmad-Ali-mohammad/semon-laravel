# =============================================================================
# Dokploy Deployment Guide for SEMO Application
# =============================================================================
# دليل النشر على Dokploy
# Guide for deploying on Dokploy
# =============================================================================

## خطوات النشر على Dokploy (Dokploy Deployment Steps)

### 1. إعداد المستودع (Repository Setup)

تأكد من رفع جميع ملفات Docker إلى GitHub/GitLab:
Ensure all Docker files are pushed to GitHub/GitLab:

```
semo/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env.docker (rename to .env in Dokploy)
├── docker/
│   ├── apache/
│   │   └── 000-default.conf
│   ├── mysql/
│   │   └── init/
│   │       └── 01-init.sql
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── default.conf
│   └── ssl/ (for production SSL)
└── ...
```

### 2. إنشاء تطبيق في Dokploy (Create Application in Dokploy)

1. سجل الدخول إلى لوحة Dokploy
   Login to Dokploy dashboard

2. انقر على "Create Application"
   Click "Create Application"

3. اختر نوع النشر: **Docker Compose**
   Select deployment type: **Docker Compose**

4. اربط مستودع GitHub/GitLab
   Connect GitHub/GitLab repository

5. اختر الفرع (branch) المناسب (main/master)
   Select appropriate branch (main/master)

### 3. إعداد متغيرات البيئة (Environment Variables)

في إعدادات Dokploy، أضف هذه المتغيرات:
In Dokploy settings, add these environment variables:

| المتغير (Variable) | القيمة (Value) | الوصف (Description) |
|-------------------|---------------|-------------------|
| `APP_KEY` | `base64:...` | مفتاح Laravel (64 حرف) |
| `APP_DOMAIN` | `your-app.dokploy.com` | النطاق المعين من Dokploy |
| `APP_URL` | `https://your-app.dokploy.com` | رابط التطبيق الكامل |
| `DB_PASSWORD` | `secure_password` | كلمة مرور قاعدة البيانات |
| `MYSQL_ROOT_PASSWORD` | `secure_root_password` | كلمة مرور root لـ MySQL |
| `REDIS_PASSWORD` | `secure_redis_password` | كلمة مرور Redis (اختياري) |

**ملاحظة هامة**: قم بتوليد `APP_KEY` باستخدام:
**Important**: Generate `APP_KEY` using:
```bash
php artisan key:generate --show
```

### 4. إعدادات البناء (Build Settings)

- **Docker Compose File**: `docker-compose.yml`
- **Context**: `/` (جذر المشروع)
- **Port**: `80` (مطلوب لـ Dokploy)

### 5. النشر (Deploy)

انقر على "Deploy" لبدء النشر.
Click "Deploy" to start deployment.

سيتم:
- بناء صورة Docker
- تشغيل خدمات MySQL و Redis
- تشغيل تطبيق Laravel
- إعداد Traefik للتوجيه

It will:
- Build Docker image
- Start MySQL and Redis services
- Start Laravel application
- Setup Traefik routing

### 6. التحقق من النشر (Verify Deployment)

1. تحقق من سجلات البناء:
   Check build logs:
   ```
   dokploy dashboard → Applications → Your App → Logs
   ```

2. تحقق من صحة الخدمات:
   Check service health:
   - App: `https://your-app.dokploy.com/health`
   - API: `https://your-app.dokploy.com/api/`

3. تشغيل هجرات قاعدة البيانات (إذا لزم الأمر):
   Run database migrations (if needed):
   ```bash
   # في Dokploy Terminal أو SSH
   # In Dokploy Terminal or SSH
   docker-compose exec app php artisan migrate --force
   ```

## ملاحظات مهمة (Important Notes)

### التخزين الدائم (Persistent Storage)
- بيانات MySQL تُحفظ تلقائياً في volume
- بيانات Redis تُحفظ تلقائياً في volume
- ملفات التخزين (storage) تُحفظ في volume

### الشبكة (Network)
- يستخدم التطبيق شبكة `dokploy-network` الافتراضية
- لا تغير اسم الشبكة

### المنافذ (Ports)
- التطبيق يستخدم المنفذ `80` داخل الحاوية
- Dokploy يتولى ربط النطاق بالمنفذ
- لا تفتح منافذ إضافية للخدمات الداخلية (db, redis)

### SSL/HTTPS
- Dokploy يوفر SSL تلقائياً عبر Let's Encrypt
- لا حاجة لإعداد شهادات يدوياً

## استكشاف الأخطاء (Troubleshooting)

### مشكلة: التطبيق لا يعمل
1. تحقق من سجلات البناء في Dokploy
2. تحقق من أن `APP_KEY` مضبوط بشكل صحيح
3. تحقق من أن جميع متغيرات البيئة مضبوطة

### مشكلة: قاعدة البيانات غير متصلة
1. تحقق من أن خدمة `db` تعمل
2. تحقق من أن `DB_PASSWORD` متطابقة مع `MYSQL_PASSWORD`
3. انتظر 30 ثانية بعد أول نشر (MySQL يحتاج وقت للتهيئة)

### مشكلة: مشاكل في الأذونات
1. التطبيق يضبط الأذونات تلقائياً عند البدء
2. إذا استمرت المشكلة، أعد تشغيل التطبيق

## تحديث التطبيق (Update Application)

1. ادفع التغييرات إلى GitHub/GitLab
   Push changes to GitHub/GitLab

2. انقر على "Redeploy" في Dokploy
   Click "Redeploy" in Dokploy

3. أو قم بإعداد GitHub Actions للنشر التلقائي
   Or setup GitHub Actions for auto-deployment

## GitHub Actions للنشر التلقائي (Auto-Deploy with GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Dokploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Dokploy
        run: |
          curl -X POST "${{ secrets.DOKPLOY_WEBHOOK_URL }}"
```

---

**تم تحديث هذا الدليل لـ Dokploy**
**This guide is updated for Dokploy**
