import { X } from "lucide-react";

const RebalanceModal = ({ isOpen, onClose, onConfirm, type = "confirm" }) => {
  if (!isOpen) return null;

  const modalContent = {
    confirm: {
      title: "Rebalance Confirmation",
      message:
        "To activate the rebalanced portfolio. Please confirm that all the 6 required tasks are completed",
      confirmText: "Activate",
      cancelText: "Cancel",
    },
    plan: {
      title: "Rebalance Portfolio",
      message:
        "This will create a plan to rebalance portfolio. Please confirm to proceed",
      confirmText: "Rebalance",
      cancelText: "Cancel",
    },
    activate: {
      title: "Activate Portfolio",
      message: "Would you like to save changes and activate this portfolio?",
      confirmText: "Set as Active",
      cancelText: "Cancel",
    },
  };

  const content = modalContent[type] || modalContent.confirm;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {content.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">{content.message}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            {content.cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
          >
            {content.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RebalanceModal;
