import { useState } from 'react';
import { ChevronLeft, Download, X, Clock, TrendingUp } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import RebalanceModal from '../components/Modals/RebalanceModal';

const PortfolioSummary = ({ portfolio, onBack, onRebalance }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [showInsights, setShowInsights] = useState(false);
  const [activeInsightTab, setActiveInsightTab] = useState('insights');
  const [showRebalanceModal, setShowRebalanceModal] = useState(false);

  const chartData = {
    portfolioValue: '27.3%',
    amount: '$5.39M',
    buckets: [
      { name: 'Your Portfolio', percentage: '27.3%', amount: '$5.39M', color: 'bg-blue-600' },
      { name: 'Mutual Fund', percentage: '27.3%', amount: '$5.39M', color: 'bg-purple-600' },
      { name: 'Nifty50', percentage: '27.3%', amount: '$5.39M', color: 'bg-teal-400' },
      { name: 'Finance Bucket', percentage: '20%', amount: '$5.39M', color: 'bg-purple-400' },
      { name: 'Tech Bucket', percentage: '27.3%', amount: '$5.39M', color: 'bg-pink-500' }
    ]
  };

  const insights = [
    {
      company: 'NFLX',
      name: 'Netflix, Inc',
      text: 'Netflix is predicted to increase by 5% over the next 30 days based on current market trends and sentiment analysis.',
      date: '15 Sept, 2021',
      time: '7:53p.m.'
    },
    {
      company: 'AAPL',
      name: 'Apple, Inc',
      text: 'Apple has shown higher-than-average volatility in the past week. Consider reviewing your risk exposure.',
      date: '15 Sept, 2021',
      time: '7:53p.m.'
    },
    {
      text: 'Your portfolio\'s risk/reward ratio is currently 1.5:1. Consider rebalancing to improve risk-adjusted returns.',
      date: '15 Sept, 2021',
      time: '7:53p.m.'
    },
    {
      text: 'Your portfolio is underperforming by 3% compared to the benchmark index. Consider reviewing your stock allocation',
      date: '15 Sept, 2021',
      time: '7:53p.m.'
    },
    {
      text: 'Your portfolio\'s exposure to small-cap stocks exceeds your moderate risk tolerance. Consider adjusting to reduce risk',
      date: '15 Sept, 2021',
      time: '7:53p.m.'
    }
  ];

  const historyItems = [
    { title: 'Rebalance 4', subtitle: 'Last Edited: Now' },
    { title: 'Rebalance 3', subtitle: 'Last Edited: 15 Sept, 2021 | 7:53p.m.' },
    { title: 'Rebalance 2', subtitle: 'Last Edited: 15 Sept, 2021 | 7:53p.m.' },
    { title: 'Rebalance 1', subtitle: 'Last Edited: 15 Sept, 2021 | 7:53p.m.' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="clients" />

      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{portfolio?.name || "Aditya's Portfolio"}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-4 h-3" />
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
            {['Summary', 'Buckets', 'Simulator', 'Rebalance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? 'text-blue-700 border-b-2 border-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="grid grid-cols-3 gap-6">
            {/* Main Chart Area */}
            <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Nov 22 - Today</h3>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export as CSV
                </button>
              </div>

              {/* Date Range */}
              <div className="flex items-center gap-2 mb-4">
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  7 Oct,2024 - 14 Oct 2024
                </button>
              </div>

              {/* Filter Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">Trends</button>
                <button className="px-3 py-1 bg-blue-50 border border-blue-300 rounded-full text-sm font-medium text-blue-700 flex items-center gap-1">
                  Alpha <X className="w-3 h-3" />
                </button>
                <button className="px-3 py-1 bg-blue-50 border border-blue-300 rounded-full text-sm font-medium text-blue-700 flex items-center gap-1">
                  NIFTY50 <X className="w-3 h-3" />
                </button>
                <button className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">Betc</button>
                <button className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">Buckets</button>
                <button className="px-3 py-1 bg-blue-50 border border-blue-300 rounded-full text-sm font-medium text-blue-700 flex items-center gap-1">
                  Finance Bucket <X className="w-3 h-3" />
                </button>
                <button className="px-3 py-1 bg-blue-50 border border-blue-300 rounded-full text-sm font-medium text-blue-700 flex items-center gap-1">
                  Tech Bucket <X className="w-3 h-3" />
                </button>
              </div>

              {/* Chart Placeholder */}
              <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 gap-px">
                  {Array.from({ length: 96 }).map((_, i) => (
                    <div key={i} className="bg-gray-200 opacity-20"></div>
                  ))}
                </div>
                <div className="relative text-gray-400">Performance Chart Area</div>
              </div>

              {/* Stats Info Box */}
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

              {/* Legend */}
              <div className="mt-6 flex flex-wrap gap-4">
                {chartData.buckets.map((bucket, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded ${bucket.color}`}></div>
                    <span className="text-gray-700 font-medium">{bucket.name}</span>
                    <span className="text-gray-600">{bucket.percentage}</span>
                    <span className="text-gray-900 font-semibold">{bucket.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights Sidebar */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveInsightTab('insights')}
                  className={`flex-1 py-3 font-medium transition-colors ${
                    activeInsightTab === 'insights'
                      ? 'text-blue-700 border-b-2 border-blue-700'
                      : 'text-gray-600'
                  }`}
                >
                  Insights
                </button>
                <button
                  onClick={() => setActiveInsightTab('history')}
                  className={`flex-1 py-3 font-medium transition-colors ${
                    activeInsightTab === 'history'
                      ? 'text-blue-700 border-b-2 border-blue-700'
                      : 'text-gray-600'
                  }`}
                >
                  History
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {activeInsightTab === 'insights' ? (
                  <div className="space-y-4">
                    {insights.map((insight, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                        {insight.company && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold text-xs">
                              {insight.company[0]}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{insight.company}</div>
                              <div className="text-xs text-gray-500">{insight.name}</div>
                            </div>
                          </div>
                        )}
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">{insight.text}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>Dated: {insight.date} | {insight.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {historyItems.map((item, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
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

              {showInsights && (
                <button
                  onClick={() => setShowInsights(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <RebalanceModal
        isOpen={showRebalanceModal}
        onClose={() => setShowRebalanceModal(false)}
        onConfirm={() => {
          onRebalance();
          setShowRebalanceModal(false);
        }}
        type="plan"
      />
    </div>
  );
};

export default PortfolioSummary;