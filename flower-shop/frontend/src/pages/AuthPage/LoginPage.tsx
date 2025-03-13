import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="login-page container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="auth-card">
            <LoginForm />
            <div className="auth-links mt-3 text-center">
              <p>
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
              </p>
              <p>
                <Link to="/forgot-password">Забыли пароль?</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;