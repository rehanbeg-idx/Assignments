import { useState } from "react";
import Login from "./pages/Login";
import ClientList from "./pages/ClientList";
import ClientPortfolios from "./pages/ClientPortfolios";
import CreatePortfolioFlow from "./pages/CreatePortfolioFlow";
import PortfolioSummary from "./pages/PortfolioSummary";
import BucketsTab from "./pages/tabs/BucketsTab";
import SimulatorTab from "./pages/tabs/SimulatorTab";

function App() {
  const [currentView, setCurrentView] = useState("login");
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  const handleLogin = (email) => {
    console.log("Logged in:", email);
    setCurrentView("clientList");
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setCurrentView("clientPortfolios");
  };

  const handleCreatePortfolio = () => {
    setCurrentView("createPortfolio");
  };

  const handlePortfolioCreated = (portfolioData) => {
    console.log("Portfolio created:", portfolioData);
    const newPortfolio = {
      id: Date.now(),
      name: portfolioData.name || "New Portfolio",
      ...portfolioData,
    };
    setSelectedPortfolio(newPortfolio);
    setCurrentView("buckets");
  };

  const handleSelectPortfolio = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setCurrentView("portfolioSummary");
  };

  const handleRebalance = () => {
    setCurrentView("buckets");
  };

  const handleBackToClients = () => {
    setSelectedClient(null);
    setSelectedPortfolio(null);
    setCurrentView("clientList");
  };

  const handleBackToPortfolios = () => {
    setSelectedPortfolio(null);
    setCurrentView("clientPortfolios");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "login" && <Login onLogin={handleLogin} />}

      {currentView === "clientList" && (
        <ClientList onClientSelect={handleClientSelect} />
      )}

      {currentView === "clientPortfolios" && (
        <ClientPortfolios
          client={selectedClient}
          onBack={handleBackToClients}
          onCreatePortfolio={handleCreatePortfolio}
          onSelectPortfolio={handleSelectPortfolio}
        />
      )}

      {currentView === "createPortfolio" && (
        <CreatePortfolioFlow
          client={selectedClient}
          onBack={handleBackToPortfolios}
          onComplete={handlePortfolioCreated}
        />
      )}

      {currentView === "portfolioSummary" && (
        <PortfolioSummary
          portfolio={selectedPortfolio}
          onBack={handleBackToPortfolios}
          onRebalance={handleRebalance}
        />
      )}

      {currentView === "buckets" && (
        <BucketsTab
          portfolio={selectedPortfolio}
          onBack={() => setCurrentView("portfolioSummary")}
        />
      )}

      {currentView === "simulator" && (
        <SimulatorTab
          portfolio={selectedPortfolio}
          onBack={() => setCurrentView("portfolioSummary")}
        />
      )}
    </div>
  );
}

export default App;
