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
          <Route path='/Novelas' element={<NovelsPage />} />
          <Route path="/story-detail/:id" element={<StoryDetail />} />
          <Route path="/read-chapter/:storyId/:chapterId" element={<ReadChapter />} />
          <Route path="/user-profile/:id" element={<PerfilUsuario />} />
          <Route path="/add-chapter/:id" element={<AddChapter />} />

          {/* Rutas protegidas */}
          <Route path='/search-results' element={<SearchResults />} />
          <Route path="/my-stories" element={<MyStories />} />
          <Route path="/update/:id" element={<UpdateNovel />} />
          <Route path="/edit-chapter/:storyId/:chapterId" element={<EditChapter />} />
          <Route path="/upload" element={<NovelForm />} />
          <Route path="/profile" element={<Perfil />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Routes>

        <FloatingButton />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
