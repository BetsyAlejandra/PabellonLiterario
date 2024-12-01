import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
      navigate('/profile');
    } catch (error) {
      setError('Credenciales inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card login-card">
        <div className="card-body">
          <h2 className="card-title text-center">Iniciar sesión</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <button type="submit" className="btn btn-primary1 w-100" disabled={loading}>
              {loading ? 'Cargando...' : 'Iniciar sesión'}
            </button>
          </form>
          <div className="mt-3 text-center">
            <a href="/password-reset-request" className="forgot-password-link">¿Olvidaste tu contraseña?</a>
          </div>
          <div className="mt-3 text-center">
            <p>¿No tienes cuenta? <a href="/register" className="register-link">Regístrate</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;