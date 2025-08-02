import React from "react";
import PropTypes from "prop-types";

const ViewProductModal = ({ isOpen, onClose, product }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{product.name}</h2>
        <div className="space-y-2">
          <p>
            <strong>Medicine ID:</strong> {product.medicineId}
          </p>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p>
            <strong>Stock:</strong> {product.stock}
          </p>
          <p>
            <strong>Expire Date:</strong> {product.expireDate}
          </p>
          <p>
            <strong>Product Type:</strong> {product.productType}
          </p>
          <p>
            <strong>Status:</strong> {product.status}
          </p>
        </div>
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">
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
    medicineId: PropTypes.number,
    category: PropTypes.string,
    stock: PropTypes.number,
    expireDate: PropTypes.string,
    productType: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};

export default ViewProductModal;
