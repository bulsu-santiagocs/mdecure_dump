import React, { useState, useMemo } from "react";
import { Search, Plus, Minus, X, ShoppingCart } from "lucide-react";

const PointOfSales = () => {
  // Sample data based on the provided image
  const availableMedicines = [
    {
      id: "2485855848598",
      name: "Cefuroxime",
      quantity: 6,
      category: "Antibiotics",
      price: 18.0,
    },
    {
      id: "2485855847858",
      name: "Amoxicillin",
      quantity: 7,
      category: "Antibiotics",
      price: 20.0,
    },
    {
      id: "2485855848562",
      name: "Atorvastatin",
      quantity: 12,
      category: "Statins",
      price: 45.0,
    },
    {
      id: "2485855848508",
      name: "Metformin",
      quantity: 2,
      category: "Antidiabetics",
      price: 8.0,
    },
    {
      id: "24858558412438",
      name: "Insulin",
      quantity: 17,
      category: "Antidiabetics",
      price: 100.0,
    },
    {
      id: "24858558558598",
      name: "Lagundi Tablets",
      quantity: 20,
      category: "Herbal",
      price: 7.0,
    },
  ];

  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDiscounted, setIsDiscounted] = useState(false);
  const PWD_SENIOR_DISCOUNT = 0.2; // 20% discount

  const handleSelectMedicine = (medicine) => {
    setCart((prevCart) => {
      const itemInCart = prevCart.find((item) => item.id === medicine.id);
      if (itemInCart) {
        // If item is already in cart, increase quantity by 1
        return prevCart.map((item) =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Otherwise, add new item to cart with quantity 1
        return [...prevCart, { ...medicine, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (medicineId, newQuantity) => {
    if (newQuantity < 1) {
      // Remove item if quantity is less than 1
      setCart(cart.filter((item) => item.id !== medicineId));
    } else {
      setCart(
        cart.map((item) =>
          item.id === medicineId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const total = useMemo(() => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    if (isDiscounted) {
      return subtotal * (1 - PWD_SENIOR_DISCOUNT);
    }
    return subtotal;
  }, [cart, isDiscounted]);

  const filteredMedicines = availableMedicines.filter((med) =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid lg:grid-cols-5 gap-8 h-[calc(100vh-140px)]">
      {/* Left Column: Medicine List */}
      <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-lg flex flex-col">
        <div className="relative mb-4">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search medicine..."
            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-grow overflow-y-auto -mr-3 pr-3">
          <table className="min-w-full">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th className="p-4 w-12 text-left"></th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Category
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMedicines.map((med) => (
                <tr
                  key={med.id + med.name}
                  className="hover:bg-blue-50 cursor-pointer"
                  onClick={() => handleSelectMedicine(med)}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={cart.some((item) => item.id === med.id)}
                      readOnly
                    />
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">{med.id}</td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-800">
                    {med.name}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {med.category}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-gray-800">
                    ₱{med.price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
          Order
        </h2>

        <div className="flex-grow overflow-y-auto -mr-3 pr-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart size={48} />
              <p className="mt-4 text-lg">Your cart is empty</p>
              <p className="text-sm">Select items from the list to begin.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      ₱{item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="w-20 text-right font-bold">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => updateQuantity(item.id, 0)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto pt-6 border-t-2 border-dashed">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-gray-600">
              PWD/Senior Discount
            </span>
            <button
              onClick={() => setIsDiscounted(!isDiscounted)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                isDiscounted ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  isDiscounted ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="flex justify-between items-center text-2xl font-bold text-gray-800 mb-6">
            <span>Total:</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
          <button className="w-full py-4 bg-gray-900 text-white font-bold text-lg rounded-xl hover:bg-gray-700 transition-colors">
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointOfSales;
