import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Management from "./pages/Management";
import Archived from "./pages/Archived";
import Notification from "./pages/Notification";
import PointOfSales from "./pages/PointOfSales";
import Contacts from "./pages/Contacts";
import Settings from "./pages/Settings";
import LoginPage from "./pages/auth/LoginPage";
import { supabase } from "@/supabase/client"; // Ensure this is using the alias too

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Add state for user data

  // Function to fetch user data
  const fetchUserData = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      setIsLoggedIn(true);
      setUser(session.user);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch data on initial load

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setIsLoggedIn(true);
          setUser(session.user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    fetchUserData(); // Fetch user data on login
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Pass user data and handleLogout to Header */}
        <Header handleLogout={handleLogout} user={user} />
        <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-white to-gray-100">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/management" element={<Management />} />
            <Route path="/archived" element={<Archived />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/point-of-sales" element={<PointOfSales />} />
            <Route path="/contacts" element={<Contacts />} />
            {/* Pass the fetchUserData function to Settings */}
            <Route
              path="/settings"
              element={<Settings onUpdate={fetchUserData} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
