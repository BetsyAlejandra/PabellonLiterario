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
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users/all', { withCredentials: true });
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        setLoading(false);
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
    setCurrentPage(1);
  };

  const handleRoleChange = (role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
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
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser ? { ...user, roles: selectedRoles } : user
        )
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser ? { ...user, roles: selectedRoles } : user
        )
      );
      setSelectedRoles([]);
    } catch (error) {
      console.error('Error al asignar roles:', error);
      alert('Error al asignar roles');
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const firstPage = () => setCurrentPage(1);
  const lastPage = () => setCurrentPage(totalPages);

  if (loading) return <div className="admin-loading">Cargando...</div>;

  return (
    <div className="admin-panel-container">
      <div className="admin-panel-card shadow-sm">
        <h1 className="admin-title">Panel de Administrador</h1>
        <div className="form-group">
          <label htmlFor="searchBar" className="admin-label">Buscar usuario:</label>
          <input
            type="text"
            id="searchBar"
            placeholder="Busca por nombre o email"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="admin-search-input"
          />
        </div>
        <div className="user-list">
          <h2 className="user-list-title">Lista de Usuarios</h2>
          <ul className="admin-user-list">
            {currentUsers.map((user) => (
              <li
                key={user._id}
                className={`admin-user-item ${selectedUser === user._id ? 'selected' : ''}`}
                onClick={() => setSelectedUser(user._id)}
              >
                <strong>{user.username}</strong> ({user.roles.join(', ')})
              </li>
            ))}
          </ul>
        </div>
        <div className="form-group">
          <label className="admin-label">Selecciona los roles:</label>
          <div className="admin-roles-checkbox-group">
            {['Traductor', 'Escritor', 'Editor', 'Lector'].map((role) => (
              <label key={role} className="admin-checkbox-label">
                <input
                  type="checkbox"
                  value={role}
                  checked={selectedRoles.includes(role)}
                  onChange={() => handleRoleChange(role)}
                  className="admin-checkbox-input"
                />
                {role}
              </label>
            ))}
          </div>
        </div>
        <button className="admin-assign-role-btn" onClick={assignRoles}>
          Asignar Roles
        </button>
      </div>

      {/* Paginación con rango dinámico */}
      <div className="admin-pagination">
        <button
          className="admin-page-btn"
          onClick={firstPage}
          disabled={currentPage === 1}
        >
          «
        </button>
        <button
          className="admin-page-btn"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          ‹
        </button>
        {[...Array(totalPages).keys()]
          .slice(
            Math.max(0, currentPage - 3),
            Math.min(totalPages, currentPage + 2)
          )
          .map((number) => (
            <button
              key={number + 1}
              className={`admin-page-btn ${currentPage === number + 1 ? 'active' : ''}`}
              onClick={() => paginate(number + 1)}
            >
              {number + 1}
            </button>
          ))}
        <button
          className="admin-page-btn"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
        <button
          className="admin-page-btn"
          onClick={lastPage}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>

    </div>
  );
};

export default AdminPanel;