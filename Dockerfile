# =============================================================================
# Dockerfile for SEMO Application (Laravel Backend + React Frontend)
# =============================================================================
# هذا الملف يقوم ببناء صورة Docker للتطبيق الكامل
# This file builds a Docker image for the complete application
# =============================================================================

# -----------------------------------------------------------------------------
# المرحلة الأولى: بناء الواجهة الأمامية (Frontend Build Stage)
# Stage 1: Build the frontend assets using Node.js
# -----------------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder

# تعيين دليل العمل داخل الحاوية
# Set working directory inside the container
WORKDIR /app

# نسخ ملفات package.json أولاً للاستفادة من caching
# Copy package files first to leverage Docker caching
COPY package*.json ./

# تثبيت اعتماديات Node.js
# Install Node.js dependencies (including dev dependencies for build)
RUN npm ci

# نسخ باقي ملفات المشروع
# Copy the rest of the application
COPY . .

# بناء أصول الواجهة الأمامية
# Build frontend assets
RUN npm run build

# -----------------------------------------------------------------------------
# المرحلة الثانية: إعداد PHP و Apache
# Stage 2: PHP-Apache Setup
# -----------------------------------------------------------------------------
FROM php:8.2-apache

# تعيين معلومات المشرف
# Set maintainer information
LABEL maintainer="SEMO Team"
LABEL description="SEMO Application - Laravel Backend with React Frontend"

# تعيين دليل العمل
# Set working directory
WORKDIR /var/www/html

# -----------------------------------------------------------------------------
# تثبيت الاعتماديات النظامية
# Install system dependencies
# -----------------------------------------------------------------------------
RUN apt-get update && apt-get install -y \
    # أدوات التحكم في الإصدارات - Version control tools
    git \
    # أداة لتحميل الملفات - Tool for downloading files
    curl \
    # مكتبات الصور - Image processing libraries
    libpng-dev \
    # مكتبة معالجة النصوص - Text processing library
    libonig-dev \
    # مكتبة معالجة XML - XML processing library
    libxml2-dev \
    # مكتبة ضغط الملفات - Compression library
    libzip-dev \
    # أدوات ضغط الملفات - ZIP utilities
    zip \
    unzip \
    # أدوات لإدارة العمليات - Process management
    supervisor \
    # مكتبة التعامل مع SSL - SSL library
    libssl-dev \
    # تثبيت إضافات PHP المطلوبة
    # Install required PHP extensions
    && docker-php-ext-install \
    # اتصال قاعدة البيانات - Database connection
    pdo_mysql \
    # معالجة النصوص متعددة البايت - Multibyte string processing
    mbstring \
    # معالجة البيانات الوصفية للصور - Image metadata processing
    exif \
    # التحكم في العمليات - Process control
    pcntl \
    # العمليات الحسابية - Mathematical operations
    bcmath \
    # معالجة الصور - Image processing
    gd \
    # ضغط الملفات - ZIP compression
    zip \
    # جلسات العمل - Sessions
    sockets

# -----------------------------------------------------------------------------
# تنظيف ذاكرة التخزين المؤقت لتقليل حجم الصورة
# Clear cache to reduce image size
# -----------------------------------------------------------------------------
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# -----------------------------------------------------------------------------
# تثبيت Composer (مدير حزم PHP)
# Install Composer (PHP package manager)
# -----------------------------------------------------------------------------
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# -----------------------------------------------------------------------------
# نسخ إعدادات PHP المخصصة
# Copy custom PHP configuration
# -----------------------------------------------------------------------------
# زيادة حدود الذاكرة والأداء
# Increase memory and performance limits
RUN echo "memory_limit = 512M" >> /usr/local/etc/php/conf.d/docker-php-memlimit.ini \
    && echo "upload_max_filesize = 64M" >> /usr/local/etc/php/conf.d/docker-php-uploads.ini \
    && echo "post_max_size = 64M" >> /usr/local/etc/php/conf.d/docker-php-uploads.ini \
    && echo "max_execution_time = 300" >> /usr/local/etc/php/conf.d/docker-php-execution.ini \
    && echo "max_input_time = 300" >> /usr/local/etc/php/conf.d/docker-php-execution.ini

# -----------------------------------------------------------------------------
# نسخ ملفات المشروع
# Copy project files
# -----------------------------------------------------------------------------
# نسخ ملفات الواجهة الخلفية (Laravel)
# Copy backend files (Laravel)
COPY backend/ ./backend/

# نسخ ملفات الواجهة الأمامية المبنية من المرحلة الأولى
# Copy built frontend files from first stage
COPY --from=frontend-builder /app/dist/ ./public/

# نسخ ملفات الإعدادات
# Copy configuration files
COPY .env* ./
COPY constants.ts ./
COPY types.ts ./

# -----------------------------------------------------------------------------
# تثبيت اعتماديات PHP عبر Composer
# Install PHP dependencies via Composer
# -----------------------------------------------------------------------------
WORKDIR /var/www/html/backend

# تثبيت الاعتماديات دون أدوات التطوير
# Install dependencies without dev tools
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# -----------------------------------------------------------------------------
# إعداد الأذونات والملكية
# Setup permissions and ownership
# -----------------------------------------------------------------------------
# إنشاء مجلدات التخزين والكاش إذا لم تكن موجودة
# Create storage and cache directories if they don't exist
RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views \
    storage/logs storage/app/public bootstrap/cache \
    # تغيير الملكية للمستخدم www-data
    # Change ownership to www-data user
    && chown -R www-data:www-data /var/www/html \
    # إعداد الأذونات المناسبة
    # Set appropriate permissions
    && chmod -R 775 storage bootstrap/cache \
    && chmod -R 775 storage/logs

# -----------------------------------------------------------------------------
# تكوين Apache
# Apache Configuration
# -----------------------------------------------------------------------------
# تمكين وحدة إعادة كتابة الروابط
# Enable rewrite module
RUN a2enmod rewrite headers ssl deflate expires

# نسخ إعدادات Apache المخصصة
# Copy custom Apache configuration
COPY docker/apache/000-default.conf /etc/apache2/sites-available/000-default.conf

# تفعيل الإعدادات
# Enable the configuration
RUN a2ensite 000-default.conf

# -----------------------------------------------------------------------------
# إعداد متغيرات البيئة والنصوص البرمجية
# Environment setup and scripts
# -----------------------------------------------------------------------------
WORKDIR /var/www/html

# إنشاء سكربت بدء التشغيل
# Create startup script
RUN echo '#!/bin/bash\n\
    # =============================================================================\n#
    # سكربت بدء تشغيل التطبيق\n# Application startup script\n#
    # =============================================================================\n\
    \n\
    echo "========================================"\n\
    echo "بدء تشغيل SEMO Application..."\n\
    echo "Starting SEMO Application..."\n\
    echo "========================================"\n\
    \n\
    # الانتظار حتى تكون قاعدة البيانات جاهزة\n# Wait for database to be ready\n\
    sleep 5\n\
    \n\
    # تنفيذ أوامر Laravel\n# Execute Laravel commands\n\
    cd /var/www/html/backend\n\
    \n\
    # إنشاء مفتاح التطبيق إذا لم يكن موجوداً\n# Generate app key if not exists\n\
    if [ -z "$APP_KEY" ]; then\n\
    php artisan key:generate --ansi\n\
    fi\n\
    \n\
    # تشغيل الهجرات\n# Run migrations\n\
    php artisan migrate --force --ansi\n\
    \n\
    # تحسين الأداء\n# Performance optimizations\n\
    php artisan config:cache\n\
    php artisan route:cache\n\
    php artisan view:cache\n\
    php artisan event:cache\n\
    \n\
    # إنشاء رابط تخزين\n# Create storage link\n\
    php artisan storage:link --ansi 2>/dev/null || true\n\
    \n\
    # ضبط الأذونات النهائية\n# Final permissions setup\n\
    chown -R www-data:www-data /var/www/html\n\
    chmod -R 775 /var/www/html/backend/storage\n\
    chmod -R 775 /var/www/html/backend/bootstrap/cache\n\
    \n\
    echo "========================================"\n\
    echo "تم بدء التطبيق بنجاح!"\n\
    echo "Application started successfully!"\n\
    echo "========================================"\n\
    \n\
    # بدء Apache في المقدمة\n# Start Apache in foreground\n\
    exec apache2-foreground' > /usr/local/bin/start.sh \
    && chmod +x /usr/local/bin/start.sh

# -----------------------------------------------------------------------------
# إعداد المنافذ والأوامر النهائية
# Ports and final commands
# -----------------------------------------------------------------------------
# فتح المنفذ 80 للاتصالات الواردة
# Expose port 80 for incoming connections
EXPOSE 80

# أمر التشغيل الافتراضي
# Default command to run
CMD ["/usr/local/bin/start.sh"]

# -----------------------------------------------------------------------------
# معلومات إضافية
# Additional Information
# -----------------------------------------------------------------------------
# صحة الحاوية - Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1
