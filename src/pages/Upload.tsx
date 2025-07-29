import { useState } from "react";
import { FaBook, FaCloudUploadAlt } from "react-icons/fa";

const SUPABASE_URL = "https://pftyzswxwkheomnqzytu.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmdHl6c3d4d2toZW9tbnF6eXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NjczNzksImV4cCI6MjA2OTM0MzM3OX0.TI9DGipYP9X8dSZSUh5CVQIbeYnf9vhNXAqw5e5ZVkk";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !title || !subject) {
      alert("All fields required!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    // Upload file to PHP server
    const phpUploadRes = await fetch(
      "https://azmiproductions.com/api/studyjom/upload.php",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!phpUploadRes.ok) {
      alert("File upload failed.");
      setLoading(false);
      return;
    }

    const uploadData = await phpUploadRes.json();
    if (!uploadData.success) {
      alert("Server error: " + uploadData.error);
      setLoading(false);
      return;
    }

    
// or any format you want
 const uploadedFilename = `https://azmiproductions.com/api/studyjom/uploads/${uploadData.filename}`;


    // Insert metadata into Supabase
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/notes`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        title,
        subject,
        filename: uploadedFilename,
        uploaded_by: "azmi", // You can change this if needed
      }),
    });

    if (!insertRes.ok) {
      const error = await insertRes.text();
      alert("Failed to save metadata.\n" + error);
      setLoading(false);
      return;
    }

    alert("Uploaded successfully!");
    setTitle("");
    setSubject("");
    setFile(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f2937] via-[#0f172a] to-[#1e3a8a] text-white px-4 py-20 flex justify-center items-start font-sans">
      <div className="w-full max-w-2xl bg-[#0f172a]/60 border border-gray-700 rounded-3xl shadow-2xl p-8 space-y-8 backdrop-blur-sm">
        <div className="text-center space-y-2">
          <div className="text-5xl">📚</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-300">
            Upload Your Study Notes
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Share your handwritten or digital notes with the community and help
            others thrive 🎓
          </p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm text-gray-300 mb-1 flex items-center gap-2">
            <FaBook className="text-indigo-400" /> Title
          </label>
          <input
            type="text"
            placeholder="e.g., Linear Algebra Summary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#1e293b] text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <label className="block text-sm text-gray-300 mb-1 flex items-center gap-2">
            <FaBook className="text-indigo-400" /> Subject
          </label>
          <input
            type="text"
            placeholder="e.g., Mathematics"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#1e293b] text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <label className="block text-sm text-gray-300 mb-1 flex items-center gap-2">
            <FaCloudUploadAlt className="text-indigo-400" /> Upload File
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-3 rounded-xl bg-[#1e293b] text-white file:bg-indigo-600 file:text-white file:px-4 file:py-2 file:rounded-md file:border-none cursor-pointer"
          />
        </div>

        <button
          onClick={handleUpload}
          className={`w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-xl font-semibold transition duration-200 shadow-md ${
            loading && "opacity-50 pointer-events-none"
          }`}
        >
          {loading ? "Uploading..." : "🚀 Upload Now"}
        </button>

        <p className="text-center text-gray-500 text-xs mt-4">
          Thanks for sharing your knowledge 🌙
        </p>
      </div>
    </div>
  );
}
