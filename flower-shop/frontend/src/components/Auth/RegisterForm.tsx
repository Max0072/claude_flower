import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../redux/api/userApi';
import { useAppDispatch } from '../../redux/hooks';
import { setUser } from '../../redux/slices/userSlice';
import { validateRegistration, ValidationError } from '../../utils/validation';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ValidationError>({});
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Use the register mutation from userApi
  const [register, { isLoading, error }] = useRegisterMutation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateRegistration(name, email, password, confirmPassword);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      // Call the register API
      const userData = await register({ name, email, password }).unwrap();
      
      // Update Redux store with user data
      dispatch(setUser(userData));
      
      // Redirect to homepage
      navigate('/');
    } catch (err) {
      console.error('Failed to register:', err);
    }
  };
  
  return (
    <div className="register-form">
      <h2>Регистрация аккаунта</h2>
      
      {error && (
        <div className="alert alert-danger">
          {(error as any)?.data?.message || 'Ошибка при регистрации'}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Имя</label>
          <input
            type="text"
            id="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <div className="form-error">{errors.password}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Подтверждение пароля</label>
          <input
            type="password"
            id="confirmPassword"
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
        </div>
        
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;