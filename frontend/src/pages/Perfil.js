import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/newProfile.css'; // Archivo CSS ajustado
import { useNavigate } from 'react-router-dom';

const ADMIN_ID = '674ceb9febf82a8ddeecbbea';

const Perfil = () => {
  const [user, setUser] = useState({
    id: '',
    profilePhoto: '',
    username: '',
    description: '',
    socialLinks: [],
    roles: [],
  });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', { withCredentials: true });
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
        alert('Error al cargar el perfil.');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSocialLinkChange = (index, value) => {
    const updatedLinks = [...user.socialLinks];
    updatedLinks[index] = value;
    setUser((prevUser) => ({
      ...prevUser,
      socialLinks: updatedLinks,
    }));
  };

  const addSocialLink = () => {
    setUser((prevUser) => ({
      ...prevUser,
      socialLinks: [...prevUser.socialLinks, ''],
    }));
  };

  const removeSocialLink = (index) => {
    const updatedLinks = user.socialLinks.filter((_, i) => i !== index);
    setUser((prevUser) => ({
      ...prevUser,
      socialLinks: updatedLinks,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedPhoto(e.target.files[0]);
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    if (selectedPhoto) formData.append('profilePhoto', selectedPhoto);
    formData.append('description', user.description);
    formData.append('socialLinks', JSON.stringify(user.socialLinks));

    try {
      const response = await axios.put('http://localhost:5000/api/users/profile', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.user) {
        setUser(response.data.user);
        alert('Perfil actualizado con éxito.');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Error al actualizar el perfil.');
    }
  };

  if (loading) return <div className="loading-text">Cargando...</div>;

  return (
    <div className="profile-container-new">
      <div className="profile-card-new">
        <div className="profile-header-new">
          <img
            src={
              selectedPhoto
                ? URL.createObjectURL(selectedPhoto)
                : user.profilePhoto || 'https://via.placeholder.com/150'
            }
            alt="Foto de perfil"
            className="profile-photo-new"
          />
          <div className="profile-info-new">
            <h1>{user.username}</h1>
            <h2>{user.roles && user.roles.length > 0 ? user.roles[0] : 'Lector'}</h2>
            <p>{user.description || 'No hay descripción disponible.'}</p>
          </div>
        </div>
        {isEditing && (
          <div className="profile-edit-new">
            <label htmlFor="profilePhoto">Cambiar foto de perfil:</label>
            <input
              type="file"
              id="profilePhoto"
              accept="image/*"
              onChange={handleFileChange}
            />
            <textarea
              name="description"
              placeholder="Actualiza tu descripción..."
              value={user.description}
              onChange={handleInputChange}
            />
            <div className="social-links-edit">
              <label>Redes Sociales:</label>
              {user.socialLinks.map((link, index) => (
                <div key={index} className="social-link-edit">
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                    placeholder="URL de la red social"
                  />
                  <button onClick={() => removeSocialLink(index)}>Eliminar</button>
                </div>
              ))}
              <button onClick={addSocialLink}>Agregar Red Social</button>
            </div>
          </div>
        )}
        {user.socialLinks.length > 0 && (
          <div className="social-links-new">
            {user.socialLinks.map((link, index) => (
              <a key={index} href={link} target="_blank" rel="noopener noreferrer">
                🌐
              </a>
            ))}
          </div>
        )}

        {/* Botón del Panel Admin */}
        {user.id === ADMIN_ID && (
          <button className="btn admin-btn" onClick={() => navigate('/admin-panel')}>
            Ir al Panel Admin
          </button>
        )}
        <div className="buttons-new">
          <button onClick={() => navigate('/my-stories')}>Mis Traducciones</button>
          <button onClick={handleEditToggle}>
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>
          {isEditing && (
            <button onClick={handleSaveChanges}>Guardar Cambios</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;