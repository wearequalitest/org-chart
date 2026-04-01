import { memo } from "react";
import { motion } from "framer-motion";
import { getInitials } from "../utils/formatters";
import { GoogleIcon } from "./OrgIcons";

const HeadAvatarNodeComponent = ({
  head,
  isCollapsed,
  delay,
  onToggleContainers,
}) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, type: "spring", stiffness: 150, damping: 15 }}
    className="z-20 relative"
  >
    <div
      className="flex flex-col items-center justify-center cursor-pointer hover:-translate-y-1.5 hover:scale-105 transition-all duration-150 ease-out group animate-pulse-subtle"
      onClick={onToggleContainers}
    >
      <div
        className={`relative transition-all duration-300 ${
          isCollapsed ? "w-12 h-12 mb-1" : "w-16 h-16 mb-3"
        }`}
      >
        {/* Google gradient border ring */}
        <div
          className="absolute -inset-1 rounded-full opacity-75 group-hover:opacity-100 blur-sm transition-opacity duration-150 z-0"
          style={{
            background:
              "conic-gradient(#EA4335, #FBBC04, #4285F4, #34A853, #EA4335)",
            boxShadow:
              "0 0 20px rgba(234, 67, 53, 0.5), 0 0 30px rgba(66, 133, 244, 0.4)",
          }}
        ></div>

        <div
          className={`relative w-full h-full rounded-full bg-[#161624] p-1 flex items-center justify-center font-bold text-white z-10 ${
            isCollapsed ? "text-[14px]" : "text-[18px]"
          }`}
          style={{
            background:
              "conic-gradient(#EA4335, #FBBC04, #4285F4, #34A853, #EA4335)",
            padding: "2px",
            boxShadow:
              "0 0 15px rgba(234, 67, 53, 0.4), 0 0 25px rgba(66, 133, 244, 0.3), inset 0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {/* Inner content circle */}
          <div className="w-full h-full rounded-full bg-[#161624] flex items-center justify-center">
            {/* Google icon in top-right corner */}
            <div className="absolute -top-0.5 -right-0.5 z-20 bg-[#161624] rounded-full p-0.5 border border-[#2f2f4d]">
              <GoogleIcon size={isCollapsed ? 12 : 14} />
            </div>
            {getInitials(head.headName)}
          </div>
        </div>
      </div>
      <h2
        className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 text-center leading-tight tracking-wide group-hover:from-accent group-hover:to-primary transition-all duration-300 ${
          isCollapsed ? "text-[11px]" : "text-[14px]"
        }`}
      >
        {head.headName}
      </h2>
    </div>
  </motion.div>
);

export const HeadAvatarNode = memo(HeadAvatarNodeComponent);
