import React from 'react';
<<<<<<< HEAD
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Ajoutez cette ligne

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
=======
import { createRoot } from 'react-dom/client'; // Importer createRoot depuis react-dom/client
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
>>>>>>> 73b8c8a83c26d85f13ed0eef62967cc1813ca932
