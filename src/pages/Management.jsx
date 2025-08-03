import React, { useState, useEffect } from "react";
import {
  Plus,
  Upload,
  Search,
  Eye,
  Pencil,
  Archive,
  Filter,
} from "lucide-react";
import { supabase } from "../supabase/client";
import AddProductModal from "../components/modals/AddProductModal";
import EditProductModal from "../components/modals/EditProductModal";
import ViewProductModal from "../components/modals/ViewProductModal";
import { useProductSearch } from "../hooks/useProductSearch";
// Correct the import path to use the .jsx extension
import { usePagination } from "../hooks/usePagination.jsx";

const Management = () => {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { searchTerm, setSearchTerm, searchedProducts } =
    useProductSearch(products);
  const {
    paginatedData: paginatedProducts,
    PaginationComponent,
    ItemsPerPageComponent,
  } = usePagination(searchedProducts);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select();
    if (error) {
      console.error("Error fetching products:", error);
      setError(error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(searchedProducts.map((p) => p.id));
    } else {
      setSelectedItems([]);
    }
  };

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

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        Error fetching data: {error.message}
      </div>
    );
  }

  return (
    <>
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={fetchProducts}
      />
      {selectedProduct && (
        <>
          <EditProductModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            product={selectedProduct}
            onProductUpdated={fetchProducts}
          />
          <ViewProductModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            product={selectedProduct}
          />
        </>
      )}
      <div className="bg-white p-8 rounded-2xl shadow-lg font-sans">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Product Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your pharmacy's inventory here.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedItems.length > 0 && (
              <button className="flex items-center gap-2 border border-red-300 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                <Archive size={16} />
                Archive Selected ({selectedItems.length})
              </button>
            )}
            <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              <Upload size={16} />
              Export
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center justify-between gap-4 py-4 border-t border-b border-gray-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
              <Filter size={16} />
              <span>Filters</span>
            </button>
          </div>
          <ItemsPerPageComponent />
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 w-12 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={handleSelectAll}
                    checked={
                      searchedProducts.length > 0 &&
                      selectedItems.length === searchedProducts.length
                    }
                  />
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Medicine ID
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="p-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Expire Date
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Product Type
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`transition-colors group ${
                      selectedItems.includes(product.id)
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedItems.includes(product.id)}
                        onChange={() => handleSelectItem(product.id)}
                      />
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {product.medicineId}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {product.category}
                    </td>
                    <td className="p-4 text-sm text-gray-600 text-center">
                      {product.stock}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {product.expireDate}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {product.productType}
                    </td>
                    <td className="p-4 text-sm">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="p-4 text-sm text-center">
                      <div className="flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsViewModalOpen(true);
                          }}
                          className="text-gray-400 hover:text-blue-600"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsEditModalOpen(true);
                          }}
                          className="text-gray-400 hover:text-green-600"
                          title="Edit Product"
                        >
                          <Pencil size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <PaginationComponent />
      </div>
    </>
  );
};

export default Management;
