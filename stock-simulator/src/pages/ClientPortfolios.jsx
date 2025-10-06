import { useState } from "react";
import { ChevronLeft, Plus, MoreVertical, Sparkles } from "lucide-react";
import Sidebar from "../components/Sidebar";

const ClientPortfolios = ({
  client,
  onBack,
  onCreatePortfolio,
  onSelectPortfolio,
}) => {
  const [activeTab, setActiveTab] = useState("active");

  const portfolios = [
    {
      id: 1,
      name: "Aditya's Portfolio",
      market: "BSE",
      risk: "Medium",
      status: "active",
      includes: "5 sectors",
      excludes: "3 sectors & 2 stocks",
      lastRebalance: "5th dec 2024",
      canPlanRebalance: true,
    },
  ];

  const filteredPortfolios = portfolios.filter((p) => p.status === activeTab);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="clients" />

      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {client?.name || "Aditya H"}
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-gray-200">
            {["Planning", "Active", "Archive"].map((tab) => (
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

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Portfolio Cards */}
            {filteredPortfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                onClick={() => onSelectPortfolio(portfolio)}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-green-600">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                      <span className="text-sm font-medium capitalize">
                        {portfolio.status}
                      </span>
                    </div>
                    {portfolio.canPlanRebalance && (
                      <button className="text-blue-700 text-sm font-medium flex items-center gap-1 hover:underline">
                        <Sparkles className="w-4 h-4" />
                        Plan Rebalancing
                      </button>
                    )}
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {portfolio.name}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <img
                      src="https://flagcdn.com/w20/in.png"
                      alt="India"
                      className="w-4 h-3"
                    />
                    {portfolio.market}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-600">Risk</span>
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                    {portfolio.risk}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Includes:</span>{" "}
                    {portfolio.includes}
                  </div>
                  <div>
                    <span className="font-medium">Excludes:</span>{" "}
                    {portfolio.excludes}
                  </div>
                </div>

                {portfolio.lastRebalance && (
                  <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                    Last rebalance on: {portfolio.lastRebalance}
                  </div>
                )}
              </div>
            ))}

            {/* Create New Portfolio Card */}
            <button
              onClick={onCreatePortfolio}
              className="bg-blue-50 rounded-lg border-2 border-dashed border-blue-300 p-6 hover:bg-blue-100 transition-colors flex flex-col items-center justify-center gap-4 min-h-[300px]"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-blue-700" />
              </div>
              <span className="text-blue-700 font-semibold text-lg">
                Create New Portfolio
              </span>
            </button>
          </div>

          {/* User Info Sidebar */}
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                D
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Aditya H</h3>
                <button className="text-sm text-blue-700 hover:underline">
                  Edit account photo
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Personal Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Username</span>
                    <p className="text-gray-900">@pg</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email Address</span>
                    <p className="text-gray-900">hellodesign@gmail.com</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Password</span>
                    <p className="text-gray-900">
                      You signed up via Google, so you don't have a password.
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone Number</span>
                    <p className="text-gray-900">+91 98675 78444</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Personal Address
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Country</span>
                    <p className="text-gray-900">India</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Address</span>
                    <p className="text-gray-900">
                      SCO-45, Phase-1, Sector 55
                      <br />
                      Sahibzada Ajit Singh Nagar
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortfolios;
