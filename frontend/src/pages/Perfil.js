import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Perfil = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/users/profile', { withCredentials: true });
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <img src={user.profilePhoto} alt="Foto de perfil" />
      <img src={user.coverPhoto} alt="Foto de portada" />
      <h1>{user.username}</h1>
      <p>Rol: {user.role}</p>
      <p>Descripción: {user.description}</p>
      <button onClick={() => window.location.href = '/my-stories'}>Editar perfil</button>
    </div>
  );
};

export default Perfil;