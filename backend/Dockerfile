FROM php:8.3-fpm

# System dependencies
RUN apt-get update && apt-get install -y \
    git unzip libpng-dev libonig-dev libxml2-dev curl libzip-dev zip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-interaction --optimize-autoloader

# wait-for-it для чекання MySQL
COPY wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

EXPOSE 8000

# Очікуємо базу і запускаємо Laravel
# У Dockerfile або docker-compose.yml:
CMD ["sh", "-c", "sleep 15 && php artisan migrate --force && php artisan db:seed && php artisan serve --host=0.0.0.0 --port=8000"]