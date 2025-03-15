import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { ReadChapterProvider } from "./context/ReadChapterContext";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from './context/UserContext';
import "./styles/styles.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <ThemeProvider>
        <ReadChapterProvider>
          <App />
        </ReadChapterProvider>
      </ThemeProvider>
    </UserProvider>
  </React.StrictMode>
);

import('./serviceWorkerRegistration')
  .then(({ register }) => register())
  .catch((err) => console.error('❌ Error al registrar el SW:', err));
