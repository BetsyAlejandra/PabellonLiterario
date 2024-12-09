import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/newProfile.css'; // Archivo CSS ajustado
import { useNavigate } from 'react-router-dom';
import decorativeImage from '../assets/decoracion.png'; // Imagen encima de la foto de perfil

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
        const response = await axios.get('/api/users/profile', { withCredentials: true });
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
      const response = await axios.put('/api/users/profile', formData, {
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
    <div className="profile-container-fantasy">
      <div className="profile-card-fantasy">
        <div className="profile-header-fantasy">
          {/* Imagen decorativa encima */}
          <div className="decorative-wrapper">
            <img src={decorativeImage} alt="Decoración" className="decorative-image" />
          </div>
          <img
            src={
              selectedPhoto
                ? URL.createObjectURL(selectedPhoto)
                : user.profilePhoto || 'https://via.placeholder.com/150'
            }
            alt="Foto de perfil"
            className="profile-photo-fantasy"
          />
          <div className="profile-info-fantasy">
            <h1>{user.username}</h1>
            <h2>{user.roles && user.roles.length > 0 ? user.roles[0] : 'Lector'}</h2>
            <p>{user.description || 'No hay descripción disponible.'}</p>
          </div>
        </div>
        {isEditing && (
          <div className="profile-edit-fantasy">
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
              <a onClick={addSocialLink}>Agregar Red Social</a>
            </div>
          </div>
        )}
        {/* Redes Sociales */}
        {user.socialLinks.length > 0 && (
          <div className="social-links-new">
            {user.socialLinks.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link-icon"
              >
                🌐 {/* Puedes reemplazar esto con íconos personalizados */}
              </a>
            ))}
          </div>
        )}
        <div className="buttons-fantasy">
          <button onClick={() => navigate('/my-stories')} className="fantasy-btn">
            Mis Traducciones
          </button>
          <button onClick={handleEditToggle} className="fantasy-btn">
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>

          {/* Botón del Panel Admin */}
          {user.id === ADMIN_ID && (
            <div className="admin-panel-container">
              <button className="admin-panel-button" onClick={() => navigate('/admin-panel')}>
                ⚜ Ir al Panel de Administración ⚜
              </button>
            </div>
          )}
          
          {isEditing && (
            <button onClick={handleSaveChanges} className="fantasy-btn-save">
              Guardar Cambios
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;