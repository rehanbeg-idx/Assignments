import React, { useState } from "react";
import {
  ChevronLeft,
  Download,
  X,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Settings,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import AddStocksModal from "../components/Modals/AddStocksModal";
import SetupSimulationModal from "../components/Modals/SetupSimulationModal";
import RebalanceModal from "../components/Modals/RebalanceModal";

const PortfolioSummary = ({ portfolio, onBack, onRebalance }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [activeInsightTab, setActiveInsightTab] = useState("insights");
  const [showRebalanceModal, setShowRebalanceModal] = useState(false);
  const [showAddStocksModal, setShowAddStocksModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [expandedBuckets, setExpandedBuckets] = useState(["tech"]);

  const chartData = {
    portfolioValue: "27.3%",
    amount: "$5.39M",
    buckets: [
      {
        name: "Your Portfolio",
        percentage: "27.3%",
        amount: "$5.39M",
        color: "bg-blue-600",
      },
      {
        name: "Mutual Fund",
        percentage: "27.3%",
        amount: "$5.39M",
        color: "bg-purple-600",
      },
      {
        name: "Nifty50",
        percentage: "27.3%",
        amount: "$5.39M",
        color: "bg-teal-400",
      },
      {
        name: "Finance Bucket",
        percentage: "20%",
        amount: "$5.39M",
        color: "bg-purple-400",
      },
      {
        name: "Tech Bucket",
        percentage: "27.3%",
        amount: "$5.39M",
        color: "bg-pink-500",
      },
    ],
  };

  const insights = [
    {
      company: "NFLX",
      name: "Netflix, Inc",
      text: "Netflix is predicted to increase by 5% over the next 30 days based on current market trends and sentiment analysis.",
      date: "15 Sept, 2021",
      time: "7:53p.m.",
    },
    {
      company: "AAPL",
      name: "Apple, Inc",
      text: "Apple has shown higher-than-average volatility in the past week. Consider reviewing your risk exposure.",
      date: "15 Sept, 2021",
      time: "7:53p.m.",
    },
    {
      text: "Your portfolio's risk/reward ratio is currently 1.5:1. Consider rebalancing to improve risk-adjusted returns.",
      date: "15 Sept, 2021",
      time: "7:53p.m.",
    },
    {
      text: "Your portfolio is underperforming by 3% compared to the benchmark index. Consider reviewing your stock allocation",
      date: "15 Sept, 2021",
      time: "7:53p.m.",
    },
    {
      text: "Your portfolio's exposure to small-cap stocks exceeds your moderate risk tolerance. Consider adjusting to reduce risk",
      date: "15 Sept, 2021",
      time: "7:53p.m.",
    },
  ];

  const historyItems = [
    { title: "Rebalance 4", subtitle: "Last Edited: Now" },
    { title: "Rebalance 3", subtitle: "Last Edited: 15 Sept, 2021 | 7:53p.m." },
    { title: "Rebalance 2", subtitle: "Last Edited: 15 Sept, 2021 | 7:53p.m." },
    { title: "Rebalance 1", subtitle: "Last Edited: 15 Sept, 2021 | 7:53p.m." },
  ];

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
    setShowAddStocksModal(true);
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return (
          <div className="grid grid-cols-3 gap-6">
            {/* Main Chart Area */}
            <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Nov 22 - Today
                </h3>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export as CSV
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1">
                  <Clock className="w-4 h-4" />7 Oct,2024 - 14 Oct 2024
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <button className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                  Trends
                </button>
                <button className="px-3 py-1 bg-blue-50 border border-blue-300 rounded-full text-sm font-medium text-blue-700 flex items-center gap-1">
                  Alpha <X className="w-3 h-3" />
                </button>
                <button className="px-3 py-1 bg-blue-50 border border-blue-300 rounded-full text-sm font-medium text-blue-700 flex items-center gap-1">
                  NIFTY50 <X className="w-3 h-3" />
                </button>
                <button className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                  Betc
                </button>
                <button className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                  Buckets
                </button>
                <button className="px-3 py-1 bg-blue-50 border border-blue-300 rounded-full text-sm font-medium text-blue-700 flex items-center gap-1">
                  Finance Bucket <X className="w-3 h-3" />
                </button>
                <button className="px-3 py-1 bg-blue-50 border border-blue-300 rounded-full text-sm font-medium text-blue-700 flex items-center gap-1">
                  Tech Bucket <X className="w-3 h-3" />
                </button>
              </div>

              <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 gap-px">
                  {Array.from({ length: 96 }).map((_, i) => (
                    <div key={i} className="bg-gray-200 opacity-20"></div>
                  ))}
                </div>
                <div className="relative text-gray-400">
                  Performance Chart Area
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 mb-1">Alpha</div>
                    <div className="font-semibold text-gray-900">3.55%</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Beta</div>
                    <div className="font-semibold text-gray-900">1.06</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Sharpe Ratio</div>
                    <div className="font-semibold text-gray-900">0.52</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                {chartData.buckets.map((bucket, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded ${bucket.color}`}></div>
                    <span className="text-gray-700 font-medium">
                      {bucket.name}
                    </span>
                    <span className="text-gray-600">{bucket.percentage}</span>
                    <span className="text-gray-900 font-semibold">
                      {bucket.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights Sidebar */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveInsightTab("insights")}
                  className={`flex-1 py-3 font-medium transition-colors ${
                    activeInsightTab === "insights"
                      ? "text-blue-700 border-b-2 border-blue-700"
                      : "text-gray-600"
                  }`}
                >
                  Insights
                </button>
                <button
                  onClick={() => setActiveInsightTab("history")}
                  className={`flex-1 py-3 font-medium transition-colors ${
                    activeInsightTab === "history"
                      ? "text-blue-700 border-b-2 border-blue-700"
                      : "text-gray-600"
                  }`}
                >
                  History
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {activeInsightTab === "insights" ? (
                  <div className="space-y-4">
                    {insights.map((insight, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                        {insight.company && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold text-xs">
                              {insight.company[0]}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">
                                {insight.company}
                              </div>
                              <div className="text-xs text-gray-500">
                                {insight.name}
                              </div>
                            </div>
                          </div>
                        )}
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">
                          {insight.text}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>
                            Dated: {insight.date} | {insight.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {historyItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              idx === 0 ? "bg-blue-600" : "bg-gray-300"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 text-sm">
                              {item.title}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {item.subtitle}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "buckets":
        return (
          <div className="grid grid-cols-3 gap-6">
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
        );

      case "simulator":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Nov 22 - Today
              </h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export as CSV
                </button>
                <button
                  onClick={() => setShowSetupModal(true)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Setup Simulation
                </button>
              </div>
            </div>

            <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Simulation Data
                </h3>
                <p className="text-gray-500 mb-4">
                  Set up a simulation to visualize portfolio performance
                </p>
                <button
                  onClick={() => setShowSetupModal(true)}
                  className="px-6 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Setup Simulation
                </button>
              </div>
            </div>

            <div className="mt-6 opacity-30">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded bg-blue-600"></div>
                  <span className="text-gray-700 font-medium">
                    Your Portfolio
                  </span>
                  <span className="text-gray-600">27.3%</span>
                  <span className="text-gray-900 font-semibold">$5.39M</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded bg-purple-600"></div>
                  <span className="text-gray-700 font-medium">Mutual Fund</span>
                  <span className="text-gray-600">27.3%</span>
                  <span className="text-gray-900 font-semibold">$5.39M</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded bg-teal-400"></div>
                  <span className="text-gray-700 font-medium">Nifty50</span>
                  <span className="text-gray-600">27.3%</span>
                  <span className="text-gray-900 font-semibold">$5.39M</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded bg-purple-400"></div>
                  <span className="text-gray-700 font-medium">
                    Finance Bucket
                  </span>
                  <span className="text-gray-600">20%</span>
                  <span className="text-gray-900 font-semibold">$5.39M</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded bg-pink-500"></div>
                  <span className="text-gray-700 font-medium">Tech Bucket</span>
                  <span className="text-gray-600">27.3%</span>
                  <span className="text-gray-900 font-semibold">$5.39M</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "rebalance":
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Rebalance View
            </h3>
            <p className="text-gray-600">
              Rebalance functionality coming soon...
            </p>
          </div>
        );

      default:
        return null;
    }
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
              <span className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-green-600"></div>
                Active
              </span>
              <button
                onClick={() => setShowRebalanceModal(true)}
                className="px-6 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
              >
                Rebalance
              </button>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-gray-200">
            {["Summary", "Buckets", "Simulator", "Rebalance"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Render Tab Content */}
          {renderTabContent()}
        </div>
      </div>

      {/* Modals */}
      <RebalanceModal
        isOpen={showRebalanceModal}
        onClose={() => setShowRebalanceModal(false)}
        onConfirm={() => {
          onRebalance();
          setShowRebalanceModal(false);
        }}
        type="plan"
      />

      <AddStocksModal
        isOpen={showAddStocksModal}
        onClose={() => setShowAddStocksModal(false)}
        onAddStocks={(stocks) => {
          console.log("Adding stocks:", stocks);
          setShowAddStocksModal(false);
        }}
      />

      <SetupSimulationModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onConfirm={(data) => {
          console.log("Simulation setup:", data);
          setShowSetupModal(false);
        }}
      />
    </div>
  );
};
export default PortfolioSummary;
