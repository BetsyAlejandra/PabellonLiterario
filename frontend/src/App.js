import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// Componentes
import FloatingButton from './Components/FloatingButton';
import Footer from './Components/Footer';
import Header from './Components/Header';
import TerminosServicios from './Components/Terminos';
import PoliticaPrivacidad from './Components/Politica';
import Disclaimer from './Components/Disclaimer';
import Contactanos from './Components/Contactanos';
import Unete from './Components/Unete';
import Preguntas from './Components/Preguntas';
import AvisoCookies from './Components/Cookies';
import SobreNosotros from './Components/SobreNosotros';
import DarkModeToggle from './Components/DarkModeToggle';
import DonationPopup from './Components/DonationPopup';

//Contexto
import { ReadChapterProvider } from './context/ReadChapterContext';

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
import ManageChapters from './pages/ManageChapters';
import CreateAudioDrama from './pages/CreateAudioDrama';
import AudioDramaDetails from './pages/AudioDramaDetails';
import AudioDramaList from './pages/AudioDramaList';
import SelectAudioDrama from './pages/SelectAudioDrama';
import ChapterDetail from './pages/ChapterDetail';
import Error404 from './pages/Error404';
import Error500 from './pages/Error500';

function App() {
  const location = useLocation(); // Hook para obtener la ubicación actual

  // Condición para ocultar Header y Footer
  const hideHeaderFooter = location.pathname.startsWith('/read-chapter/');
  const showDonationPopup = location.pathname === "/" || location.pathname.startsWith("/story-detail/");

  return (
    <div className="App">
      {!hideHeaderFooter && <Header />}

      {showDonationPopup && <DonationPopup />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password-reset-request" element={<PasswordResetRequest />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/Novelas" element={<NovelsPage />} />
        <Route path="/traductores" element={<TranslatorsPage />} />
        <Route path="/editores" element={<EditorsPage />} />
        <Route path="/postular" element={<Postulacion />} />
        <Route path="/generos" element={<BuscarPorFiltros />} />
        <Route path="/story-detail/:id" element={<StoryDetail />} />
        <Route path="/library" element={<Library />} />
        <Route path="/read-chapter/:storyId/:chapterId" element={<ReadChapter />} />
        <Route path="/add-chapter/:id" element={<AddChapter />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/my-stories" element={<MyStories />} />
        <Route path="/update/:id" element={<UpdateNovel />} />
        <Route path="/edit-chapter/:storyId/:chapterId" element={<EditChapter />} />
        <Route path="/upload" element={<NovelForm />} />
        <Route path="/preguntas" element={<Preguntas />} />
        <Route path="/unete" element={<Unete />} />
        <Route path="/contactanos" element={<Contactanos />} />
        <Route path="/politica" element={<PoliticaPrivacidad />} />
        <Route path="/terminos" element={<TerminosServicios />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/sobrenosotros" element={<SobreNosotros />} />
        <Route path="/profile" element={<Perfil />} />
        <Route path="/profileperson/:username" element={<PerfilUsuario />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/audiodramacreacion" element={<CreateAudioDrama />} />
        <Route path="/audiodramas" element={<AudioDramaList />} />
        <Route path="/gestionaudiodrama" element={<SelectAudioDrama />} />
        <Route path="/audiodrama/:id" element={<AudioDramaDetails />} />
        <Route path="/manage-chapters/:id" element={<ManageChapters />} />
        <Route path="/audio-dramas/:id/seasons/:seasonNumber/episodes/:episode" element={<ChapterDetail />} />
        <Route path="*" element={<Error404 />} />

        <Route path="/error500" element={<Error500 />} />
      </Routes>
      <DarkModeToggle />
      {!hideHeaderFooter && <FloatingButton />}
      {!hideHeaderFooter && <Footer />}
      <AvisoCookies />
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