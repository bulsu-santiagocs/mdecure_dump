import React, { useState, useEffect } from "react";
import {
  Archive,
  Pill,
  DollarSign,
  PackageX,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import { supabase } from "@/supabase/client";

const Dashboard = () => {
  const [summaryCards, setSummaryCards] = useState([
    {
      title: "Inventory Status",
      value: "0",
      icon: <Archive className="text-green-500" />,
      iconBg: "bg-green-100",
    },
    {
      title: "Medicine Available",
      value: "0",
      icon: <Pill className="text-blue-500" />,
      iconBg: "bg-blue-100",
    },
    {
      title: "Total Profit",
      value: "₱0",
      icon: <DollarSign className="text-yellow-500" />,
      iconBg: "bg-yellow-100",
    },
    {
      title: "Out of Stock",
      value: "0",
      icon: <PackageX className="text-red-500" />,
      iconBg: "bg-red-100",
    },
  ]);

  const [monthlyProgressData, setMonthlyProgressData] = useState([]);
  const [posData, setPosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalEarning, setTotalEarning] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch products for inventory stats
        const { data: products, error: productsError } = await supabase
          .from("products")
          .select("quantity, status, price");

        if (productsError) throw productsError;

        const inventoryStatus = products.length;
        const medicineAvailable = products.filter(
          (p) => p.status === "Available"
        ).length;
        const outOfStock = products.filter((p) => p.quantity === 0).length;
        const totalProfit = products.reduce(
          (acc, p) => acc + (p.price || 0) * (p.quantity || 0),
          0
        );

        // Fetch sales for profit and monthly progress
        const { data: sales, error: salesError } = await supabase
          .from("sales")
          .select("created_at, total_amount");

        if (salesError) throw salesError;

        const currentTotalEarning = sales.reduce(
          (acc, s) => acc + s.total_amount,
          0
        );
        setTotalEarning(currentTotalEarning);

        const monthlySales = sales.reduce((acc, sale) => {
          const month = new Date(sale.created_at).getMonth(); // 0-11
          acc[month] = (acc[month] || 0) + sale.total_amount;
          return acc;
        }, {});

        const currentMonth = new Date().getMonth();
        const generatedMonthlyProgress = Array.from({ length: 12 }, (_, i) => {
          const monthName = new Date(0, i).toLocaleString("default", {
            month: "short",
          });
          return {
            month: monthName,
            value: monthlySales[i] || 0,
            isCurrent: i === currentMonth,
          };
        });
        setMonthlyProgressData(generatedMonthlyProgress);

        // Fetch recent POS data
        const { data: recentSales, error: recentSalesError } = await supabase
          .from("sale_items")
          .select(
            `
            quantity,
            price_at_sale,
            sales (created_at),
            products (name, medicineId)
          `
          )
          .limit(5);

        if (recentSalesError) throw recentSalesError;

        const formattedPosData = recentSales.map((item) => ({
          medicineName: item.products.name,
          batchNo: item.products.medicineId,
          quantity: item.quantity,
          status: "Delivered", // This is static in the original, can be changed if sale status is tracked
          price: `₱${item.price_at_sale.toFixed(2)}`,
        }));
        setPosData(formattedPosData);

        setSummaryCards([
          {
            title: "Inventory Status",
            value: inventoryStatus.toString(),
            icon: <Archive className="text-green-500" />,
            iconBg: "bg-green-100",
          },
          {
            title: "Medicine Available",
            value: medicineAvailable.toString(),
            icon: <Pill className="text-blue-500" />,
            iconBg: "bg-blue-100",
          },
          {
            title: "Total Profit",
            value: `₱${totalProfit.toFixed(2)}`,
            icon: <DollarSign className="text-yellow-500" />,
            iconBg: "bg-yellow-100",
          },
          {
            title: "Out of Stock",
            value: outOfStock.toString(),
            icon: <PackageX className="text-red-500" />,
            iconBg: "bg-red-100",
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusChip = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            {status}
          </span>
        );
      case "Pending":
        return (
          <span className="px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
            {status}
          </span>
        );
      case "Canceled":
        return (
          <span className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="bg-white p-5 rounded-xl shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-lg ${card.iconBg}`}>{card.icon}</div>
            </div>
            <div className="mt-2">
              <p className="text-gray-500 text-sm">{card.title}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              <button className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                Show Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Progress Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Monthly Progress
            </h2>
            <button className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-md text-sm">
              Monthly <ChevronDown size={16} className="ml-1" />
            </button>
          </div>
          <div className="h-72 flex items-end justify-between space-x-2 text-center">
            {monthlyProgressData.map((item) => (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center h-full justify-end"
              >
                <div className="relative group w-full flex items-end justify-center h-full">
                  {item.isCurrent && (
                    <div className="absolute -top-10 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                      <p className="font-bold">{item.month}</p>
                      <p>₱{item.value.toFixed(2)}</p>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-2 h-2 bg-gray-800 transform rotate-45 -mb-1"></div>
                    </div>
                  )}
                  <div
                    className={`w-3/4 rounded-t-md ${
                      item.isCurrent ? "bg-gray-700" : "bg-gray-200"
                    } hover:bg-blue-400 transition-colors`}
                    style={{
                      height: `${
                        (item.value /
                          (Math.max(
                            ...monthlyProgressData.map((d) => d.value)
                          ) || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 mt-2">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Report Donut Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Today's Report
          </h2>
          <div className="relative flex items-center justify-center h-48 w-48 mx-auto my-4">
            {/* This is a CSS approximation of the donut chart */}
            <div
              className="absolute w-full h-full rounded-full"
              style={{
                background:
                  "conic-gradient(#4f46e5 0% 55%, transparent 55% 100%)",
              }}
            ></div>
            <div
              className="absolute w-[80%] h-[80%] rounded-full"
              style={{
                background:
                  "conic-gradient(transparent 0% 55%, #10b981 55% 80%, transparent 80% 100%)",
              }}
            ></div>
            <div
              className="absolute w-[60%] h-[60%] rounded-full"
              style={{
                background:
                  "conic-gradient(transparent 0% 80%, #f59e0b 80% 90%, transparent 90% 100%)",
              }}
            ></div>
            <div
              className="absolute w-[40%] h-[40%] rounded-full"
              style={{
                background:
                  "conic-gradient(transparent 0% 90%, #ef4444 90% 100%, transparent 100% 100%)",
              }}
            ></div>
            <div className="absolute w-[85%] h-[85%] bg-white rounded-full"></div>
            <div className="absolute text-center">
              <p className="text-gray-500 text-sm">Total Earning</p>
              <p className="text-2xl font-bold text-gray-800">
                ₱{totalEarning.toFixed(2)}
              </p>
              <div className="flex items-center justify-center text-green-500 text-xs mt-1">
                <ArrowUpRight size={12} />
                <span>15.5%</span>
              </div>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-600 mt-6">
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-indigo-600 mr-3"></span>
              <span>Total Purchase</span>
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-3"></span>
              <span>Cash Received</span>
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></span>
              <span>Bank Receive</span>
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-3"></span>
              <span>Total Service</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Point of Sales Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Point Of Sales
          </h2>
          <button className="text-sm text-blue-600 hover:underline">
            See All &gt;
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-500 pb-2 border-b">
              <div className="col-span-1">Medicine name</div>
              <div className="col-span-1">Batch No</div>
              <div className="col-span-1 text-center">Quantity</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-1 text-right">Price</div>
            </div>
            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {posData.map((item, index) => (
                <div
                  key={`${item.medicineName}-${item.batchNo}-${index}`}
                  className="grid grid-cols-5 gap-4 py-4 items-center text-sm text-gray-800"
                >
                  <div className="col-span-1 font-medium whitespace-pre-wrap">
                    {item.medicineName}
                  </div>
                  <div className="col-span-1 text-gray-500 whitespace-pre-wrap">
                    {item.batchNo}
                  </div>
                  <div className="col-span-1 text-center text-gray-500">
                    {item.quantity}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {getStatusChip(item.status)}
                  </div>
                  <div className="col-span-1 text-right font-medium">
                    {item.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
