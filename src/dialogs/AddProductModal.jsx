import React, { useState } from "react";
import PropTypes from "prop-types";
import { supabase } from "@/supabase/client";

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: "",
    expireDate: "",
    productType: "Medicine",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Get the last product ID for the auto-increment part
      const { data: lastProduct, error: fetchError } = await supabase
        .from("products")
        .select("id")
        .order("id", { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // Ignore 'range not found' error for empty table
        throw fetchError;
      }

      const nextId = lastProduct ? lastProduct.id + 1 : 1;

      // 2. Generate the medicineId
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const year = today.getFullYear();
      const datePart = `${month}${day}${year}`;
      const typePart = formData.productType === "Medicine" ? "1" : "0"; // 1 for Medicine, 0 for others
      const newMedicineId = `${datePart}${typePart}${nextId}`;

      // 3. Prepare data for insertion
      const productToInsert = {
        ...formData,
        medicineId: newMedicineId,
        status: "Available", // Always set status to "Available"
      };

      // 4. Insert the new product
      const { error: insertError } = await supabase
        .from("products")
        .insert([productToInsert]);

      if (insertError) {
        throw insertError;
      }

      onProductAdded();
      onClose();
    } catch (e) {
      console.error("Error adding product:", e);
      setError("Failed to add product: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="expireDate"
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
          <textarea
            name="description"
            placeholder="Medicine Description"
            onChange={handleChange}
            className="w-full p-2 border rounded min-h-[100px]"
          />
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
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onProductAdded: PropTypes.func.isRequired,
};

export default AddProductModal;
