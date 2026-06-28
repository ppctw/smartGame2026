import React from "react";
import { CellType } from "@/types/game";

interface EventModalProps {
  show: boolean;
  message: string;
  eventType: CellType | null;
  onClose: () => void;
}

const getEventIcon = (type: CellType | null): string => {
  switch (type) {
    case "boost":
      return "⚡";
    case "supply_pack":
      return "🎁";
    case "surprise":
      return "❓";
    case "obstacle":
      return "⚠️";
    case "trap":
      return "🚧";
    case "quiz":
      return "❓";
    case "rest":
      return "🔧";
    case "station":
      return "🚉";
    case "goto":
      return "🔄";
    case "end":
      return "🎉";
    default:
      return "ℹ️";
  }
};

const getEventColor = (type: CellType | null): string => {
  switch (type) {
    case "boost":
      return "bg-yellow-400";
    case "supply_pack":
      return "bg-purple-400";
    case "surprise":
      return "bg-pink-400";
    case "obstacle":
      return "bg-red-400";
    case "trap":
      return "bg-red-400";
    case "quiz":
      return "bg-purple-400";
    case "rest":
      return "bg-orange-400";
    case "station":
      return "bg-blue-400";
    case "end":
      return "bg-green-400";
    default:
      return "bg-gray-400";
  }
};

export const EventModal: React.FC<EventModalProps> = ({
  show,
  message,
  eventType,
  onClose,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full mx-4 transform animate-scaleIn">
        <div className="text-center">
          <div
            className={`
              w-32 h-32 mx-auto rounded-full ${getEventColor(eventType)}
              flex items-center justify-center text-7xl mb-6
              animate-bounce
            `}
          >
            {getEventIcon(eventType)}
          </div>

          <div className="text-3xl font-bold mb-6 text-gray-800 whitespace-pre-line leading-relaxed">
            {message}
          </div>

          <button
            onClick={onClose}
            className="
              px-12 py-4 bg-train-blue text-white rounded-xl
              font-bold text-2xl hover:bg-train-orange
              transition-all duration-200 hover:scale-105
              shadow-lg
            "
          >
            確認
          </button>
        </div>
      </div>
    </div>
  );
};
