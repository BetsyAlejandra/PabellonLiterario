import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

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
import NovelForm from './pages/NovelForm';
import PasswordResetRequest from './pages/PasswordResetRequest';
import Perfil from './pages/Perfil';
import PerfilUsuario from './pages/PerfilUsuario';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import StoryDetail from './pages/StoryDetail';
import UpdateNovel from './pages/UpdateNovel';
import EditChapter from './pages/EditChapter';
import SearchResults from './pages/SearchResults';
import ReadChapter from './pages/ReadChapter';
import NovelsPage from './pages/NovelsPage';
import TranslatorsPage from './pages/TraductoresPage';
import Postulacion from './pages/Postulacion';
import BuscarPorFiltros from './pages/BuscarPorFiltros';
import EditorsPage from './pages/EditorsPages';

function App() {
  const location = useLocation(); // Hook para obtener la ubicación actual

  // Condición para ocultar Header y Footer
  const hideHeaderFooter = location.pathname.startsWith('/read-chapter/');

  return (
    <div className="App">
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password-reset-request" element={<PasswordResetRequest />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/library" element={<Library />} />
        <Route path="/Novelas" element={<NovelsPage />} />
        <Route path="/traductores" element={<TranslatorsPage />} />
        <Route path="/editores" element={<EditorsPage />} />
        <Route path="/postular" element={<Postulacion />} />
        <Route path="/generos" element={<BuscarPorFiltros />} />
        <Route path="/story-detail/:id" element={<StoryDetail />} />
        <Route path="/read-chapter/:storyId/:chapterId" element={<ReadChapter />} />
        <Route path="/add-chapter/:id" element={<AddChapter />} />

        {/* Rutas protegidas */}
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/my-stories" element={<MyStories />} />
        <Route path="/update/:id" element={<UpdateNovel />} />
        <Route path="/edit-chapter/:storyId/:chapterId" element={<EditChapter />} />
        <Route path="/upload" element={<NovelForm />} />
        <Route path="/profile" element={<Perfil />} />
        <Route path="/profileperson/:username" element={<PerfilUsuario />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
      {!hideHeaderFooter && <FloatingButton />}
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;