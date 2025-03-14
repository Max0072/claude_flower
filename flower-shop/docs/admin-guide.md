# Руководство администратора по онлайн-магазину цветов "Флора"

## Содержание

1. [Введение](#введение)
2. [Вход в административную панель](#вход-в-административную-панель)
3. [Обзор административной панели](#обзор-административной-панели)
4. [Управление товарами](#управление-товарами)
5. [Управление категориями](#управление-категориями)
6. [Управление заказами](#управление-заказами)
7. [Управление пользователями](#управление-пользователями)
8. [Настройки магазина](#настройки-магазина)
9. [Отчеты и аналитика](#отчеты-и-аналитика)
10. [Управление контентом](#управление-контентом)
11. [Техническая поддержка](#техническая-поддержка)

## Введение

Данное руководство предназначено для администраторов онлайн-магазина цветов "Флора". В нем описаны все функции административной панели, которые позволяют управлять товарами, заказами, пользователями и другими аспектами работы магазина.

## Вход в административную панель

1. Перейдите на страницу [https://flora-shop.example.com/admin](https://flora-shop.example.com/admin)
2. Введите ваш логин (email) и пароль
3. Нажмите кнопку "Войти"

**Важно**: При первом входе в систему необходимо сменить временный пароль на постоянный.

## Обзор административной панели

После входа вы увидите главную страницу административной панели, которая содержит:

- **Панель мониторинга** - основные показатели работы магазина
- **Навигационное меню** - доступ ко всем разделам администрирования
- **Уведомления** - информация о новых заказах, отзывах и т.д.
- **Быстрые действия** - часто используемые функции

## Управление товарами

### Просмотр списка товаров

1. В левом меню выберите "Товары" > "Все товары"
2. Вы увидите список всех товаров с основной информацией:
   - ID товара
   - Название
   - Категория
   - Цена
   - Статус (в наличии/нет в наличии)
   - Дата добавления

### Добавление нового товара

1. В разделе "Товары" нажмите кнопку "Добавить товар"
2. Заполните форму с информацией о товаре:
   - **Основная информация**:
     - Название товара
     - Описание
     - Категория
     - Цена
     - Цена со скидкой (если применимо)
   - **Изображения**:
     - Загрузите основное изображение товара
     - Добавьте дополнительные изображения (до 5 штук)
   - **Детали товара**:
     - Состав букета (список цветов и их количество)
     - Размеры (высота и ширина)
     - Срок свежести
     - Инструкция по уходу
   - **Настройки отображения**:
     - Статус (опубликован/черновик)
     - Наличие на складе
     - Рекомендуемый товар
3. Нажмите кнопку "Сохранить"

### Редактирование товара

1. В списке товаров найдите нужный товар и нажмите на иконку редактирования или на название товара
2. Внесите необходимые изменения в форму
3. Нажмите кнопку "Сохранить изменения"

### Управление запасами

1. В левом меню выберите "Товары" > "Управление запасами"
2. Для каждого товара вы можете:
   - Обновить статус наличия
   - Указать ограничение по количеству (для товаров с ограниченным запасом)

### Импорт/экспорт товаров

1. В разделе "Товары" нажмите кнопку "Импорт/Экспорт"
2. Для экспорта выберите "Экспортировать товары" и формат файла (CSV, Excel)
3. Для импорта:
   - Скачайте шаблон файла импорта
   - Заполните шаблон данными
   - Загрузите заполненный файл
   - Следуйте инструкциям мастера импорта

## Управление категориями

### Просмотр категорий

1. В левом меню выберите "Товары" > "Категории"
2. Вы увидите список всех категорий с информацией:
   - Название категории
   - Описание
   - Количество товаров
   - Статус (активна/неактивна)

### Добавление новой категории

1. В разделе "Категории" нажмите кнопку "Добавить категорию"
2. Заполните форму:
   - Название категории
   - Описание
   - Родительская категория (если применимо)
   - Изображение категории
   - Статус (активна/неактивна)
3. Нажмите кнопку "Сохранить"

### Редактирование категории

1. В списке категорий найдите нужную категорию и нажмите на иконку редактирования
2. Внесите необходимые изменения
3. Нажмите кнопку "Сохранить изменения"

## Управление заказами

### Просмотр списка заказов

1. В левом меню выберите "Заказы" > "Все заказы"
2. Вы увидите список всех заказов с информацией:
   - Номер заказа
   - Дата и время
   - Информация о клиенте
   - Сумма заказа
   - Статус заказа
   - Способ оплаты

### Просмотр деталей заказа

1. В списке заказов нажмите на номер заказа
2. На странице деталей заказа вы увидите:
   - Информацию о клиенте
   - Адрес доставки
   - Список товаров в заказе
   - Информацию об оплате
   - Историю статусов заказа

### Изменение статуса заказа

1. На странице деталей заказа найдите раздел "Статус заказа"
2. Выберите новый статус из выпадающего списка:
   - Оформлен
   - Подтвержден
   - В сборке
   - Передан в доставку
   - Доставлен
   - Отменен
3. При необходимости добавьте комментарий
4. Нажмите кнопку "Обновить статус"

**Примечание**: При изменении статуса клиент получит уведомление по email.

### Управление доставкой

1. На странице деталей заказа найдите раздел "Информация о доставке"
2. Вы можете:
   - Назначить курьера
   - Указать трек-номер (если применимо)
   - Обновить ожидаемое время доставки
3. После обновления информации нажмите "Сохранить"

## Управление пользователями

### Просмотр списка пользователей

1. В левом меню выберите "Пользователи" > "Все пользователи"
2. Вы увидите список всех зарегистрированных пользователей с информацией:
   - ID пользователя
   - Имя
   - Email
   - Дата регистрации
   - Количество заказов
   - Роль (пользователь/администратор)

### Добавление нового пользователя

1. В разделе "Пользователи" нажмите кнопку "Добавить пользователя"
2. Заполните форму:
   - Имя
   - Email
   - Пароль
   - Телефон (опционально)
   - Роль (пользователь/администратор)
3. Нажмите кнопку "Создать"

### Редактирование пользователя

1. В списке пользователей найдите нужного пользователя и нажмите на иконку редактирования
2. Внесите необходимые изменения
3. Нажмите кнопку "Сохранить изменения"

### Управление правами доступа

1. В левом меню выберите "Пользователи" > "Роли и разрешения"
2. Вы можете:
   - Просматривать существующие роли
   - Создавать новые роли
   - Настраивать разрешения для каждой роли

## Настройки магазина

### Общие настройки

1. В левом меню выберите "Настройки" > "Общие"
2. Вы можете настроить:
   - Название магазина
   - Контактный email и телефон
   - Адрес магазина
   - Логотип и фавикон
   - Часы работы

### Настройки доставки

1. В левом меню выберите "Настройки" > "Доставка"
2. Вы можете настроить:
   - Способы доставки
   - Зоны доставки
   - Стоимость доставки
   - Временные слоты для доставки

### Настройки оплаты

1. В левом меню выберите "Настройки" > "Оплата"
2. Вы можете настроить:
   - Способы оплаты
   - Настройки платежных шлюзов
   - Валюта и формат цен

### Настройки уведомлений

1. В левом меню выберите "Настройки" > "Уведомления"
2. Вы можете настроить:
   - Шаблоны email-уведомлений
   - Настройки SMS-уведомлений
   - Триггеры для отправки уведомлений

## Отчеты и аналитика

### Отчет по продажам

1. В левом меню выберите "Отчеты" > "Продажи"
2. Вы можете:
   - Выбрать период для анализа
   - Просмотреть общую сумму продаж
   - Увидеть количество заказов
   - Проанализировать средний чек
   - Экспортировать отчет в CSV или Excel

### Отчет по товарам

1. В левом меню выберите "Отчеты" > "Товары"
2. Вы можете:
   - Увидеть самые популярные товары
   - Проанализировать продажи по категориям
   - Выявить товары с низкими продажами

### Отчет по клиентам

1. В левом меню выберите "Отчеты" > "Клиенты"
2. Вы можете:
   - Увидеть активность клиентов
   - Проанализировать частоту заказов
   - Выявить постоянных клиентов

### Аналитика сайта

1. В левом меню выберите "Отчеты" > "Аналитика сайта"
2. Вы увидите интеграцию с Google Analytics или другими системами аналитики

## Управление контентом

### Управление страницами

1. В левом меню выберите "Контент" > "Страницы"
2. Вы можете:
   - Просматривать существующие страницы
   - Создавать новые страницы
   - Редактировать содержимое страниц

### Управление баннерами

1. В левом меню выберите "Контент" > "Баннеры"
2. Вы можете:
   - Добавлять баннеры на главную страницу
   - Настраивать слайдер
   - Устанавливать сроки отображения баннеров

### Управление акциями

1. В левом меню выберите "Контент" > "Акции"
2. Вы можете:
   - Создавать новые акции
   - Настраивать условия акций
   - Устанавливать сроки действия акций

## Техническая поддержка

### Обращение в поддержку

Если у вас возникли проблемы с административной панелью или вам нужна помощь, вы можете:

1. Отправить запрос через форму обратной связи в разделе "Поддержка"
2. Связаться с технической поддержкой по телефону: +7 (XXX) XXX-XX-XX
3. Отправить email на адрес: support@flora-shop.example.com

### Документация

Полная документация по административной панели доступна в разделе "Поддержка" > "Документация".