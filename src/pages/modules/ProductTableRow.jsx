import React from "react";
import PropTypes from "prop-types";
import { Eye, Pencil } from "lucide-react";

const ProductTableRow = ({
  product,
  isSelected,
  onSelectItem,
  onViewProduct,
  onEditProduct,
}) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Available":
        return (
          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            {status}
          </span>
        );
      case "Unavailable":
        return (
          <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <tr
      className={`transition-colors group ${
        isSelected ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      <td className="p-4">
        <input
          type="checkbox"
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={isSelected}
          onChange={() => onSelectItem(product.id)}
        />
      </td>
      <td className="p-4 text-sm text-gray-600">{product.medicineId}</td>
      <td className="p-4 font-medium text-gray-900">{product.name}</td>
      <td className="p-4 text-sm text-gray-600">{product.category}</td>
      <td className="p-4 text-sm text-gray-600 text-center">{product.stock}</td>
      <td className="p-4 text-sm text-gray-600">{product.expireDate}</td>
      <td className="p-4 text-sm text-gray-600">{product.productType}</td>
      <td className="p-4 text-sm">{getStatusBadge(product.status)}</td>
      <td className="p-4 text-sm text-center">
        <div className="flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onViewProduct(product)}
            className="text-gray-400 hover:text-blue-600"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => onEditProduct(product)}
            className="text-gray-400 hover:text-green-600"
            title="Edit Product"
          >
            <Pencil size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

ProductTableRow.propTypes = {
  product: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  onViewProduct: PropTypes.func.isRequired,
  onEditProduct: PropTypes.func.isRequired,
};

export default ProductTableRow;
