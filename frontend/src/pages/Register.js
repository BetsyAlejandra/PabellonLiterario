import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css'; // Asegúrate de crear este archivo

const Register = () => {
  const [username, setUsername] = useState('');
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
        '/api/users/register',
        { username, email, password },
        { withCredentials: true }
      );
      navigate('/profile');
      window.location.reload();
    } catch (error) {
      setError('Error al registrar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center">
      <div className="card register-card shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-center fantasy-title">Registrar</h2>
          {error && <div className="alert alert-danger fantasy-alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="fantasy-label">Nombre de usuario</label>
              <input
                type="text"
                className="form-control fantasy-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
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
              {loading ? 'Cargando...' : 'Registrar'}
            </button>
          </form>
          <div className="mt-3 text-center fantasy-footer">
            <p>¿Ya tienes cuenta? <a href="/login" className="fantasy-link">Inicia sesión</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;