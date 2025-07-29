import { useState, useEffect } from "react";
import { FaSearch, FaBookOpen, FaFilter } from "react-icons/fa";
import { motion } from "framer-motion";

const SUPABASE_URL = "https://pftyzswxwkheomnqzytu.supabase.co";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmdHl6c3d4d2toZW9tbnF6eXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NjczNzksImV4cCI6MjA2OTM0MzM3OX0.TI9DGipYP9X8dSZSUh5CVQIbeYnf9vhNXAqw5e5ZVkk"; // Replace with your actual public key

type Note = {
  id: string;
  title: string;
  subject: string;
  uploaded_by: string;
  tags: string[]; // should be an array
  filename: string;
};

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Note[]>([]);
  const [latestNotes, setLatestNotes] = useState<Note[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const fetchLatestNotes = async () => {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/notes?select=*&order=created_at.desc&limit=4`,
      {
        headers: {
          apikey: SUPABASE_API_KEY,
          Authorization: `Bearer ${SUPABASE_API_KEY}`,
        },
      }
    );
    const data = await res.json();
    const safeData = data.map((n: any) => ({
      ...n,
      tags: Array.isArray(n.tags) ? n.tags : [],
    }));
    setLatestNotes(safeData);
  };

  const handleSearch = async () => {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/notes?or=(title.ilike.*${query}*,subject.ilike.*${query}*,tags.cs.{${query}})`,
      {
        headers: {
          apikey: SUPABASE_API_KEY,
          Authorization: `Bearer ${SUPABASE_API_KEY}`,
        },
      }
    );
    const data = await res.json();
    const safeData = data.map((n: any) => ({
      ...n,
      tags: Array.isArray(n.tags) ? n.tags : [],
    }));
    setResults(safeData);
  };

 const handleOpenFile = async (filename: string) => {
  try {
    const response = await fetch(`https://azmiproductions.com/api/studyjom/upload.php?file=${filename}`);
    if (!response.ok) throw new Error("Failed to fetch file.");

    const blob = await response.blob();
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, "_blank");
  } catch (error) {
    console.error("Error opening file:", error);
    alert("Could not open the file. Please try again later.");
  }
};


  useEffect(() => {
    fetchLatestNotes();
  }, []);

  useEffect(() => {
    if (!latestNotes.length) return;
    const interval = setInterval(() => {
      setSuggestionIndex((i) => (i + 1) % latestNotes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [latestNotes]);

  const shownNotes = query ? results : latestNotes;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white px-6 py-16 font-inter">
      <div className="max-w-4xl mx-auto text-center space-y-6 mb-12">
        <div className="text-5xl animate-bounce">📚</div>
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 animate-text">
          Search Study Notes
        </h1>
        <p className="text-base text-gray-400">
          Browse shared notes from friends, seniors, and kind strangers with good handwriting ✨
        </p>
        <p className="text-sm text-pink-300 italic">
          Try:{" "}
          <span className="text-yellow-400">
            {latestNotes[suggestionIndex]?.title || "Final Tips"}
          </span>
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-3xl mx-auto flex gap-2 items-center mb-12">
        <input
          type="text"
          placeholder="e.g. UG3 Calculus, Fuzzy Logic, Past Year..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-5 py-4 rounded-xl bg-gray-800/60 backdrop-blur-sm text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md transition"
        />
        <button
          onClick={handleSearch}
          className="bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-4 rounded-xl font-bold shadow-md transition duration-200"
        >
          <FaSearch />
        </button>
      </div>

      <div className="max-w-5xl mx-auto space-y-10">
        {query && results.length > 0 && (
          <div className="text-sm text-gray-400 flex items-center gap-2 mb-4">
            <FaFilter className="text-yellow-300" />
            Showing {results.length} results for{" "}
            <span className="text-pink-300 font-semibold">"{query}"</span>
          </div>
        )}

        {/* Notes */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shownNotes.map((note, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              onClick={() => handleOpenFile(note.filename)}
              className="rounded-2xl bg-gray-800/60 backdrop-blur-md border border-gray-700 p-5 shadow-md hover:shadow-pink-400/30 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <FaBookOpen className="text-pink-300 text-2xl mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{note.title}</h3>
                  <p className="text-sm text-gray-400">
                    <span className="text-yellow-400">{note.subject}</span> • Shared by{" "}
                    {note.uploaded_by}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Array.isArray(note.tags) &&
                      note.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-pink-500/10 text-pink-300 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {query && results.length === 0 && (
          <div className="text-center text-gray-500 mt-20 text-lg">
            😔 No notes found. Try different keywords or contribute yours!
          </div>
        )}
      </div>
    </div>
  );
}
