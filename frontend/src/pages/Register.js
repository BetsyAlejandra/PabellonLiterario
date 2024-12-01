import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        'http://localhost:5000/api/auth/register',
        { username, email, password },
        { withCredentials: true }
      );
      navigate('/profile');
    } catch (error) {
      setError('Error al registrar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card login-card">
        <div className="card-body">
          <h2 className="card-title text-center">Registrar</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Nombre de usuario</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
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
              {loading ? 'Cargando...' : 'Registrar'}
            </button>
          </form>
          <div className="mt-3 text-center">
            <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;