import { useState } from "react";
import { Search, Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import AddClientModal from "../components/Modals/AddClientModal";

const ClientList = ({ onClientSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const clients = [
    {
      id: 1,
      name: "Neil Sims",
      email: "email@example.com",
      avatar: "NS",
      portfolios: 2,
    },
    {
      id: 2,
      name: "Bonnie Green",
      email: "email@example.com",
      avatar: "BG",
      portfolios: 2,
    },
    {
      id: 3,
      name: "Micheal Gough",
      email: "email@example.com",
      avatar: "MG",
      portfolios: 2,
    },
    {
      id: 4,
      name: "Aditya Handu",
      email: "email@example.com",
      avatar: "AH",
      portfolios: 0,
      canCreate: true,
    },
    {
      id: 5,
      name: "Lana Byrd",
      email: "email@example.com",
      avatar: "LB",
      portfolios: 2,
    },
    {
      id: 6,
      name: "Karen Nelson",
      email: "email@example.com",
      avatar: "KN",
      portfolios: 0,
      canCreate: true,
    },
    {
      id: 7,
      name: "Karen Nelson",
      email: "email@example.com",
      avatar: "KN",
      portfolios: 2,
    },
    {
      id: 8,
      name: "Karen Nelson",
      email: "email@example.com",
      avatar: "KN",
      portfolios: 2,
    },
    {
      id: 9,
      name: "Karen Nelson",
      email: "email@example.com",
      avatar: "KN",
      portfolios: 2,
    },
    {
      id: 10,
      name: "Karen Nelson",
      email: "email@example.com",
      avatar: "KN",
      portfolios: 2,
    },
  ];

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = (clientData) => {
    console.log("Adding client:", clientData);
    setShowAddModal(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="clients" />

      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search Client"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="ml-4 px-6 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Client
            </button>
          </div>

          {/* Client List */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Clients ({clients.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onClientSelect(client)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                      {client.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {client.name}
                      </h3>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {client.canCreate ? (
                      <button className="text-blue-700 font-medium hover:underline flex items-center gap-1">
                        <Plus className="w-4 h-4" />
                        Create Portfolio
                      </button>
                    ) : (
                      <span className="text-gray-600 font-medium">
                        {client.portfolios} Portfolios
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddClient}
      />
    </div>
  );
};

export default ClientList;
