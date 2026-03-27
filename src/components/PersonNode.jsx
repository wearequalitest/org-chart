import { memo } from "react";
import { motion } from "framer-motion";
import { roleConfig } from "../constants/roleConfig";
import { getInitials } from "../utils/formatters";

const PersonNodeComponent = ({ person, delay, isCollapsed }) => {
  const roles = person.role
    ? person.role
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean)
    : [];

  const getGradientStyle = (rolesList) => {
    const colors = {
      "Senior PGM": "#3b82f6",
      "Account Manager": "#eab308",
      "Delivery Manager": "#10b981",
      DEFAULT: "#475569",
    };
    if (!rolesList || rolesList.length === 0)
      return { background: colors.DEFAULT };
    if (rolesList.length === 1)
      return { background: colors[rolesList[0]] || colors.DEFAULT };
    if (rolesList.length === 2)
      return {
        background: `linear-gradient(135deg, ${colors[rolesList[0]] || colors.DEFAULT}, ${colors[rolesList[1]] || colors.DEFAULT})`,
      };
    return {
      background: `linear-gradient(135deg, ${colors[rolesList[0]] || colors.DEFAULT}, ${colors[rolesList[1]] || colors.DEFAULT}, ${colors[rolesList[2]] || colors.DEFAULT})`,
    };
  };

  const borderStyle = getGradientStyle(roles);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="flex flex-col flex-1 min-w-0 z-10"
    >
      <div className="flex flex-col items-center justify-start p-1 flex-1 min-w-0 cursor-pointer hover:-translate-y-1.5 hover:scale-105 transition-all duration-150 ease-out">
        <div
          className={`relative shrink-0 flex items-center justify-center transition-all duration-300 ${
            isCollapsed ? "w-9 h-9 mb-1" : "w-12 h-12 mb-1.5"
          }`}
        >
          <div
            className="absolute inset-0 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-150 blur-md"
            style={borderStyle}
          ></div>
          <div
            className="relative w-full h-full rounded-full p-[2px] shadow-[0_2px_10px_rgba(0,0,0,0.5)] z-10"
            style={borderStyle}
          >
            <div
              className={`relative w-full h-full rounded-full bg-[#161624] flex items-center justify-center font-bold text-slate-200 transition-colors duration-150 group-hover/row:bg-[#1c1c2e] ${
                isCollapsed ? "text-[9px]" : "text-[11px]"
              }`}
            >
              {getInitials(person.name)}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full mt-1">
          <span
            className={`font-semibold text-slate-200 text-center leading-tight whitespace-normal break-words w-full group-hover/row:bg-clip-text group-hover/row:text-transparent group-hover/row:bg-gradient-to-r group-hover/row:from-accent group-hover/row:to-indigo-400 transition-all duration-150 ${
              isCollapsed ? "text-[9px]" : "text-[11px]"
            }`}
          >
            {person.name}
          </span>

          {roles.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mt-1 w-full pointer-events-none">
              {roles.map((r, i) => {
                const rc = roleConfig[r] || roleConfig["DEFAULT"];
                return (
                  <span
                    key={i}
                    className={`flex items-center justify-center font-orbitron font-bold tracking-wider leading-none py-[3px] border rounded ${rc.shadow} transition-all duration-150 ${rc.bg} ${rc.border} ${rc.color} group-hover/row:brightness-125 ${
                      isCollapsed ? "text-[7px] px-1" : "text-[8px] px-1.5"
                    }`}
                  >
                    {rc.short}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const PersonNode = memo(PersonNodeComponent);
