import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';  // Importar BrowserRouter
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>   {/* Aquí envuelves tu componente App en BrowserRouter */}
      <App />
    </Router>
  </StrictMode>,
);
