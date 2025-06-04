import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Savings from './pages/Savings';
import Invest from './pages/Invest';
import About from './pages/About';
import Auth from './pages/Auth';

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="min-h-screen font-sans">
      {!isAuthPage && <Navbar setLoggedIn={setLoggedIn} />}

      <Routes>
        <Route path="/auth" element={loggedIn ? <Navigate to="/" /> : <Auth setLoggedIn={setLoggedIn} />} />
        <Route
          path="/"
          element={
            loggedIn ? (
              <div className="p-6 max-w-6xl mx-auto">
                <Home />
              </div>
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route
          path="/savings"
          element={
            loggedIn ? (
              <div className="p-6 max-w-6xl mx-auto">
                <Savings />
              </div>
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route
          path="/invest"
          element={
            loggedIn ? (
              <div className="p-6 max-w-6xl mx-auto">
                <Invest />
              </div>
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route
          path="/about"
          element={
            <div className="p-6 max-w-6xl mx-auto">
              <About />
            </div>
          }
        />
      </Routes>
    </div>
  );
}
