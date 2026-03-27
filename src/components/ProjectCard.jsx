import { motion } from "framer-motion";
import { IconBriefcase, IconUser } from "../utils/icons";
import { formatShortCurrency } from "../utils/formatters";
import { getFlagClass } from "../constants/locationMap";
import { memo } from "react";

const ProjectCardComponent = ({ project, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -15 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, type: "spring", stiffness: 100 }}
    className="w-full mb-2"
  >
    <div className="shimmer-effect bg-gradient-to-br from-header/80 to-panel border border-border hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_4px_20px_rgba(99,102,241,0.2)] rounded-lg p-3 text-sm transition-all duration-150 ease-out cursor-pointer group">
      <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-2.5 relative z-10">
        <div className="flex items-center gap-1.5 overflow-hidden pr-2">
          <span className="text-indigo-400 group-hover:text-accent transition-colors">
            <IconBriefcase />
          </span>
          <div className="font-semibold text-slate-200 group-hover:text-white text-[13px] tracking-wide truncate transition-colors">
            {project.name}
          </div>
        </div>
        <div className="flex items-center shrink-0 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded shadow-[inset_0_0_8px_rgba(16,185,129,0.1)]">
          <div className="font-mono font-bold text-emerald-400 text-[12px]">
            {formatShortCurrency(project.revenue)}
          </div>
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        {project.locations.map((loc, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center text-[13px] mb-1"
          >
            <div className="flex items-center gap-2.5">
              {getFlagClass(loc.loc) && (
                <span
                  className={`${getFlagClass(
                    loc.loc,
                  )} text-[16px] rounded-[2px] shadow-[0_2px_4px_rgba(0,0,0,0.4)] opacity-90 group-hover:opacity-100 transition-opacity`}
                ></span>
              )}
              <span className="text-slate-300 font-semibold group-hover:text-white transition-colors">
                {loc.loc}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-200 group-hover:text-white transition-colors">
              <span className="text-indigo-400 opacity-80">
                <IconUser />
              </span>
              <span className="font-mono font-bold text-[14px]">
                {loc.headcount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export const ProjectCard = memo(ProjectCardComponent);
