import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ setLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("loggedIn"); // optional: clear if persisted
    navigate("/auth");
  };

  return (
    <nav className="bg-[#3B45E0] text-white px-6 py-3 shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide flex items-center gap-2">
          <img src="app-image.png" alt="logo" className="w-6 h-6" />
          <Link to="/" className="hover:underline">FinSight</Link>
        </h1>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:underline">Dashboard</Link>
          <Link to="/savings" className="hover:underline">Savings</Link>
          <Link to="/invest" className="hover:underline">Investment Plan</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <button onClick={handleLogout} title="Logout" className="ml-1 hover:opacity-75">
            <img
              src="logout-img.png"
              alt="Logout"
              className="w-5 h-5"
            />
          </button>

        </div>
      </div>
    </nav>
  );
}
