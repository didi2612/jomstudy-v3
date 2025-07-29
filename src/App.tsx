import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import Search from './pages/Search';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#fefce8] via-[#f0f4ff] to-[#ecfdf5] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-white font-inter">
        {/* Global Navbar */}
       

        {/* Main content */}
        
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/explore" element={<Search />} />
          </Routes>
        
      </div>
    </Router>
  );
}

export default App;
