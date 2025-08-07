import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { supabase } from "../supabase/client";

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
  const [formData, setFormData] = useState(product);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Reset form data and error when a new product is selected
    setFormData(product);
    setError("");
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Destructure to separate the id from the rest of the data
    const { id, ...updateData } = formData;

    const { error: updateError } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id);

    if (updateError) {
      console.error("Error updating product:", updateError);
      setError("Failed to update product: " + updateError.message);
    } else {
      onProductUpdated();
      onClose();
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form inputs remain the same... */}
          <input
            type="number"
            name="medicineId"
            value={formData.medicineId}
            onChange={handleChange}
            placeholder="Medicine ID"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="expireDate"
            value={formData.expireDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <select
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Medicine">Medicine</option>
            <option value="Supplement">Supplement</option>
            <option value="Other">Other</option>
          </select>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  onProductUpdated: PropTypes.func.isRequired,
};

export default EditProductModal;
