import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { ReadChapterProvider } from "./context/ReadChapterContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/styles.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ReadChapterProvider>
        <App />
      </ReadChapterProvider>
    </ThemeProvider>
  </React.StrictMode>
);

setTimeout(() => {
  import('./serviceWorkerRegistration')
    .then(({ register }) => {
      if (typeof register === 'function') {
        register();
      } else {
        console.error('⚠️ No se encontró la función register en serviceWorkerRegistration.');
      }
    })
    .catch((err) => console.error('❌ Error al cargar el Service Worker:', err));
}, 3000);