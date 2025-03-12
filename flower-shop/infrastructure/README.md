# Инфраструктура онлайн-магазина цветов "Флора"

Этот каталог содержит файлы конфигурации инфраструктуры для проекта онлайн-магазина цветов "Флора".

## Docker

### Конфигурация для разработки

Для локальной разработки используется `docker-compose.dev.yml`. Он предоставляет следующие сервисы:

- Frontend: React приложение на порту 3000
- Backend: Express API на порту 5000
- MongoDB: База данных на порту 27017
- Redis: Кэширование на порту 6379

Запуск среды разработки:

```bash
docker-compose -f infrastructure/docker-compose.dev.yml up
```

### Конфигурация для продакшн

Для продакшн окружения используется `docker-compose.prod.yml`. Основные отличия от dev-окружения:

- Оптимизированные образы
- Настройки безопасности
- Nginx в качестве обратного прокси
- SSL шифрование

Запуск продакшн окружения:

```bash
docker-compose -f infrastructure/docker-compose.prod.yml up -d
```

## Мониторинг

Для мониторинга используются следующие инструменты:

- Prometheus: Сбор метрик
- Grafana: Визуализация метрик
- Node Exporter: Метрики хост-системы
- cAdvisor: Метрики Docker-контейнеров

Запуск системы мониторинга:

```bash
docker-compose -f infrastructure/monitoring/docker-compose.monitoring.yml up -d
```

После запуска:
- Prometheus доступен на порту 9090
- Grafana доступна на порту 3100 (логин: admin, пароль: admin)
- Предустановленные дашборды для мониторинга сервисов

## CI/CD

Проект использует GitHub Actions для непрерывной интеграции и доставки.

### Пайплайны

1. CI Pipeline (`.github/workflows/ci.yml`):
   - Линтинг кода
   - Запуск тестов
   - Сборка Docker-образов

2. Deploy Pipeline (`.github/workflows/deploy.yml`):
   - Деплой на staging
   - Ручное подтверждение для деплоя на production
   - Деплой на production после подтверждения

## Структура каталога

```
/infrastructure
│
├── docker-compose.yml       # Основная конфигурация Docker Compose
├── docker-compose.dev.yml   # Конфигурация для разработки
├── docker-compose.prod.yml  # Конфигурация для продакшн
│
├── nginx/                   # Конфигурация Nginx
│   └── nginx.conf           # Основной конфиг Nginx
│
└── monitoring/              # Инструменты мониторинга
    ├── docker-compose.monitoring.yml  # Docker Compose для мониторинга
    ├── prometheus.yml                 # Конфигурация Prometheus
    └── grafana/                       # Конфигурация Grafana
        └── provisioning/              # Автоматическая настройка Grafana
            ├── dashboards/            # Предустановленные дашборды
            └── datasources/           # Источники данных
```

## Масштабирование

Для масштабирования приложения в production рекомендуется использовать:

1. Несколько реплик backend и frontend через Docker Swarm или Kubernetes
2. Балансировщик нагрузки, например, Traefik или Nginx Ingress
3. Репликация базы данных MongoDB