import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/adminPanel.css'; // Archivo CSS para personalización

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://pabellonliterario.com/api/users/all', { withCredentials: true });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = (role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role)); // Remueve el rol si ya está seleccionado
    } else {
      setSelectedRoles([...selectedRoles, role]); // Agrega el rol
    }
  };

  const assignRoles = async () => {
    if (!selectedUser || selectedRoles.length === 0) {
      alert('Por favor, selecciona un usuario y al menos un rol.');
      return;
    }

    try {
      await axios.put(
        `https://pabellonliterario.com/api/users/assign-roles/${selectedUser}`,
        { roles: selectedRoles },
        { withCredentials: true }
      );
      alert('Roles asignados correctamente');
    } catch (error) {
      console.error('Error al asignar roles:', error);
      alert('Error al asignar roles');
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="admin-panel-container">
      <div className="admin-panel-card">
        <h1>Panel de Administrador</h1>
        <div className="form-group">
          <label htmlFor="userSelect">Selecciona un usuario:</label>
          <select
            id="userSelect"
            onChange={(e) => setSelectedUser(e.target.value)}
            value={selectedUser}
          >
            <option value="" disabled>
              Selecciona un usuario
            </option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username} ({user.roles.join(', ')})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Selecciona los roles:</label>
          <div className="roles-checkbox-group">
            <label>
              <input
                type="checkbox"
                value="Traductor"
                checked={selectedRoles.includes('Traductor')}
                onChange={() => handleRoleChange('Traductor')}
              />
              Traductor
            </label>
            <label>
              <input
                type="checkbox"
                value="Escritor"
                checked={selectedRoles.includes('Escritor')}
                onChange={() => handleRoleChange('Escritor')}
              />
              Escritor
            </label>
            <label>
              <input
                type="checkbox"
                value="Editor"
                checked={selectedRoles.includes('Editor')}
                onChange={() => handleRoleChange('Editor')}
              />
              Editor
            </label>
            <label>
              <input
                type="checkbox"
                value="Lector"
                checked={selectedRoles.includes('Lector')}
                onChange={() => handleRoleChange('Lector')}
              />
              Lector
            </label>
          </div>
        </div>
        <button className="assign-role-btn" onClick={assignRoles}>
          Asignar Roles
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;