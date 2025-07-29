import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Make sure this path matches your folder structure

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#fefce8] via-[#f0f4ff] to-[#ecfdf5] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-white font-inter">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/explore" element={<Search />} />
          <Route path="/azp" element={<Login />} />

          {/* Protected Routes */}
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
