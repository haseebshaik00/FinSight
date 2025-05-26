import { useState } from 'react';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    monthlyIncome: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Successfully signed up!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <div className="w-[22rem] bg-[#1E2330] text-white p-6 rounded-xl shadow-2xl">
        <h2 className="text-xl font-semibold text-center mb-4">Sign Up</h2>
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-2">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm block mb-1">Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-800 text-white border border-gray-600 rounded px-3 py-2 placeholder-gray-400"
              required
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-800 text-white border border-gray-600 rounded px-3 py-2 placeholder-gray-400"
              required
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-slate-800 text-white border border-gray-600 rounded px-3 py-2 placeholder-gray-400"
              required
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Monthly Income</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
              <input
                name="monthlyIncome"
                type="number"
                placeholder="5000"
                value={formData.monthlyIncome}
                onChange={handleChange}
                className="w-full bg-slate-800 text-white border border-gray-600 rounded px-3 py-2 pl-8 placeholder-gray-400"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
