import React, { useState } from 'react';
import axios from 'axios';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post(
        '/api/auth/password-reset-request',
        { email },
        { withCredentials: true }
      );
      setMessage('Se ha enviado un enlace para restablecer la contraseña a tu correo.');
    } catch (error) {
      setMessage('Error al solicitar el restablecimiento de la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card login-card">
        <div className="card-body">
          <h2 className="card-title text-center">Recuperar Contraseña</h2>
          {message && <div className="alert alert-info">{message}</div>}
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
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Cargando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetRequest;