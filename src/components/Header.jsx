import { useState } from "react";
import PropTypes from "prop-types";
import { Search, Bell, User, ChevronDown, LogOut } from "lucide-react";

const Header = ({ handleLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex items-center h-[69px] bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between w-full px-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xs">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full py-2 pl-10 pr-4 text-gray-800 bg-gray-100 border-transparent rounded-full focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            placeholder="Search..."
          />
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-5">
          {/* Notifications */}
          <button className="p-2 text-gray-500 hover:text-blue-600 relative rounded-full hover:bg-gray-100 transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div className="text-sm hidden md:block">
                <div className="font-medium text-gray-700">Administrator</div>
                <div className="text-xs text-gray-500">medcure.ph</div>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default Header;
