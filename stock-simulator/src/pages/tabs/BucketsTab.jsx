import { useState } from "react";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Plus,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import AddStocksModal from "../../components/Modals/AddStocksModal";

const BucketsTab = ({ portfolio, onBack }) => {
  const [expandedBuckets, setExpandedBuckets] = useState(["tech"]);
  const [showAddStocksModal, setShowAddStocksModal] = useState(false);
  const [activeBucket, setActiveBucket] = useState(null);
  const [showAIChat, setShowAIChat] = useState(false);

  const bucketsData = [
    {
      id: "tech",
      name: "Tech Bucket",
      canRepick: true,
      bucketWeight: { manual: true, value: 50 },
      includes: "5 sectors",
      excludes: "3 sectors & 2 stocks",
      stocks: [
        {
          symbol: "SPFY",
          name: "Spotify",
          icon: "🎵",
          inBucket: true,
          count: 6,
          price: 34.67,
          change: 1.29,
          trend: "up",
        },
        {
          symbol: "AAPL",
          name: "Apple, Inc",
          icon: "🍎",
          inBucket: true,
          count: 2,
          price: 60.22,
          change: 1.3,
          trend: "up",
        },
        {
          symbol: "BNKA",
          name: "Bank of A...",
          icon: "🏦",
          inBucket: true,
          count: 2,
          price: 78.9,
          change: 1.29,
          trend: "up",
        },
        {
          symbol: "APPL",
          name: "Netflix, Inc",
          icon: "📱",
          inBucket: true,
          count: 10,
          price: 20.23,
          change: 0.29,
          trend: "up",
        },
        {
          symbol: "MS",
          name: "Microsoft",
          icon: "💻",
          inBucket: true,
          count: 2,
          price: 88.91,
          change: 1.29,
          trend: "up",
        },
        {
          symbol: "ABNB",
          name: "AirBnB",
          icon: "🏠",
          inBucket: true,
          count: 2,
          price: 78.91,
          change: 1.1,
          trend: "up",
        },
        {
          symbol: "FB",
          name: "Facebook",
          icon: "F",
          inBucket: true,
          count: 8,
          price: 95.91,
          change: 1.29,
          trend: "down",
        },
        {
          symbol: "FB",
          name: "Facebook",
          icon: "F",
          inBucket: true,
          count: 8,
          price: 95.91,
          change: 1.29,
          trend: "down",
        },
      ],
    },
    {
      id: "finance",
      name: "Finance Bucket",
      canRepick: true,
      bucketWeight: { manual: false, value: 50 },
      includes: "5 sectors",
      excludes: "3 sectors & 2 stocks",
      stocks: [],
    },
  ];

  const toggleBucket = (bucketId) => {
    setExpandedBuckets((prev) =>
      prev.includes(bucketId)
        ? prev.filter((id) => id !== bucketId)
        : [...prev, bucketId]
    );
  };

  const handleAddStocks = (bucket) => {
    setActiveBucket(bucket);
    setShowAddStocksModal(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="clients" />

      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {portfolio?.name || "Aditya's Portfolio"}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <img
                      src="https://flagcdn.com/w20/in.png"
                      alt="India"
                      className="w-4 h-3"
                    />
                    BSE
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-600">Risk</span>
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                    Medium
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Planning
              </span>
              <button className="px-6 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors">
                Set as Active
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-gray-200">
            {["Summary", "Buckets", "Simulator", "Rebalance"].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-3 font-medium transition-colors ${
                  tab === "Buckets"
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="grid grid-cols-3 gap-6">
            {/* Buckets Section */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Portfolio Buckets
                </h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
                    Re-run Stocks
                  </button>
                  <button className="px-4 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Magic Stocks
                  </button>
                </div>
              </div>

              {bucketsData.map((bucket) => (
                <div
                  key={bucket.id}
                  className="bg-white rounded-lg border border-gray-200"
                >
                  {/* Bucket Header */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900">
                          {bucket.name}
                        </h3>
                        {bucket.canRepick && (
                          <button className="text-blue-700 text-sm font-medium hover:underline">
                            Re-pick Bucket
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">
                            Added Stocks:
                          </span>
                          <div className="flex -space-x-1">
                            {["🔴", "🔵", "🟢", "🟡"].map((color, idx) => (
                              <div
                                key={idx}
                                className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs"
                              >
                                {color}
                              </div>
                            ))}
                            <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                              +{bucket.stocks.length - 4}
                            </div>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={() => toggleBucket(bucket.id)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          {expandedBuckets.includes(bucket.id) ? (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Bucket Weight */}
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-sm font-medium text-gray-700">
                        Bucket Weight
                      </span>
                      <div className="flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bucket.bucketWeight.manual}
                            className="sr-only peer"
                            readOnly
                          />
                          <div className="w-11 h-6 bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                        <span className="text-sm text-gray-600">Manual</span>
                      </div>
                      <div className="flex-1 flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={bucket.bucketWeight.value}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          readOnly
                        />
                        <div className="flex gap-2">
                          <span className="text-sm text-gray-600">30%</span>
                          <span className="text-sm text-gray-600">80%</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      <span className="font-medium">Includes:</span>{" "}
                      {bucket.includes}
                      <br />
                      <span className="font-medium">Excludes:</span>{" "}
                      {bucket.excludes}
                    </div>
                  </div>

                  {/* Expanded Stocks */}
                  {expandedBuckets.includes(bucket.id) && (
                    <div className="border-t border-gray-200">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">
                            Stocks
                          </h4>
                          <button
                            onClick={() => handleAddStocks(bucket)}
                            className="px-4 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800"
                          >
                            Add Stocks
                          </button>
                        </div>

                        {bucket.stocks.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4">
                            {bucket.stocks.map((stock, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center text-xl">
                                  {stock.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900 text-sm">
                                    {stock.symbol}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {stock.name}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">
                                    In Bucket:{" "}
                                    <span className="font-medium">
                                      {stock.count} stocks
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-gray-900">
                                    ${stock.price}
                                  </div>
                                  <div
                                    className={`text-sm ${
                                      stock.trend === "up"
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    + {stock.change}%
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            No stocks added yet
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pie Chart Sidebar */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="w-full aspect-square bg-gradient-to-br from-purple-100 via-blue-100 to-teal-100 rounded-full flex items-center justify-center mb-6 relative">
                <div className="w-3/4 h-3/4 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Total Stocks</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {bucketsData.reduce((sum, b) => sum + b.stocks.length, 0)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {bucketsData.map((bucket, idx) => (
                  <div
                    key={bucket.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          idx === 0 ? "bg-teal-400" : "bg-purple-600"
                        }`}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {bucket.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        46%
                      </div>
                      <div className="text-xs text-gray-500">
                        {bucket.stocks.length} Stocks
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddStocksModal
        isOpen={showAddStocksModal}
        onClose={() => setShowAddStocksModal(false)}
        onAddStocks={(stocks) => {
          console.log("Adding stocks:", stocks);
          setShowAddStocksModal(false);
        }}
      />
    </div>
  );
};

export default BucketsTab;
