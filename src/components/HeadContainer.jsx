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
import { roleConfig } from "../constants/roleConfig";

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
      <div
        className="flex flex-col flex-1 w-full glass-card rounded-2xl relative hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(99,102,241,0.4)] transition-all duration-500 overflow-hidden"
        style={{ borderColor: "rgba(74, 79, 105, 0.5)" }}
      >
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
            // Determine the primary role in this level for bg coloring
            const levelRoles =
              level
                ?.flatMap((person) =>
                  person.role
                    ? person.role.split(",").map((r) => r.trim())
                    : [],
                )
                .filter(Boolean) || [];
            const primaryRole = levelRoles[0];
            const rc = primaryRole
              ? roleConfig[primaryRole] || roleConfig["DEFAULT"]
              : roleConfig["DEFAULT"];

            // Use Google colors with glass effect borders
            const roleColorMap = {
              "Senior PGM": {
                bg: "rgba(234, 67, 53, 0.02)",
                shadow: "-6px 0 12px -4px rgba(234, 67, 53, 0.6)",
                borderColor: "rgba(234, 67, 53, 0.7)",
              },
              "Account Manager": {
                bg: "rgba(251, 188, 4, 0.02)",
                shadow: "-6px 0 12px -4px rgba(251, 188, 4, 0.6)",
                borderColor: "rgba(251, 188, 4, 0.7)",
              },
              "Delivery Manager": {
                bg: "rgba(52, 168, 83, 0.02)",
                shadow: "-6px 0 12px -4px rgba(52, 168, 83, 0.6)",
                borderColor: "rgba(52, 168, 83, 0.7)",
              },
            };
            const rowStyle = roleColorMap[primaryRole] || {
              bg: "rgba(71, 85, 105, 0.01)",
              shadow:
                "inset 0 0 30px rgba(71, 85, 105, 0.08), -8px 0 20px rgba(71, 85, 105, 0.2)",
              borderColor: "rgba(71, 85, 105, 0.4)",
            };

            return (
              <div
                key={idx}
                className={`relative flex justify-around items-start w-full group/row transition-all duration-300 border-l-4 ${
                  isCollapsed
                    ? "min-h-[70px] pt-3 pb-2"
                    : "min-h-[90px] pt-4 pb-3"
                }`}
                style={{
                  background: rowStyle.bg,
                  boxShadow: rowStyle.shadow,
                  borderLeftColor: rowStyle.borderColor,
                }}
              >
                {/* Enhanced row highlight with stronger effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 z-0 pointer-events-none rounded-sm"
                  style={{
                    background:
                      primaryRole === "Senior PGM"
                        ? "rgba(234, 67, 53, 0.20)"
                        : primaryRole === "Account Manager"
                          ? "rgba(251, 188, 4, 0.20)"
                          : primaryRole === "Delivery Manager"
                            ? "rgba(52, 168, 83, 0.20)"
                            : "rgba(71, 85, 105, 0.10)",
                    backdropFilter: "blur(3px)",
                  }}
                ></div>
                <div className="relative z-10 flex w-full justify-around items-start">
                  {(level || []).map((person, pIdx) => (
                    <PersonNode
                      key={pIdx}
                      person={person}
                      delay={delay + 0.3 + idx * 0.1}
                      isCollapsed={isCollapsed}
                    />
                  ))}
                </div>
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
            <div className="flex items-center gap-1.5" title="Total Revenue">
              <span
                className={`font-bold text-emerald-400 leading-none transition-all ${
                  isCollapsed ? "text-xs" : "text-base"
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
