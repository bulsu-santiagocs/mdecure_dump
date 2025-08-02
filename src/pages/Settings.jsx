import React, { useState } from "react";
import { User, Shield, Bell, CreditCard, HelpCircle } from "lucide-react";

const Settings = () => {
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
        return <ProfileSettings />;
      case "Security":
        return <SecuritySettings />;
      case "Notifications":
        return <NotificationSettings />;
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

// Sub-components for each settings tab
const ProfileSettings = () => (
  <div>
    <h2 className="text-3xl font-bold text-gray-800 mb-2">
      Profile Information
    </h2>
    <p className="text-gray-500 mb-8 border-b pb-6">
      Update your personal details here.
    </p>
    <form className="space-y-6">
      <div className="flex items-center gap-6">
        <img
          src="https://i.pravatar.cc/150?u=admin"
          alt="Admin"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            Change Photo
          </button>
          <p className="text-xs text-gray-500 mt-2">
            JPG, GIF or PNG. 1MB max.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          <span className="text-gray-700 font-medium">Full Name</span>
          <input
            type="text"
            defaultValue="Administrator"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium">Role</span>
          <input
            type="text"
            defaultValue="System Administrator"
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
          />
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium">Email Address</span>
          <input
            type="email"
            defaultValue="admin@medcure.ph"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium">Phone Number</span>
          <input
            type="tel"
            defaultValue="(123) 456-7890"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </label>
      </div>
      <div className="pt-4 text-right">
        <button
          type="submit"
          className="px-6 py-2.5 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  </div>
);

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
