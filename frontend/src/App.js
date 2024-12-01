import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Componentes
import FloatingButton from './Components/FloatingButton';
import Footer from './Components/Footer';
import Header from './Components/Header';

// Páginas
import AddChapter from './pages/AddChapter';
import AdminPanel from './pages/AdminPanel';
import Home from './pages/Home';
import Library from './pages/Library';
import Login from './pages/Login';
import MyStories from './pages/MyStories';
import Novela from './pages/Novela';
import NovelForm from './pages/NovelForm';
import PaginaLectura from './pages/PaginaLectura';
import PasswordResetRequest from './pages/PasswordResetRequest';
import Perfil from './pages/Perfil';
import PerfilUsuario from './pages/PerfilUsuario';
import ProtectedRoute from './pages/ProtectedRoute';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import StoryDetail from './pages/StoryDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        {/* Definimos las rutas aquí */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password-reset-request" element={<PasswordResetRequest />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/library" element={<Library />} />
          <Route path="/story-detail/:id" element={<StoryDetail />} />
          <Route path="/read/:id" element={<PaginaLectura />} />
          <Route path="/user-profile/:id" element={<PerfilUsuario />} />
          <Route path="/add-chapter/:id" element={<AddChapter />} />

          {/* Rutas protegidas */}
          <Route path="/my-stories" element={<ProtectedRoute><MyStories /></ProtectedRoute>} />
          <Route path="/upload" element={<NovelForm />} />
          <Route path="/profile" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/admin-panel" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        </Routes>

        <FloatingButton />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
