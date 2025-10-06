import { Users, Settings, Bell } from "lucide-react";
import Logo from "./Logo";

const Sidebar = ({ activeItem = "clients", onNavigate, user }) => {
  const menuItems = [
    { id: "clients", icon: Users, label: "Clients" },
    { id: "settings", icon: Settings, label: "Settings" },
    { id: "notification", icon: Bell, label: "Notification", badge: 3 },
  ];

  return (
    <div className="w-64 h-screen bg-gray-100 flex flex-col fixed left-0 top-0 border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Logo />
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate && onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors relative ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="absolute right-3 top-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      {user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {user.initials || "CK"}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800 text-sm">
                {user.name || "Cooper Kristin"}
              </div>
              <div className="text-xs text-gray-500">
                {user.role || "Admin"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
