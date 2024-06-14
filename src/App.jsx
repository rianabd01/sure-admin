// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import axios from 'axios';
import Header from './Components/Header';
import Footer from './Components/Footer';
import LoginForm from './Components/Login';
import TrashList from './Components/TrashList';
import ProofList from './Components/ProofList';

axios.defaults.baseURL = 'https://sureadminapi.riandev.xyz';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const saveToken = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  };

  const logout = (navigate) => {
    localStorage.removeItem('token');
    setToken('');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

  return (
    <Router basename="/sure-admin">
      <Header token={token} logout={logout} />

      <Routes>
        {!token ? (
          <Route path="/" element={<LoginForm saveToken={saveToken} />} />
        ) : (
          <>
            <Route path="/" element={<Navigate to="/list" />} />
            <Route path="/list" element={<TrashList />} />
            <Route path="/proof" element={<ProofList />} />
          </>
        )}
      </Routes>

      <Footer />
    </Router>
  );
}
