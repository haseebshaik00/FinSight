import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-[#3B45E0] text-white px-6 py-3 shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">FinSight</h1>
        <div className="flex gap-6 text-sm font-medium">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/savings" className="hover:underline">Savings</Link>
          <Link to="/assets" className="hover:underline">Assets</Link>
          <Link to="/invest" className="hover:underline">Invest</Link>
          <Link to="/about" className="hover:underline">About</Link>
        </div>
      </div>
    </nav>
  );
}
