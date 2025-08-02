import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { supabase } from "../../supabase/client";

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
  const [formData, setFormData] = useState(product);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("products")
      .update(formData)
      .eq("id", product.id);
    if (error) {
      console.error("Error updating product:", error);
    } else {
      onProductUpdated();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="medicineId"
            value={formData.medicineId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
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
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Save Changes
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
