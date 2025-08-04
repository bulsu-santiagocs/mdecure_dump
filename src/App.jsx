// src/App.jsx
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
import { supabase } from "@/supabase/client";
import defaultLogo from "@/assets/images/logo-transparent.png";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [branding, setBranding] = useState({
    name: "MedCure",
    url: defaultLogo,
  });

  const fetchInitialData = async () => {
    // Fetch user session
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

    // Fetch branding info
    const { data: brandingData } = await supabase
      .from("branding")
      .select("name, logo_url")
      .eq("id", 1)
      .single();

    if (brandingData) {
      setBranding({ name: brandingData.name, url: brandingData.logo_url });
    } else {
      console.log("No branding data found, using defaults.");
    }
  };

  useEffect(() => {
    fetchInitialData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    fetchInitialData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
  };

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} branding={branding} />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-gray-200">
      <Sidebar branding={branding} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header handleLogout={handleLogout} user={user} />
        <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-white to-gray-100">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/management" element={<Management />} />
            <Route path="/archived" element={<Archived />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/point-of-sales" element={<PointOfSales />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route
              path="/settings"
              element={<Settings onUpdate={fetchInitialData} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
