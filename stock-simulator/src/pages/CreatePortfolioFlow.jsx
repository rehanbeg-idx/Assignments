import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Sidebar from "../components/Sidebar";

const CreatePortfolioFlow = ({ client, onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    country: "India",
    market: "BSE",
    maxStocks: "10",
    riskLevel: "medium",
    sectorsInclude: [],
    sectorsExclude: [],
    instrumentsInclude: [],
    instrumentsExclude: [],
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      onBack();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="clients" />

      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {client?.name || "Aditya Handu"}
            </h1>
          </div>

          {/* Modal */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 shadow-lg">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Create Portfolio
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Step {step} of 2 -{" "}
                {step === 1 ? "Add Details" : "Enter other details"}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {step === 1 ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add portfolio name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Enter here"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      placeholder="Text"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    />
                    <div className="text-xs text-gray-500 mt-1">0/200</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choose Country
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) =>
                          handleChange("country", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choose Market
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleChange("market", "BSE")}
                          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                            formData.market === "BSE"
                              ? "bg-blue-700 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          BSE
                        </button>
                        <button
                          onClick={() => handleChange("market", "NSE")}
                          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                            formData.market === "NSE"
                              ? "bg-blue-700 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          NSE
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum number of stocks in Bucket
                    </label>
                    <select
                      value={formData.maxStocks}
                      onChange={(e) =>
                        handleChange("maxStocks", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      {[5, 10, 15, 20, 25, 30].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Instruments of Investment to Include
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="To"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Sectors to Include
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="To"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Sectors to Exclude
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                        Tech
                      </span>
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                        Agro
                      </span>
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                        Mutual Funds
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Instruments of Investment to Exclude
                    </label>
                    <input
                      type="text"
                      placeholder="Enter here"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Instruments of Investment to Include
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="4"
                        value={
                          formData.riskLevel === "veryLow"
                            ? 0
                            : formData.riskLevel === "low"
                            ? 1
                            : formData.riskLevel === "medium"
                            ? 2
                            : formData.riskLevel === "high"
                            ? 3
                            : 4
                        }
                        onChange={(e) => {
                          const levels = [
                            "veryLow",
                            "low",
                            "medium",
                            "high",
                            "veryHigh",
                          ];
                          handleChange("riskLevel", levels[e.target.value]);
                        }}
                        className="w-full h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-600 mt-2">
                        <span>Very Low</span>
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                        <span>Very High</span>
                      </div>
                    </div>
                    <p className="text-sm text-red-600 mt-2">
                      <span className="font-semibold">Very High:</span> While
                      high-risk tolerance allows for aggressive investment
                      strategies, it's crucial to practice risk management by
                      maintaining diversification, staying informed about market
                      conditions, and periodically reassessing
                    </p>
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              <div className="flex gap-2 mt-6">
                <div
                  className={`flex-1 h-1 rounded-full ${
                    step >= 1 ? "bg-blue-700" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`flex-1 h-1 rounded-full ${
                    step >= 2 ? "bg-blue-700" : "bg-gray-200"
                  }`}
                ></div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleBack}
                className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                {step === 1 ? "Cancel" : "Back"}
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
              >
                {step === 1 ? "Next" : "Create Portfolio"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePortfolioFlow;
