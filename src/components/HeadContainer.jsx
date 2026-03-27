import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { PersonNode } from "./PersonNode";
import { ProjectCard } from "./ProjectCard";
import {
  IconLayers,
  IconMaximize,
  IconMinimize,
  IconUsers,
  IconActivity,
} from "../utils/icons";
import {
  calculateTotalRevenue,
  calculateTotalHeadcount,
  formatShortCurrency,
} from "../utils/formatters";

const HeadContainerComponent = ({
  container,
  delay,
  isCollapsed,
  onToggle,
}) => {
  const totalRev = useMemo(
    () => calculateTotalRevenue(container.projects || []),
    [container.projects],
  );
  const totalHc = useMemo(
    () => calculateTotalHeadcount(container.projects || []),
    [container.projects],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.6, ease: "easeOut" }}
      className="flex flex-col flex-1 w-full h-full"
    >
      <div className="flex flex-col flex-1 w-full bg-[#161624]/60 backdrop-blur-[10px] border border-indigo-500/20 rounded-xl shadow-[0_4px_25px_rgba(99,102,241,0.15)] relative hover:-translate-y-2 hover:border-indigo-400/60 hover:shadow-[0_15px_50px_rgba(99,102,241,0.4)] transition-all duration-500 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>

        {/* INDIVIDUAL TOGGLE HEADER - FIXED TRUNCATION */}
        {container.name && (
          <div
            className={`flex items-center justify-between bg-gradient-to-r from-header/90 via-[#2a2a40] to-header/90 border-b border-border z-20 shrink-0 transition-all duration-300 hover:bg-white/5 ${
              isCollapsed ? "h-[32px] pl-2 pr-1.5" : "h-[40px] pl-3 pr-2"
            }`}
          >
            <div className="flex items-center gap-2 overflow-hidden pr-2">
              {!isCollapsed && (
                <span className="text-indigo-400 shrink-0">
                  <IconLayers />
                </span>
              )}
              <span
                className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 tracking-widest uppercase whitespace-nowrap ${
                  isCollapsed ? "text-[9px]" : "text-[11px]"
                }`}
              >
                {container.name}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              title={isCollapsed ? "Expand Container" : "Collapse Container"}
              className={`flex items-center justify-center shrink-0 rounded bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/30 hover:border-indigo-400 text-indigo-300 hover:text-white transition-all shadow-[0_0_8px_rgba(99,102,241,0.2)] cursor-pointer ${
                isCollapsed ? "w-5 h-5" : "w-6 h-6"
              }`}
            >
              {isCollapsed ? (
                <IconMaximize size={isCollapsed ? "10" : "12"} />
              ) : (
                <IconMinimize size={isCollapsed ? "10" : "12"} />
              )}
            </button>
          </div>
        )}

        <div className="flex flex-col w-full border-b border-border/50 relative z-10">
          {(container.levels || []).map((level, idx) => {
            return (
              <div
                key={idx}
                className={`relative flex justify-around items-start w-full border-b border-b-red-500/10 bg-red-500/[0.015] hover:bg-red-500/[0.03] group/row transition-all duration-300 ${
                  isCollapsed
                    ? "min-h-[70px] pt-3 pb-2"
                    : "min-h-[90px] pt-4 pb-3"
                }`}
              >
                {(level || []).map((person, pIdx) => (
                  <PersonNode
                    key={pIdx}
                    person={person}
                    delay={delay + 0.3 + idx * 0.1}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            );
          })}
        </div>

        {/* Collapsible Projects Section */}
        <motion.div
          initial={false}
          animate={{
            height: isCollapsed ? 0 : "auto",
            opacity: isCollapsed ? 0 : 1,
            padding: isCollapsed ? 0 : 12,
          }}
          className="bg-gradient-to-b from-transparent to-panel/30 flex flex-col relative z-10 overflow-hidden shrink-0"
        >
          <div className="text-[9px] uppercase text-slate-500 mb-2 tracking-widest font-bold pl-1 flex items-center gap-1.5">
            <IconActivity /> Active Projects
          </div>
          {(container.projects || []).map((proj, idx) => (
            <ProjectCard
              key={idx}
              project={proj}
              delay={delay + 0.5 + idx * 0.15}
            />
          ))}
        </motion.div>

        {/* Footer - FIXED TEXT WRAPPING */}
        <div
          className={`bg-[#1c1c2e] border-t border-border flex justify-between items-center mt-auto relative z-10 shrink-0 transition-all duration-300 ${
            isCollapsed ? "p-2" : "p-3"
          }`}
        >
          <div className="flex flex-col justify-center min-w-0">
            {!isCollapsed && (
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mb-0.5 whitespace-nowrap">
                Headcount
              </span>
            )}
            <div className="flex items-center gap-1.5" title="Headcount">
              <span className="text-indigo-400 shrink-0">
                <IconUsers />
              </span>
              <span
                className={`font-bold text-slate-200 transition-all ${
                  isCollapsed ? "text-xs" : "text-base"
                }`}
              >
                {totalHc}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end justify-center min-w-0">
            {!isCollapsed && (
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mb-0.5 whitespace-nowrap">
                Total Revenue
              </span>
            )}
            <div
              className={`flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded shadow-[inset_0_0_8px_rgba(16,185,129,0.1)] transition-all ${
                isCollapsed ? "px-1.5 py-0.5" : "px-2 py-0.5"
              }`}
              title="Total Revenue"
            >
              <span
                className={`font-bold font-mono text-emerald-400 leading-none transition-all ${
                  isCollapsed ? "text-[11px]" : "text-[14px]"
                }`}
              >
                {formatShortCurrency(totalRev)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const HeadContainer = memo(HeadContainerComponent);
