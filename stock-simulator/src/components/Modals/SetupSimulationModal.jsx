import { useState } from "react";
import { X } from "lucide-react";

const SetupSimulationModal = ({ isOpen, onClose, onConfirm }) => {
  const [startDate, setStartDate] = useState("");
  const [competitors, setCompetitors] = useState(["Alpha", "NIFTY50", "MF"]);

  if (!isOpen) return null;

  const handleRemoveCompetitor = (comp) => {
    setCompetitors(competitors.filter((c) => c !== comp));
  };

  const handleConfirm = () => {
    onConfirm({ startDate, competitors });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Setup Simulation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Date
            </label>
            <div className="relative">
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="mm/dd/yy"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="radio"
                id="startDate"
                name="dateOption"
                defaultChecked
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="startDate" className="text-sm text-gray-600">
                Pick a start date for Simulation
              </label>
            </div>
          </div>

          {/* Trend Competitors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select trend competitors
            </label>
            <div className="flex flex-wrap gap-2">
              {competitors.map((comp) => (
                <span
                  key={comp}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  {comp}
                  <button
                    onClick={() => handleRemoveCompetitor(comp)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupSimulationModal;
