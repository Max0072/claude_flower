const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Флора API',
      version: '1.0.0',
      description: 'API для онлайн-магазина цветов Флора',
      contact: {
        name: 'Команда поддержки',
        email: 'support@flora-shop.example.com',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API сервер',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Product: {
          type: 'object',
          required: ['name', 'price', 'description', 'category'],
          properties: {
            id: {
              type: 'string',
              description: 'Уникальный идентификатор товара',
              example: '60d21b4667d0d8992e610c85',
            },
            name: {
              type: 'string',
              description: 'Название товара',
              example: 'Букет роз',
            },
            description: {
              type: 'string',
              description: 'Описание товара',
              example: 'Красивый букет из 11 роз',
            },
            price: {
              type: 'number',
              description: 'Цена товара в рублях',
              example: 1500,
            },
            discountPrice: {
              type: 'number',
              description: 'Цена товара со скидкой в рублях',
              example: 1300,
            },
            category: {
              type: 'string',
              description: 'Категория товара',
              example: 'roses',
            },
            subcategory: {
              type: 'string',
              description: 'Подкатегория товара',
              example: 'red-roses',
            },
            images: {
              type: 'array',
              description: 'Массив URL изображений товара',
              items: {
                type: 'string',
                example: '/images/bouquet1.jpg',
              },
            },
            details: {
              type: 'object',
              properties: {
                composition: {
                  type: 'array',
                  items: {
                    type: 'string',
                    example: 'Розы красные - 11 шт',
                  },
                },
                size: {
                  type: 'string',
                  example: 'средний',
                },
                freshness: {
                  type: 'string',
                  example: '7 дней',
                },
                careInstructions: {
                  type: 'string',
                  example: 'Держать в воде, менять воду каждый день',
                },
              },
            },
            inStock: {
              type: 'boolean',
              description: 'Наличие товара на складе',
              example: true,
            },
            featured: {
              type: 'boolean',
              description: 'Показывать ли товар в разделе рекомендуемых',
              example: false,
            },
            rating: {
              type: 'number',
              description: 'Средний рейтинг товара от 0 до 5',
              example: 4.5,
            },
            numReviews: {
              type: 'number',
              description: 'Количество отзывов на товар',
              example: 12,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания товара',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата последнего обновления товара',
            },
          },
        },
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            id: {
              type: 'string',
              description: 'Уникальный идентификатор пользователя',
              example: '60d21b4667d0d8992e610c86',
            },
            name: {
              type: 'string',
              description: 'Имя пользователя',
              example: 'Иван Иванов',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email пользователя',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              description: 'Пароль пользователя (никогда не возвращается в ответе)',
              example: 'password123',
            },
            phone: {
              type: 'string',
              description: 'Номер телефона пользователя',
              example: '+7 (999) 123-45-67',
            },
            role: {
              type: 'string',
              description: 'Роль пользователя',
              enum: ['user', 'admin'],
              example: 'user',
            },
            addresses: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  street: {
                    type: 'string',
                    example: 'ул. Ленина 10',
                  },
                  city: {
                    type: 'string',
                    example: 'Москва',
                  },
                  state: {
                    type: 'string',
                    example: 'Москва',
                  },
                  zipCode: {
                    type: 'string',
                    example: '123456',
                  },
                  isDefault: {
                    type: 'boolean',
                    example: true,
                  },
                },
              },
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Уникальный идентификатор заказа',
              example: '60d21b4667d0d8992e610c87',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: '60d21b4667d0d8992e610c86',
                },
                name: {
                  type: 'string',
                  example: 'Иван Иванов',
                },
                email: {
                  type: 'string',
                  example: 'user@example.com',
                },
              },
            },
            orderItems: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        example: '60d21b4667d0d8992e610c85',
                      },
                      name: {
                        type: 'string',
                        example: 'Букет роз',
                      },
                      price: {
                        type: 'number',
                        example: 1500,
                      },
                      image: {
                        type: 'string',
                        example: '/images/bouquet1.jpg',
                      },
                    },
                  },
                  quantity: {
                    type: 'number',
                    example: 2,
                  },
                  price: {
                    type: 'number',
                    example: 1500,
                  },
                },
              },
            },
            shippingAddress: {
              type: 'object',
              properties: {
                street: {
                  type: 'string',
                  example: 'ул. Ленина 10',
                },
                city: {
                  type: 'string',
                  example: 'Москва',
                },
                state: {
                  type: 'string',
                  example: 'Москва',
                },
                zipCode: {
                  type: 'string',
                  example: '123456',
                },
              },
            },
            paymentMethod: {
              type: 'string',
              example: 'card',
            },
            paymentResult: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: 'pi_1IvDQx2eZvKYlo2C0QetBpQH',
                },
                status: {
                  type: 'string',
                  example: 'succeeded',
                },
                updateTime: {
                  type: 'string',
                  example: '2023-01-15T12:00:00Z',
                },
                email: {
                  type: 'string',
                  example: 'user@example.com',
                },
              },
            },
            itemsPrice: {
              type: 'number',
              example: 3000,
            },
            shippingPrice: {
              type: 'number',
              example: 300,
            },
            taxPrice: {
              type: 'number',
              example: 0,
            },
            totalPrice: {
              type: 'number',
              example: 3300,
            },
            isPaid: {
              type: 'boolean',
              example: true,
            },
            paidAt: {
              type: 'string',
              format: 'date-time',
            },
            isDelivered: {
              type: 'boolean',
              example: false,
            },
            deliveredAt: {
              type: 'string',
              format: 'date-time',
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
              example: 'processing',
            },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Уникальный идентификатор корзины',
            },
            user: {
              type: 'string',
              description: 'ID пользователя-владельца корзины',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: {
                    type: 'string',
                    description: 'ID товара',
                  },
                  quantity: {
                    type: 'number',
                    example: 2,
                  },
                  price: {
                    type: 'number',
                    example: 1500,
                  },
                  name: {
                    type: 'string',
                    example: 'Букет роз',
                  },
                  image: {
                    type: 'string',
                    example: '/images/bouquet1.jpg',
                  },
                },
              },
            },
            totalAmount: {
              type: 'number',
              example: 3000,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Сообщение об ошибке',
              example: 'Товар не найден',
            },
            stack: {
              type: 'string',
              description: 'Стек ошибки (только в режиме разработки)',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API routes files
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Function to setup Swagger in the Express app
const setupSwagger = (app) => {
  // Serve swagger docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Serve swagger spec as JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('Swagger documentation available at /api-docs');
};

module.exports = setupSwagger;