#!/bin/sh

# Laravel Serve Script with SQLite Configuration
# This script starts the Laravel development server with SQLite database settings

echo "🚀 Starting Laravel server with SQLite database..."

# Set environment variables for SQLite
export DB_CONNECTION=sqlite
export DB_DATABASE=/home/nixi/Документи/GitHub/my-lar-project/database/database.sqlite

# Start the Laravel development server
php artisan serve --host=127.0.0.1 --port=8000

echo "✅ Laravel server stopped."
