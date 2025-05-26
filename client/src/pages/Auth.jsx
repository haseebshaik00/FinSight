import { useState } from "react";

export default function Auth({ setLoggedIn }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    income: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
  //   const res = await fetch(`http://localhost:5051${endpoint}`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(formData),
  //   });
  //   const data = await res.json();
  //   if (!res.ok) return alert("Failed, Try again!");
  //   setLoggedIn(true); // <- User is now logged in
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
    try {
      const res = await fetch(`http://localhost:5051${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed, try again!");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setLoggedIn(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again!");
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-white">
      <div className="flex-grow w-full flex flex-col md:flex-row items-center justify-center">
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-16 py-10">
          <div className="w-full max-w-lg">
            <h1 className="text-4xl font-bold mb-3">
              {isSignUp ? "Create your Account" : "Welcome Back"}
            </h1>
            <p className="text-sm text-gray-400 mb-6">
              {isSignUp ? (
                <>
                  Start your journey with us. Already have an account?{" "}
                  <button
                    className="text-blue-400 hover:underline"
                    onClick={() => setIsSignUp(false)}
                  >
                    Sign In here
                  </button>
                </>
              ) : (
                <>
                  Ready to join?{" "}
                  <button
                    className="text-blue-400 hover:underline"
                    onClick={() => setIsSignUp(true)}
                  >
                    Create an account
                  </button>
                </>
              )}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="text-sm block mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Bonnie Green"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#1e293b] border border-gray-700 text-white px-4 py-2 rounded-lg"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm block mb-1">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#1e293b] border border-gray-700 text-white px-4 py-2 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm block mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#1e293b] border border-gray-700 text-white px-4 py-2 rounded-lg"
                    required
                  />
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="text-sm block mb-1">Monthly Income</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      name="income"
                      placeholder="5000"
                      value={formData.income}
                      onChange={handleChange}
                      className="w-full bg-[#1e293b] border border-gray-700 text-white px-4 py-2 pl-8 rounded-lg"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 rounded-lg mt-4"
              >
                {isSignUp ? "Create an account" : "Sign In"}
              </button>
            </form>
          </div>
        </div>

        <div className="hidden md:flex w-1/2 flex-col justify-between px-10 py-16">
          <div>
            <div className="flex items-center gap-2 mb-10">
              <img
                src="/app-image.png"
                alt="FinSight logo"
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-5xl font-bold text-blue-400">FinSight</h1>
            </div>

            <ul className="space-y-8">
              <li>
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <span className="text-blue-500">📊</span> Track Finances Effortlessly
                </h3>
                <p className="text-gray-400 text-xs ml-6">
                  Log income, expenses, and visualize spending patterns using interactive visualizations
                </p>
              </li>

              <li>
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <span className="text-blue-500">📈</span> Smart Savings Forecasting
                </h3>
                <p className="text-gray-400 text-xs ml-6">
                  Get real-time predictions on your future savings powered by Machine Learning
                </p>
              </li>

              <li>
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <span className="text-blue-500">💡</span> Personalized Investment Plans
                </h3>
                <p className="text-gray-400 text-xs ml-6">
                  Receive dynamic investment suggestions across various assets based on your risk profile
                </p>
              </li>

              <li>
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <span className="text-blue-500">🔐</span> Secure & Private by Design
                </h3>
                <p className="text-gray-400 text-xs ml-6">
                  Your financial data is encrypted and stored securely, giving you complete control and peace of mind.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <footer className="text-center text-xs text-white py-4 bg-slate-900">
        <p>
          © 2025 FinSight |{" "}
          <a href="https://github.com/haseebshaik00/FinSight" className="underline">
            GitHub
          </a>
          <br />
          Designed with <span className="text-pink-400">❤</span> by <a href="https://github.com/haseebshaik00">Haseeb</a> and <a href="https://github.com/varunsingh4">Varun</a>
        </p>
      </footer>
    </div>
  );
}
