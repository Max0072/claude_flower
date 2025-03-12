# Схема базы данных

## Коллекции MongoDB

### Products (Товары)
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  discountPrice: Number,
  category: String,
  subcategory: String,
  images: [String],
  details: {
    composition: [String],
    size: String,
    freshness: String,
    careInstructions: String
  },
  inStock: Boolean,
  featured: Boolean,
  rating: Number,
  numReviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Users (Пользователи)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String, // хэшированный пароль
  phone: String,
  role: String, // "user", "admin"
  addresses: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    isDefault: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Orders (Заказы)
```javascript
{
  _id: ObjectId,
  user: {
    _id: ObjectId,
    name: String,
    email: String
  },
  orderItems: [{
    product: {
      _id: ObjectId,
      name: String,
      price: Number,
      image: String
    },
    quantity: Number,
    price: Number
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  paymentMethod: String,
  paymentResult: {
    id: String,
    status: String,
    updateTime: String,
    email: String
  },
  itemsPrice: Number,
  shippingPrice: Number,
  taxPrice: Number,
  totalPrice: Number,
  isPaid: Boolean,
  paidAt: Date,
  isDelivered: Boolean,
  deliveredAt: Date,
  deliveryInfo: {
    trackingNumber: String,
    estimatedDelivery: Date,
    courier: String
  },
  status: String, // "pending", "processing", "shipped", "delivered", "cancelled"
  createdAt: Date,
  updatedAt: Date
}
```

### Carts (Корзины)
```javascript
{
  _id: ObjectId,
  user: ObjectId,
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number,
    name: String,
    image: String
  }],
  totalAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Reviews (Отзывы)
```javascript
{
  _id: ObjectId,
  product: ObjectId,
  user: {
    _id: ObjectId,
    name: String
  },
  rating: Number,
  comment: String,
  createdAt: Date
}
```

### Categories (Категории)
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,
  description: String,
  image: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Индексы

### Products
- `{ name: 1 }` - для поиска по имени
- `{ category: 1 }` - для фильтрации по категории
- `{ price: 1 }` - для сортировки и фильтрации по цене
- `{ featured: 1 }` - для быстрого доступа к рекомендуемым товарам

### Users
- `{ email: 1 }` - уникальный индекс для быстрого поиска пользователей

### Orders
- `{ user: 1 }` - для быстрого поиска заказов пользователя
- `{ "paymentResult.id": 1 }` - для поиска по ID платежа
- `{ status: 1 }` - для фильтрации заказов по статусу

### Carts
- `{ user: 1 }` - уникальный индекс для быстрого доступа к корзине пользователя

### Reviews
- `{ product: 1 }` - для получения всех отзывов о продукте
- `{ "user._id": 1, product: 1 }` - для проверки, оставил ли пользователь отзыв о продукте