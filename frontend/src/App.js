import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header.js';
import Footer from './Components/Footer.js';
import Home from './pages/Home.js';
import NovelForm from './pages/NovelForm.js';
import MyStories from './pages/MyStories.js';
import Library from './pages/Library.js';
import FloatingButton from './Components/FloatingButton.js';
import StoryDetail from './pages/StoryDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        {/* Definimos las rutas aquí */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<NovelForm />} />
          <Route path="/my-stories" element={<MyStories />} />
          <Route path='/libreria' element={<Library />} />
          <Route path="/detalle/:id" element={<StoryDetail />} />
        </Routes>
        <FloatingButton />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
