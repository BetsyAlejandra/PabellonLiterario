import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/adminPanel.css'; // Archivo CSS para personalización

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Número de usuarios por página

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users/all', { withCredentials: true });
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const lowercasedTerm = term.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(lowercasedTerm) ||
        user.email?.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reinicia a la primera página después de buscar
  };

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
        `/api/users/assign-roles/${selectedUser}`,
        { roles: selectedRoles },
        { withCredentials: true }
      );
      alert('Roles asignados correctamente');
    } catch (error) {
      console.error('Error al asignar roles:', error);
      alert('Error al asignar roles');
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="admin-panel-container">
      <div className="admin-panel-card">
        <h1>Panel de Administrador</h1>
        <div className="form-group">
          <label htmlFor="searchBar">Buscar usuario:</label>
          <input
            type="text"
            id="searchBar"
            placeholder="Busca por nombre o email"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="user-list">
          <h2>Lista de Usuarios</h2>
          <ul>
            {currentUsers.map((user) => (
              <li
                key={user._id}
                className={`user-item ${selectedUser === user._id ? 'selected' : ''}`}
                onClick={() => setSelectedUser(user._id)}
              >
                <strong>{user.username}</strong> ({user.roles.join(', ')})
              </li>
            ))}
          </ul>
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

      {/* Paginación */}
      <div className="pagination">
        {[...Array(Math.ceil(filteredUsers.length / usersPerPage)).keys()].map((number) => (
          <button
            key={number + 1}
            className={`page-btn ${currentPage === number + 1 ? 'active' : ''}`}
            onClick={() => paginate(number + 1)}
          >
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;