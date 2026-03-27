import { memo } from "react";
import { motion } from "framer-motion";
import { roleConfig } from "../constants/roleConfig";
import { getInitials } from "../utils/formatters";
import { GoogleIcon, QualitestIcon } from "./OrgIcons";

const PersonNodeComponent = ({ person, delay, isCollapsed }) => {
  const roles = person.role
    ? person.role
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean)
    : [];

  const org = person.org || "";

  // Get border style based on organization
  const getOrgBorderStyle = () => {
    const baseSize = isCollapsed ? "w-9 h-9" : "w-12 h-12";

    if (org === "Google") {
      // Google: gradient with Google colors (red, yellow, blue, green)
      return {
        borderColor: "transparent",
        background:
          "conic-gradient(#EA4335, #FBBC04, #4285F4, #34A853, #EA4335)",
        boxShadow:
          "0 0 15px rgba(234, 67, 53, 0.4), 0 0 25px rgba(66, 133, 244, 0.3)",
      };
    } else if (org === "Qualitest") {
      // Qualitest: solid purple with enhanced visibility
      return {
        borderColor: "#7c3aed",
        background: "none",
        boxShadow:
          "0 0 4px rgba(124, 58, 237, 0.8), 0 0 8px rgba(124, 58, 237, 0.6), inset 0 0 8px rgba(124, 58, 237, 0.5)",
      };
    } else {
      // Default: grey
      return {
        borderColor: "#475569",
        background: "none",
        boxShadow:
          "0 0 10px rgba(71, 85, 105, 0.3), inset 0 0 6px rgba(71, 85, 105, 0.2)",
      };
    }
  };

  const orgBorderStyle = getOrgBorderStyle();

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
          {/* Org icon in top-right corner */}
          {org && (
            <div className="absolute -top-1 -right-1 z-20 bg-[#161624] rounded-full p-0.5 border border-[#2f2f4d]">
              {org === "Google" ? (
                <GoogleIcon size={isCollapsed ? 10 : 12} />
              ) : org === "Qualitest" ? (
                <QualitestIcon size={isCollapsed ? 10 : 12} />
              ) : null}
            </div>
          )}

          {/* Org-based border ring */}
          <div
            className="relative w-full h-full rounded-full p-[2px] z-10"
            style={{
              ...orgBorderStyle,
              border:
                org === "Google"
                  ? "2px solid transparent"
                  : org === "Qualitest"
                    ? `3px solid ${orgBorderStyle.borderColor}`
                    : `2px solid ${orgBorderStyle.borderColor}`,
              backgroundClip: org === "Google" ? "padding-box" : "auto",
            }}
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
