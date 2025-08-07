import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { supabase } from "@/supabase/client";

const BrandingSettings = ({ onUpdate }) => {
  const [logoName, setLogoName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchBranding = async () => {
      const { data, error } = await supabase
        .from("branding")
        .select("*")
        .eq("id", 1)
        .single();

      if (data) {
        setLogoName(data.name);
        setLogoUrl(data.logo_url);
      } else {
        console.error("Error fetching branding:", error);
      }
      setLoading(false);
    };
    fetchBranding();
  }, []);

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileName = `public/${Date.now()}`;
    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(fileName, file);

    if (uploadError) {
      alert("Error uploading logo: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("logos").getPublicUrl(fileName);

    setLogoUrl(data.publicUrl);
    setUploading(false);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("branding")
      .update({ name: logoName, logo_url: logoUrl })
      .eq("id", 1);

    if (error) {
      alert("Error updating branding: " + error.message);
    } else {
      alert("Branding updated successfully!");
      onUpdate();
    }
  };

  if (loading) return <div>Loading branding settings...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Branding & Appearance
      </h2>
      <p className="text-gray-500 mb-8 border-b pb-6">
        Customize the look of your application.
      </p>
      <form className="space-y-6" onSubmit={handleSaveChanges}>
        <div className="flex items-center gap-6">
          <img
            src={
              logoUrl || "https://placehold.co/100x100/E2E8F0/4A5568?text=Logo"
            }
            alt="Current Logo"
            className="w-24 h-24 rounded-lg object-cover bg-gray-100"
          />
          <div>
            <label
              htmlFor="logo-upload"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 cursor-pointer"
            >
              {uploading ? "Uploading..." : "Change Logo"}
            </label>
            <input
              type="file"
              id="logo-upload"
              name="logo-upload"
              className="hidden"
              onChange={handleLogoUpload}
              disabled={uploading}
              accept="image/*"
            />
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG, GIF up to 2MB.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-gray-700 font-medium">Brand Name</span>
            <input
              type="text"
              id="brand-name"
              name="brand-name"
              value={logoName}
              onChange={(e) => setLogoName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
        </div>
        <div className="pt-4 text-right">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700"
          >
            Save Branding
          </button>
        </div>
      </form>
    </div>
  );
};

BrandingSettings.propTypes = {
  onUpdate: PropTypes.func.isRequired,
};

export default BrandingSettings;
