import { useState } from "react";
import { X, Search, TrendingUp, TrendingDown } from "lucide-react";

const AddStocksModal = ({
  isOpen,
  onClose,
  onAddStocks,
  selectedStocks = [],
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelected, setTempSelected] = useState(selectedStocks);
  const [activeStock, setActiveStock] = useState(null);
  const [quantity, setQuantity] = useState(8);

  const stocksData = [
    {
      symbol: "NFLX",
      name: "Netflix, Inc",
      price: 88.91,
      change: 1.29,
      trend: "up",
      inBucket: true,
      stocks: 8,
    },
    {
      symbol: "FB",
      name: "Facebook",
      price: 95.91,
      change: 1.29,
      trend: "down",
      inBucket: true,
      stocks: 8,
    },
    {
      symbol: "AAPL",
      name: "Apple, Inc",
      price: 60.22,
      change: 1.3,
      trend: "up",
      inBucket: true,
      stocks: 2,
    },
    {
      symbol: "NFLX",
      name: "Netflix, Inc",
      price: 88.91,
      change: 1.29,
      trend: "up",
      inBucket: true,
      stocks: 8,
    },
    {
      symbol: "SPFY",
      name: "Spotify",
      price: 34.67,
      change: 1.29,
      trend: "up",
      inBucket: true,
      stocks: 6,
    },
    {
      symbol: "BNKA",
      name: "Bank of A...",
      price: 78.9,
      change: 1.29,
      trend: "up",
      inBucket: true,
      stocks: 2,
    },
    {
      symbol: "APPL",
      name: "Netflix, Inc",
      price: 20.23,
      change: 0.29,
      trend: "up",
      inBucket: true,
      stocks: 10,
    },
    {
      symbol: "MS",
      name: "Microsoft",
      price: 88.91,
      change: 1.29,
      trend: "up",
      inBucket: true,
      stocks: 2,
    },
    {
      symbol: "FB",
      name: "Facebook",
      price: 95.91,
      change: 1.29,
      trend: "down",
      inBucket: true,
      stocks: 8,
    },
    {
      symbol: "NFLX",
      name: "Netflix, Inc",
      price: 88.91,
      change: 1.29,
      trend: "up",
      inBucket: true,
      stocks: 8,
    },
  ];

  if (!isOpen) return null;

  const handleStockClick = (stock) => {
    setActiveStock(stock);
    setQuantity(stock.stocks || 8);
  };

  const handleCheckboxChange = (symbol) => {
    if (tempSelected.includes(symbol)) {
      setTempSelected(tempSelected.filter((s) => s !== symbol));
    } else {
      setTempSelected([...tempSelected, symbol]);
    }
  };

  const handleAddToBucket = () => {
    onAddStocks(tempSelected);
    onClose();
  };

  const filteredStocks = stocksData.filter(
    (stock) =>
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Stocks</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Side - Stock List */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search here"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Top Performer Header */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <span className="text-sm font-semibold text-gray-700">
                Top Performer
              </span>
            </div>

            {/* Stock List */}
            <div className="flex-1 overflow-y-auto">
              {filteredStocks.map((stock, idx) => (
                <div
                  key={idx}
                  onClick={() => handleStockClick(stock)}
                  className={`flex items-center gap-3 p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    activeStock?.symbol === stock.symbol ? "bg-blue-50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={tempSelected.includes(stock.symbol)}
                    onChange={() => handleCheckboxChange(stock.symbol)}
                    className="w-4 h-4 text-blue-600 rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold text-sm">
                    N
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {stock.symbol}
                    </div>
                    <div className="text-sm text-gray-500">{stock.name}</div>
                  </div>
                  <div className="w-16 h-10">
                    {stock.trend === "up" ? (
                      <TrendingUp className="w-full h-full text-green-500" />
                    ) : (
                      <TrendingDown className="w-full h-full text-red-500" />
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">In Bucket</div>
                    <div className="font-semibold text-gray-900">
                      {stock.stocks} stocks
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      ${stock.price}
                    </div>
                    <div
                      className={`text-sm ${
                        stock.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      + {stock.change}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Stock Detail */}
          <div className="w-1/2 flex flex-col">
            {activeStock ? (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                        A
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Apple inc
                        </h3>
                        <p className="text-sm text-gray-500">AAPL</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${activeStock.price}
                      </div>
                      <div className="text-sm text-gray-500">
                        Last update at 14.30
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="flex-1 p-6">
                  <div className="flex gap-2 mb-4">
                    {[
                      "1 Day",
                      "1 Week",
                      "1 Month",
                      "3 Month",
                      "6 Month",
                      "1 Year",
                      "5 Year",
                    ].map((period) => (
                      <button
                        key={period}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          period === "1 Week"
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                  <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400">Chart Area</div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="p-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="text-lg font-semibold text-gray-900 w-12 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button className="px-6 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800">
                      Add Stock
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a stock to view details
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 flex items-center gap-1">
              Apple <X className="w-3 h-3 cursor-pointer" />
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 flex items-center gap-1">
              Netflix <X className="w-3 h-3 cursor-pointer" />
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 flex items-center gap-1">
              HDFC <X className="w-3 h-3 cursor-pointer" />
            </span>
          </div>
          <button
            onClick={handleAddToBucket}
            className="px-6 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800"
          >
            Add to Bucket
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStocksModal;
