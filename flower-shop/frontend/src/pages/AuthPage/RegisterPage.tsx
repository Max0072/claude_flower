import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/Auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div className="register-page container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="auth-card">
            <RegisterForm />
            <div className="auth-links mt-3 text-center">
              <p>
                Уже есть аккаунт? <Link to="/login">Войти</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;