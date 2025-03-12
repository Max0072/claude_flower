import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../redux/api/userApi';
import { useAppDispatch } from '../../redux/hooks';
import { setUser } from '../../redux/slices/userSlice';
import { validateLogin, ValidationError } from '../../utils/validation';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationError>({});
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Use the login mutation from userApi
  const [login, { isLoading, error }] = useLoginMutation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateLogin(email, password);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      // Call the login API
      const userData = await login({ email, password }).unwrap();
      
      // Update Redux store with user data
      dispatch(setUser(userData));
      
      // Redirect to homepage or previous page
      navigate('/');
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };
  
  return (
    <div className="login-form">
      <h2>Вход в аккаунт</h2>
      
      {error && (
        <div className="alert alert-danger">
          {(error as any)?.data?.message || 'Ошибка при входе в систему'}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
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
        
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;