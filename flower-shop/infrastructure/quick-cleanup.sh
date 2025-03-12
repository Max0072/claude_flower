#!/bin/bash

# Скрипт быстрой очистки контейнеров онлайн-магазина цветов "Флора"

set -e

echo "🧹 Начинаем очистку контейнеров онлайн-магазина цветов \"Флора\""

# Определяем корневую директорию проекта
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Переходим в корневую директорию проекта
cd "$ROOT_DIR/infrastructure"

echo "📂 Работаем с директорией: $ROOT_DIR/infrastructure"

# Останавливаем и удаляем контейнеры
echo "🛑 Останавливаем и удаляем контейнеры..."
docker-compose -f docker-compose.yml down

# Спрашиваем, нужно ли удалить все тома (данные)
read -p "❓ Удалить все данные (Docker volumes)? [y/N] " REMOVE_VOLUMES
if [[ $REMOVE_VOLUMES =~ ^[Yy]$ ]]; then
    echo "🗑️ Удаляем все тома с данными..."
    docker-compose -f docker-compose.yml down -v
    echo "✅ Все тома удалены"
fi

# Спрашиваем, нужно ли удалить все образы
read -p "❓ Удалить все Docker образы проекта? [y/N] " REMOVE_IMAGES
if [[ $REMOVE_IMAGES =~ ^[Yy]$ ]]; then
    echo "🗑️ Удаляем все Docker образы проекта..."
    docker rmi $(docker images 'flora/*' -q) 2>/dev/null || echo "Образы не найдены"
    echo "✅ Все образы проекта удалены"
fi

# Спрашиваем, нужно ли очистить неиспользуемые образы, контейнеры и сети
read -p "❓ Выполнить полную очистку Docker (prune)? [y/N] " PRUNE_DOCKER
if [[ $PRUNE_DOCKER =~ ^[Yy]$ ]]; then
    echo "🧹 Выполняем полную очистку Docker..."
    docker system prune -f
    echo "✅ Очистка завершена"
fi

echo ""
echo "✅ Очистка завершена! Все контейнеры остановлены и удалены."
echo "Для повторного запуска проекта используйте скрипт deploy.sh"