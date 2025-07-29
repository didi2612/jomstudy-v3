import { Link } from "react-router-dom";

export default function Profile() {
  const user = {
    name: "Sarah Lim",
    email: "sarah.lim@example.com",
    notesUploaded: 12,
    joinDate: "Jan 2024",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white font-inter px-6 py-20">
      {/* Top Glow */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold leading-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 animate-text">
            Welcome, {user.name.split(" ")[0]} 🌟
          </h1>
          <p className="text-gray-400">{user.email}</p>
        </div>

        {/* Info Card */}
        <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl p-8 space-y-4 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <div>
              <p className="text-sm text-gray-400">Full Name</p>
              <p className="text-lg font-semibold text-white">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-lg font-semibold text-white">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Notes Uploaded</p>
              <p className="text-lg font-semibold text-yellow-400">{user.notesUploaded}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Member Since</p>
              <p className="text-lg font-semibold text-white">{user.joinDate}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Link
            to="/upload"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl shadow-lg transition"
          >
            Upload Notes
          </Link>
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
