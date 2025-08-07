import React from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

// Moved DetailField outside the parent component to prevent re-declaration on every render
const DetailField = ({ label, value, id }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-500 mb-1"
    >
      {label}
    </label>
    <div
      id={id}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800"
    >
      {value || "N/A"}
    </div>
  </div>
);

// Added prop validation for the new DetailField component
DetailField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  id: PropTypes.string.isRequired,
};

const ViewProductModal = ({ isOpen, onClose, product }) => {
  if (!isOpen) return null;

  const formatPrice = (price) => {
    if (price === null || price === undefined) {
      return "N/A";
    }
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <DetailField
            id="category"
            label="Medicine Category"
            value={product.category}
          />
          <DetailField
            id="price"
            label="Buy Price"
            value={formatPrice(product.price)}
          />
          <DetailField
            id="expiryDate"
            label="Expiry Date"
            value={product.expireDate}
          />
          <DetailField
            id="productType"
            label="Product Type"
            value={product.productType}
          />
        </div>

        {/* Description */}
        <div className="mt-6">
          {/* Replaced label with a p tag to resolve the accessibility error */}
          <p className="block text-sm font-medium text-gray-500 mb-1">
            Medicine Description
          </p>
          <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm min-h-[100px]">
            {product.description || "No description available."}
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-8 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ViewProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.string,
    price: PropTypes.number,
    expireDate: PropTypes.string,
    productType: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default ViewProductModal;
