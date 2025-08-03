import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Bell,
  ShoppingCart,
  Contact,
  ChevronsLeft,
  Menu,
  Pill,
  Archive,
} from "lucide-react";
import Logo from "./Logo.jsx";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
    { name: "Management", icon: <Pill size={20} />, path: "/management" },
    { name: "Notification", icon: <Bell size={20} />, path: "/notification" },
    {
      name: "Point Of Sales",
      icon: <ShoppingCart size={20} />,
      path: "/point-of-sales",
    },
    { name: "Contacts", icon: <Contact size={20} />, path: "/contacts" },
    { name: "Archived", icon: <Archive size={20} />, path: "/archived" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  return (
    <aside
      className={`h-full bg-white border-r border-gray-200 text-gray-800 transition-all duration-300 ease-in-out ${
        expanded ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-between h-[69px] px-4">
        {expanded && <Logo />}
        <button
          onClick={() => setExpanded((curr) => !curr)}
          className="p-2 rounded-lg hover:bg-gray-200"
        >
          {expanded ? <ChevronsLeft /> : <Menu />}
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`group w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span
                  className={`flex-shrink-0 transition-transform duration-200 ease-in-out group-hover:translate-x-1 ${
                    location.pathname === item.path
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-300 font-medium ${
                    expanded ? "w-36 ml-3" : "w-0"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
