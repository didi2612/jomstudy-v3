import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import MyUploads from './pages/MyUpload';

function AppWrapper() {
  const location = useLocation();
  const hideSidebarPaths = ['/profile', '/azp','/upload','/myupload']; // Add more paths here if needed
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fefce8] via-[#f0f4ff] to-[#ecfdf5] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-white font-inter">
      {shouldShowSidebar && <Sidebar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/explore" element={<Search />} />
        <Route path="/azp" element={<Login />} />
        
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
         <Route
          path="/myupload"
          element={
            <ProtectedRoute>
              <MyUploads />
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
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
