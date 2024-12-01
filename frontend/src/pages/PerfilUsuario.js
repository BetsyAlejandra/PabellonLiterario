import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PerfilUsuario = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar el perfil público:', error);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>{user.username}</h1>
      <p>Rol: {user.role}</p>
      <p>Descripción: {user.description}</p>
    </div>
  );
};

export default PerfilUsuario;