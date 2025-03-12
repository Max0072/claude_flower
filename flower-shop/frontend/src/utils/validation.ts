export interface ValidationError {
  [key: string]: string;
}

// Login form validation
export const validateLogin = (
  email: string,
  password: string
): ValidationError => {
  const errors: ValidationError = {};

  if (!email) {
    errors.email = 'Email обязателен';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Некорректный email';
  }

  if (!password) {
    errors.password = 'Пароль обязателен';
  } else if (password.length < 6) {
    errors.password = 'Пароль должен содержать минимум 6 символов';
  }

  return errors;
};

// Registration form validation
export const validateRegistration = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationError => {
  const errors: ValidationError = {};

  if (!name) {
    errors.name = 'Имя обязательно';
  } else if (name.length < 2) {
    errors.name = 'Имя должно содержать минимум 2 символа';
  }

  if (!email) {
    errors.email = 'Email обязателен';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Некорректный email';
  }

  if (!password) {
    errors.password = 'Пароль обязателен';
  } else if (password.length < 6) {
    errors.password = 'Пароль должен содержать минимум 6 символов';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают';
  }

  return errors;
};

// Order form validation
export const validateOrder = (
  street: string,
  city: string,
  zipCode: string,
  paymentMethod: string
): ValidationError => {
  const errors: ValidationError = {};

  if (!street) {
    errors.street = 'Улица обязательна';
  }

  if (!city) {
    errors.city = 'Город обязателен';
  }

  if (!zipCode) {
    errors.zipCode = 'Почтовый индекс обязателен';
  } else if (!/^\d{6}$/.test(zipCode)) {
    errors.zipCode = 'Некорректный почтовый индекс';
  }

  if (!paymentMethod) {
    errors.paymentMethod = 'Метод оплаты обязателен';
  }

  return errors;
};