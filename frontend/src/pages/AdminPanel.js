import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/all', { withCredentials: true });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    };
    fetchUsers();
  }, []);

  const assignRole = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/users/assign-role',
        { userId: selectedUser, role },
        { withCredentials: true }
      );
      alert('Rol asignado correctamente');
    } catch (error) {
      console.error('Error al asignar rol:', error);
      alert('Error al asignar rol');
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Panel de Administrador</h1>
      <select onChange={(e) => setSelectedUser(e.target.value)} defaultValue="">
        <option value="" disabled>Selecciona un usuario</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.username} ({user.role})
          </option>
        ))}
      </select>
      <select onChange={(e) => setRole(e.target.value)} defaultValue="">
        <option value="" disabled>Selecciona un rol</option>
        <option value="Lector">Lector</option>
        <option value="Traductor">Traductor</option>
        <option value="Escritor">Escritor</option>
        <option value="Editor">Editor</option>
      </select>
      <button onClick={assignRole}>Asignar rol</button>
    </div>
  );
};

export default AdminPanel;