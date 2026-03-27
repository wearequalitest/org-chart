import { memo } from "react";
import { motion } from "framer-motion";
import { getInitials } from "../utils/formatters";

const HeadAvatarNodeComponent = ({ head, isCollapsed, delay }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, type: "spring", stiffness: 150, damping: 15 }}
    className="z-20 relative"
  >
    <div className="flex flex-col items-center justify-center cursor-pointer hover:-translate-y-1.5 hover:scale-105 transition-all duration-150 ease-out group">
      <div
        className={`relative transition-all duration-300 ${
          isCollapsed ? "w-12 h-12 mb-1" : "w-16 h-16 mb-3"
        }`}
      >
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary to-accent opacity-50 animate-spin-slow group-hover:opacity-100 blur-[2px] transition-opacity duration-150"></div>
        <div
          className={`relative w-full h-full rounded-full bg-[#161624] border-2 border-[#1c1c2e] flex items-center justify-center font-bold text-white z-10 shadow-[inset_0_4px_10px_rgba(255,255,255,0.1)] ${
            isCollapsed ? "text-[14px]" : "text-[18px]"
          }`}
        >
          {getInitials(head.headName)}
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
