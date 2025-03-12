#!/bin/bash

# Скрипт быстрого деплоя онлайн-магазина цветов "Флора"
# Разработан для демонстрации текущего прогресса

set -e

echo "🚀 Начинаем быстрый деплой онлайн-магазина цветов \"Флора\""

# Определяем корневую директорию проекта
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Переходим в корневую директорию проекта
cd "$ROOT_DIR"

echo "📂 Работаем с директорией: $ROOT_DIR"

# Проверяем наличие docker и docker-compose
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker перед запуском скрипта."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose перед запуском скрипта."
    exit 1
fi

echo "✅ Docker и Docker Compose установлены"

# Создаем .env файл для backend, если он не существует
if [ ! -f "$ROOT_DIR/backend/.env" ]; then
    echo "📝 Создание .env файла для backend..."
    cp "$ROOT_DIR/backend/.env.example" "$ROOT_DIR/backend/.env"
    # Генерируем случайный JWT секрет
    JWT_SECRET=$(openssl rand -hex 32)
    # Заменяем JWT секрет в .env файле
    sed -i '' "s/your_jwt_secret_key_here/$JWT_SECRET/g" "$ROOT_DIR/backend/.env" || \
    sed -i "s/your_jwt_secret_key_here/$JWT_SECRET/g" "$ROOT_DIR/backend/.env"
    echo "✅ .env файл для backend создан"
fi

# Запускаем сборку и запуск контейнеров
echo "🔨 Сборка и запуск контейнеров..."
cd "$ROOT_DIR/infrastructure"
docker-compose -f docker-compose.yml up -d --build

echo "⏳ Ожидаем запуска сервисов..."
sleep 10

# Проверяем, что все контейнеры запущены
CONTAINERS=$(docker-compose -f docker-compose.yml ps -q)
for CONTAINER in $CONTAINERS; do
    STATUS=$(docker inspect --format='{{.State.Status}}' $CONTAINER)
    if [ "$STATUS" != "running" ]; then
        echo "❌ Контейнер $CONTAINER не запущен (статус: $STATUS)."
        echo "Проверьте логи: docker-compose -f docker-compose.yml logs"
        exit 1
    fi
done

echo "✅ Все контейнеры успешно запущены"

# Выводим информацию о доступе к сервисам
echo ""
echo "🌸 Онлайн-магазин цветов \"Флора\" успешно развернут!"
echo ""
echo "📱 Фронтенд доступен по адресу: http://localhost:3000"
echo "🔌 Бэкенд API доступен по адресу: http://localhost:5000/api/v1"
echo "💾 MongoDB доступна по адресу: mongodb://localhost:27017/flora"
echo ""
echo "🔍 Для просмотра логов контейнеров используйте команду:"
echo "  docker-compose -f $ROOT_DIR/infrastructure/docker-compose.yml logs -f"
echo ""
echo "🛑 Для остановки всех контейнеров используйте команду:"
echo "  docker-compose -f $ROOT_DIR/infrastructure/docker-compose.yml down"
echo ""
echo "Документация по проекту доступна в директории: $ROOT_DIR/docs"
echo ""
echo "⚠️ Примечание: это демонстрационная версия для показа текущего прогресса"