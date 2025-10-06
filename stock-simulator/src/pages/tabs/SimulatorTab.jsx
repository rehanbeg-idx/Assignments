import { useState } from "react";
import { ChevronLeft, Download, Settings } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import SetupSimulationModal from "../../components/Modals/SetupSimulationModal";

const SimulatorTab = ({ portfolio, onBack }) => {
  const [showSetupModal, setShowSetupModal] = useState(false);

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
                  tab === "Simulator"
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
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

            {/* Chart Placeholder - Empty State */}
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

            {/* Legend Area (shown when data exists) */}
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
        </div>
      </div>

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

export default SimulatorTab;
