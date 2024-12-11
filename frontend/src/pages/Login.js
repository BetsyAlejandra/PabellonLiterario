import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaDragon, FaUserShield } from 'react-icons/fa'; // Importar más íconos de react-icons
import '../styles/Login.css'; // Asegúrate de crear este archivo

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
        '/api/users/login',
        { email, password },
        {
          withCredentials: true, // Asegura que las cookies se envíen
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      navigate('/profile');
      window.location.reload();
    } catch (error) {
      setError('Credenciales inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="card login-card shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-center fantasy-title"><FaDragon /> <FaUserShield /> Iniciar sesión</h2>
          {error && <div className="alert alert-danger fantasy-alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="fantasy-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control fantasy-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label className="fantasy-label">Contraseña</label>
              <input
                type="password"
                className="form-control fantasy-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <button type="submit" className="btn fantasy-button w-100" disabled={loading}>
              {loading ? 'Cargando...' : 'Iniciar sesión'}
            </button>
          </form>
          <div className="mt-3 text-center fantasy-footer">
            <a href="/password-reset-request" className="forgot-password-link fantasy-link">¿Olvidaste tu contraseña?</a>
          </div>
          <div className="mt-3 text-center fantasy-footer">
            <p>¿No tienes cuenta? <a href="/register" className="register-link fantasy-link">Regístrate</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;