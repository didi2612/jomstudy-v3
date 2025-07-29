import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/about", label: "About" },
  ];

  return (
    <header className="bg-white  shadow-md absolute top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Left - TROSENSE Logo */}
        <div className="flex items-center gap-3">
          <img
            src="https://rosepng.com/wp-content/uploads/elementor/thumbs/sharia_books_and_stationary_isolated_on_white_background_b3b4327c-a46a-41bc-a872-a6f30247bfe3-photoroom-png-photoroom-qbh3tj965v8zvznury1xw70z0pbtkm6iggbz0maylc.png"
            alt="TROSENSE Logo"
            className="h-9 sm:h-10"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 font-medium text-sm sm:text-base">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`transition text-black hover:text-indigo-600 dark:hover:text-indigo-400 ${
                location.pathname === item.path
                  ? "text-indigo-600 dark:text-indigo-400"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right - Petronas Logo + Burger */}
        
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 pb-4 animate-fade-in">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`py-2 px-1 rounded transition hover:text-indigo-600 dark:hover:text-indigo-400 ${
                  location.pathname === item.path
                    ? "text-indigo-600 dark:text-indigo-400"
                    : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Sidebar;
