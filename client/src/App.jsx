import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Savings from './pages/Savings';
import Assets from './pages/Assets';
import Invest from './pages/Invest';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Auth from './pages/Auth';
import Footer from './components/Footer';

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="min-h-screen font-sans">
      {/* Hide navbar only on the auth page */}
      {!isAuthPage && <Navbar />}

      <Routes>
        {/* Fullscreen Auth route */}
        <Route path="/auth" element={<Auth />} />

        {/* Other routes with standard padding/layout */}
        <Route
          path="/"
          element={
            <div className="p-6 max-w-6xl mx-auto">
              <Home />
            </div>
          }
        />
        <Route
          path="/savings"
          element={
            <div className="p-6 max-w-6xl mx-auto">
              <Savings />
            </div>
          }
        />
        <Route
          path="/assets"
          element={
            <div className="p-6 max-w-6xl mx-auto">
              <Assets />
            </div>
          }
        />
        <Route
          path="/invest"
          element={
            <div className="p-6 max-w-6xl mx-auto">
              <Invest />
            </div>
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
        <Route
          path="/signin"
          element={
            <div className="p-6 max-w-6xl mx-auto">
              <SignIn />
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div className="p-6 max-w-6xl mx-auto">
              <SignUp />
            </div>
          }
        />
      </Routes>
      {!isAuthPage && <Footer />}
    </div>
    
  );
}
