<<<<<<< HEAD
// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import UserManagement from './components/UserManagement';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<UserManagement />} />
      </Routes>
    </Router>
  );
};

export default App;
=======
import React from 'react';
  import './index.css'; // Importer index.css au lieu de App.css

  function App() {
    return (
      <div className="bg-blue-500 text-white p-4">
        <h1 className="text-3xl font-bold">Digital Signage SaaS</h1>
        <p>Welcome to your Digital Signage application!</p>
      </div>
    );
  }

  export default App;
>>>>>>> 73b8c8a83c26d85f13ed0eef62967cc1813ca932
