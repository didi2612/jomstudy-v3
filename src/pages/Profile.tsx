import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SUPABASE_URL = "https://pftyzswxwkheomnqzytu.supabase.co";
const SUPABASE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmdHl6c3d4d2toZW9tbnF6eXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NjczNzksImV4cCI6MjA2OTM0MzM3OX0.TI9DGipYP9X8dSZSUh5CVQIbeYnf9vhNXAqw5e5ZVkk";

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

type UserProfile = {
  id: string;
  username: string;
  avatar_url: string;
};

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [noteCount, setNoteCount] = useState<number>(0);

  const fetchProfileAndNotes = async () => {
    const username = getCookie("username");
    if (!username) return;

    // Get user details
    const userRes = await fetch(
      `${SUPABASE_URL}/rest/v1/users?select=*&username=eq.${username}`,
      {
        headers: {
          apikey: SUPABASE_API_KEY,
          Authorization: `Bearer ${SUPABASE_API_KEY}`,
        },
      }
    );
    const userData = await userRes.json();
    if (!userData?.length) return;
    const userProfile = userData[0];
    setUser(userProfile);

    // Get note count
    const notesRes = await fetch(
      `${SUPABASE_URL}/rest/v1/notes?select=id&uploaded_by=eq.${username}`,
      {
        headers: {
          apikey: SUPABASE_API_KEY,
          Authorization: `Bearer ${SUPABASE_API_KEY}`,
        },
      }
    );
    const notes = await notesRes.json();
    setNoteCount(notes.length);
  };

  useEffect(() => {
    fetchProfileAndNotes();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black font-inter">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white px-6 py-20 font-inter relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        {/* Avatar and Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <img
            src={
              user.avatar_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}`
            }
            alt="User Avatar"
            className="w-28 h-28 rounded-full border-4 border-yellow-400 shadow-md object-cover"
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-yellow-300">
            Welcome, {user.username} 🌟
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Your personalized study space
          </p>
        </div>

        {/* Profile Info */}
        <div className="bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400">Username</p>
              <p className="text-lg font-semibold text-white">{user.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Notes Uploaded</p>
              <p className="text-lg font-semibold text-yellow-400">{noteCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">User ID</p>
              <p className="text-lg font-semibold text-white truncate">{user.id}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200"
          >
            Home
          </Link>
          <Link
            to="/upload"
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200"
          >
            Upload Notes
          </Link>
           
          <button
            onClick={() => {
              document.cookie =
                "username=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
              window.location.href = "/";
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
