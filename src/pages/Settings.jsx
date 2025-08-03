import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Make sure to import PropTypes
import { User, Shield, Bell, CreditCard, HelpCircle } from "lucide-react";
import { supabase } from "@/supabase/client";

const Settings = ({ onUpdate }) => {
  // Accept onUpdate prop
  const [activeTab, setActiveTab] = useState("Profile");

  const settingsTabs = [
    { name: "Profile", icon: <User size={20} /> },
    { name: "Security", icon: <Shield size={20} /> },
    { name: "Notifications", icon: <Bell size={20} /> },
    { name: "Billing", icon: <CreditCard size={20} /> },
    { name: "Support", icon: <HelpCircle size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return <ProfileSettings onUpdate={onUpdate} />; // Pass onUpdate down
      // ... other cases
      default:
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800">{activeTab}</h2>
            <p className="mt-2 text-gray-600">
              Settings for {activeTab} will be available soon.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-140px)]">
      {/* Sidebar Navigation */}
      <aside className="lg:w-1/4 bg-white p-4 rounded-2xl shadow-lg">
        <h1 className="text-xl font-bold text-gray-800 p-4">Settings</h1>
        <nav className="space-y-2">
          {settingsTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`w-full flex items-center gap-4 p-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.name
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white p-6 rounded-2xl shadow-lg">
        {renderContent()}
      </main>
    </div>
  );
};

Settings.propTypes = {
  onUpdate: PropTypes.func.isRequired,
};

// In ProfileSettings component, call the onUpdate function after a successful change.
const ProfileSettings = ({ onUpdate }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setFullName(user.user_metadata.full_name || "");
        setRole(user.user_metadata.role || "");
        setEmail(user.email);
        setPhone(user.user_metadata.phone || "");
        setAvatarUrl(user.user_metadata.avatar_url);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({
      email: email,
      data: {
        full_name: fullName,
        role: role,
        phone: phone,
        avatar_url: avatarUrl,
      },
    });

    if (error) {
      alert("Error updating the user: " + error.message);
    } else {
      alert("Profile updated successfully!");
      onUpdate(); // Trigger the refresh in App.jsx
    }
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    // Make sure user is available before proceeding
    if (!user) {
      setUploading(false);
      return;
    }

    const fileName = `${user.id}/${Date.now()}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (uploadError) {
      alert("Error uploading file: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

    const publicUrl = data.publicUrl;
    setAvatarUrl(publicUrl);

    const { error: updateUserError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    });

    if (updateUserError) {
      alert("Error updating user photo: " + updateUserError.message);
    } else {
      onUpdate(); // Trigger refresh on photo change too
    }

    setUploading(false);
  };

  // ... (rest of the ProfileSettings component is the same)
  // The JSX part of ProfileSettings does not need to change.
  // ...

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Profile Information
      </h2>
      <p className="text-gray-500 mb-8 border-b pb-6">
        Update your personal details here.
      </p>
      <form className="space-y-6" onSubmit={handleSaveChanges}>
        <div className="flex items-center gap-6">
          <img
            src={avatarUrl || `https://i.pravatar.cc/150?u=${user?.id}`}
            alt="Admin"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <label
              htmlFor="photo-upload"
              className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {uploading ? "Uploading..." : "Change Photo"}
            </label>
            <input
              type="file"
              id="photo-upload"
              className="hidden"
              onChange={handlePhotoChange}
              disabled={uploading}
              accept="image/*"
            />
            <p className="mt-2 text-xs text-gray-500">
              JPG, GIF or PNG. 1MB max.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <label className="block">
            <span className="font-medium text-gray-700">Full Name</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
          <label className="block">
            <span className="font-medium text-gray-700">Role</span>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
          <label className="block">
            <span className="font-medium text-gray-700">Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
          <label className="block">
            <span className="font-medium text-gray-700">Phone Number</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
        </div>
        <div className="pt-4 text-right">
          <button
            type="submit"
            className="rounded-lg bg-gray-800 px-6 py-2.5 font-semibold text-white hover:bg-gray-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

ProfileSettings.propTypes = {
  onUpdate: PropTypes.func.isRequired,
};

const SecuritySettings = () => (
  <div>
    <h2 className="text-3xl font-bold text-gray-800 mb-2">Security</h2>
    <p className="text-gray-500 mb-8 border-b pb-6">
      Manage your account security settings.
    </p>
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-lg">Change Password</h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <input
            type="password"
            placeholder="Current Password"
            className="rounded-md border-gray-300 shadow-sm"
          />
          <input
            type="password"
            placeholder="New Password"
            className="rounded-md border-gray-300 shadow-sm"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="rounded-md border-gray-300 shadow-sm"
          />
        </form>
      </div>
      <div>
        <h3 className="font-semibold text-lg">Two-Factor Authentication</h3>
        <p className="text-sm text-gray-500">
          Add an extra layer of security to your account.
        </p>
        <button className="mt-3 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-100">
          Enable 2FA
        </button>
      </div>
      <div className="pt-4 text-right">
        <button
          type="submit"
          className="px-6 py-2.5 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700"
        >
          Update Security
        </button>
      </div>
    </div>
  </div>
);

const NotificationSettings = () => (
  <div>
    <h2 className="text-3xl font-bold text-gray-800 mb-2">Notifications</h2>
    <p className="text-gray-500 mb-8 border-b pb-6">
      Control how you receive notifications from us.
    </p>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">Email Notifications</h4>
          <p className="text-sm text-gray-500">
            Get emails about new orders, low stock, and system updates.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" defaultChecked className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">Push Notifications</h4>
          <p className="text-sm text-gray-500">
            Receive alerts directly on your device.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">Weekly Summary</h4>
          <p className="text-sm text-gray-500">
            Receive a weekly summary report via email.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" defaultChecked className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  </div>
);

export default Settings;
