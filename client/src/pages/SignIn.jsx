export default function SignIn() {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        <form className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input type="email" className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input type="password" className="w-full border px-3 py-2 rounded" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign In</button>
        </form>
      </div>
    );
  }