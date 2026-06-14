import React from "react";

interface DiceRollerProps {
  diceValue: number | null;
  isRolling: boolean;
  onRoll: () => void;
  disabled?: boolean;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({
  diceValue,
  isRolling,
  onRoll,
  disabled,
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`
          w-32 h-32 rounded-2xl border-2 border-cyan-400/50
          flex items-center justify-center text-6xl font-bold
          ${isRolling ? "animate-dice-roll" : ""}
        `}
        style={{
          background: 'linear-gradient(135deg, #0c4a6e 0%, #075985 100%)',
          boxShadow: '0 0 30px rgba(34, 211, 238, 0.5), inset 0 0 30px rgba(34, 211, 238, 0.2)'
        }}
      >
        <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
          {isRolling ? "🎲" : diceValue || "🎲"}
        </span>
      </div>

      <button
        onClick={onRoll}
        disabled={disabled || isRolling}
        className={`
          px-8 py-4 rounded-xl font-bold text-xl border-2
          transition-all duration-200
          ${
            disabled || isRolling
              ? "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
              : "border-cyan-400 text-cyan-300 hover:scale-105"
          }
        `}
        style={
          disabled || isRolling
            ? {}
            : {
                background: 'linear-gradient(135deg, #0c4a6e 0%, #075985 100%)',
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)'
              }
        }
      >
        {isRolling ? "擲骰中..." : "擲骰子"}
      </button>
    </div>
  );
};
