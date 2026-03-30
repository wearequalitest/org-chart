import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { HeadAvatarNode } from "./HeadAvatarNode";
import { HeadContainer } from "./HeadContainer";
import {
  IconMaximize,
  IconMinimize,
  IconCamera,
  IconSpinner,
} from "../utils/icons";
import { useOrgChartData } from "../hooks/useOrgChartData";
import { useEdgeScroll } from "../hooks/useEdgeScroll";
import { roleConfig } from "../constants/roleConfig";

const LoadingScreen = () => {
  const loadingText = "Fetching Data...";
  return (
    <div id="pre-load" className="loader z-50">
      <div className="loader-inner">
        <div className="loader-logo">
          <svg
            width="83"
            height="83"
            viewBox="0 0 83 83"
            fill="none"
            aria-labelledby="title"
          >
            <title>Qualitest</title>
            <path
              d="M41.5704 82.9999C31.9553 83.0162 22.6329 79.6934 15.196 73.599C7.759 67.5046 2.66895 59.017 0.795477 49.5862C-1.078 40.1554 0.381349 30.3667 4.92419 21.8925C9.46704 13.4182 16.8115 6.78439 25.7027 3.12432C34.5939 -0.535752 44.4801 -0.994918 53.6723 1.82527C62.8645 4.64546 70.7922 10.57 76.1009 18.5867C81.4097 26.6033 83.7701 36.2146 82.7788 45.7785C81.7875 55.3423 77.5061 64.2652 70.666 71.0227L82.5265 82.8798L41.5704 82.9999ZM41.5704 13.0515C35.9297 13.0508 30.4155 14.7229 25.7251 17.8563C21.0348 20.9897 17.3789 25.4437 15.22 30.6549C13.0611 35.8661 12.4961 41.6005 13.5964 47.1329C14.6967 52.6652 17.4128 57.7471 21.4014 61.7356C25.39 65.7242 30.4718 68.4404 36.0042 69.5407C41.5365 70.641 47.2709 70.076 52.4821 67.9171C57.6933 65.7581 62.1473 62.1023 65.2807 57.412C68.4141 52.7216 70.0862 47.2074 70.0855 41.5667C70.0767 34.0067 67.0696 26.7589 61.7239 21.4131C56.3782 16.0674 49.1304 13.0603 41.5704 13.0515Z"
              fill="white"
            ></path>
          </svg>
        </div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
      <div className="font-sans text-[12px] font-extrabold tracking-widest mt-10 uppercase text-indigo-300">
        {loadingText.split("").map((char, i) => (
          <span
            key={i}
            className="loading-char"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </div>
  );
};

export const OrgChart = () => {
  const { data, loading } = useOrgChartData();
  const [collapsedIds, setCollapsedIds] = useState(new Set());
  const roles = {
    "Senior PGM": {
      bg: "rgba(234, 67, 53, 0.02)",
      shadow: "inset 4px 0 10px rgba(234, 67, 53, 0.7)",
      borderColor: "rgba(234, 67, 53, 0.7)",
    },
    "Account Manager": {
      bg: "rgba(251, 188, 4, 0.02)",
      shadow: "inset 4px 0 10px rgba(251, 188, 4, 0.6)",
      borderColor: "rgba(251, 188, 4, 0.7)",
    },
    "Delivery Manager": {
      bg: "rgba(52, 168, 83, 0.02)",
      shadow: "inset 4px 0 10px rgba(52, 168, 83, 0.6)",
      borderColor: "rgba(52, 168, 83, 0.7)",
    },
  };

  useEffect(() => {
    // Initialize as all collapsed when data loads
    if (data && collapsedIds.size === 0) {
      setCollapsedIds(
        new Set(data.flatMap((h) => h.containers.map((c) => c.id))),
      );
    }
  }, [data]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const torchEl = document.getElementById("torch");
    let ticking = false;
    const handleMouseMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (torchEl) {
            torchEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Enable edge-detection auto-scroll
  useEdgeScroll("chart-capture-target", 50, 8);

  const allContainerIds = useMemo(
    () => (data ? data.flatMap((h) => h.containers.map((c) => c.id)) : []),
    [data],
  );
  const isAllCollapsed = useMemo(
    () =>
      allContainerIds.length > 0 &&
      allContainerIds.every((id) => collapsedIds.has(id)),
    [allContainerIds, collapsedIds],
  );

  const toggleAll = () => {
    if (isAllCollapsed) {
      setCollapsedIds(new Set());
    } else {
      setCollapsedIds(new Set(allContainerIds));
    }
  };

  const toggleContainer = (id) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleScreenshot = async () => {
    const element = document.getElementById("chart-capture-target");
    if (element && window.domtoimage) {
      setIsExporting(true);
      try {
        await document.fonts.ready;

        const originalOverflow = element.style.overflow;
        const originalHeight = element.style.height;

        element.style.overflow = "visible";
        element.style.height = "max-content";

        await new Promise((resolve) => setTimeout(resolve, 200));

        const dataUrl = await window.domtoimage.toPng(element, {
          bgcolor: "#13131f",
          width: element.scrollWidth,
          height: element.scrollHeight,
          style: {
            transform: "scale(1)",
            transformOrigin: "top left",
          },
        });

        element.style.overflow = originalOverflow;
        element.style.height = originalHeight;

        const link = document.createElement("a");
        link.download = `OrgChart_Export.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Screenshot failed:", error);
        alert("Failed to capture screenshot. Please try again.");
      } finally {
        setIsExporting(false);
      }
    } else {
      alert("Screenshot library is still loading, please wait a moment.");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div
      className="w-screen h-screen overflow-auto block relative z-10"
      id="chart-capture-target"
    >
      {/* EDGE SCROLL INDICATORS */}
      {/* Left Edge */}
      <div className="pointer-events-none fixed left-0 top-0 h-full w-12 z-40">
        <div className="edge-indicator edge-indicator-left h-full w-full flex items-center justify-start pl-2">
          <svg
            className="scroll-chevron scroll-chevron-left"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>
      </div>

      {/* Right Edge */}
      <div className="pointer-events-none fixed right-0 top-0 h-full w-12 z-40">
        <div className="edge-indicator edge-indicator-right h-full w-full flex items-center justify-end pr-2">
          <svg
            className="scroll-chevron scroll-chevron-right"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>

      {/* Top Edge */}
      <div className="pointer-events-none fixed top-0 left-0 w-full h-12 z-40">
        <div className="edge-indicator edge-indicator-top w-full h-full flex items-start justify-center pt-2">
          <svg
            className="scroll-chevron scroll-chevron-top"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </div>
      </div>

      {/* Bottom Edge */}
      <div className="pointer-events-none fixed bottom-0 left-0 w-full h-12 z-40">
        <div className="edge-indicator edge-indicator-bottom w-full h-full flex items-end justify-center pb-2">
          <svg
            className="scroll-chevron scroll-chevron-bottom"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      {/* TOP LEFT LEGEND */}
      <div
        className="fixed top-3 left-3 z-50 flex flex-row gap-2 bg-[#161624]/80 backdrop-blur-xl border border-white/5 p-4 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-white/10 hover:bg-[#161624]"
        data-html2canvas-ignore
      >
        <h3 className="text-[10px] font-bold text-transparent bg-clip-text bg-linear-to-r from-slate-400 to-slate-200 uppercase tracking-widest border-r border-border pr-4 pb-0">
          Roles
        </h3>
        <div className="flex flex-row gap-8 items-center">
          {Object.entries(roles).map(([name, style], idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <div
                className="w-5 h-4 rounded-sm border-l"
                style={{
                  background: style.bg,
                  boxShadow: style.shadow,
                  borderLeftColor: style.borderColor,
                }}
              ></div>

              <span className="text-[9.5px] font-semibold text-slate-300 tracking-wide whitespace-nowrap">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TOP RIGHT CONTROLS */}
      <div
        className="fixed top-3 right-3 z-50 flex gap-3"
        data-html2canvas-ignore
      >
        <button
          onClick={toggleAll}
          className="bg-[#161624]/80 backdrop-blur-xl border border-white/5 px-4 py-3 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2 text-indigo-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300 font-bold text-[10px] uppercase tracking-widest cursor-pointer"
        >
          {isAllCollapsed ? <IconMaximize /> : <IconMinimize />}
          {isAllCollapsed ? "Expand All" : "Collapse All"}
        </button>

        <button
          onClick={handleScreenshot}
          disabled={isExporting}
          className="bg-[#161624]/80 backdrop-blur-xl border border-white/5 px-4 py-3 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2 text-emerald-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all duration-300 font-bold text-[10px] uppercase tracking-widest cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? <IconSpinner /> : <IconCamera />}
          {isExporting ? "Capturing..." : "Screenshot"}
        </button>
      </div>

      {/* MAIN CHART CONTAINER */}
      <div className="w-max mx-auto px-10 py-16 transition-all duration-500">
        <div
          className="relative flex w-max items-start"
          style={{
            gap: isAllCollapsed ? "5px" : "64px",
            transition: "gap 0.5s ease-in-out",
          }}
        >
          {data &&
            data.map((head, hIdx) => {
              const isHeadCollapsed = head.containers.every((c) =>
                collapsedIds.has(c.id),
              );

              return (
                <div
                  key={head.id}
                  className="flex flex-col items-center justify-start relative z-10"
                >
                  <div className="h-[120px] flex flex-col items-center justify-end">
                    <HeadAvatarNode
                      head={head}
                      isCollapsed={isHeadCollapsed}
                      delay={hIdx * 0.2}
                      onToggleContainers={() => {
                        const containerIds = new Set(
                          head.containers.map((c) => c.id),
                        );
                        const allContainerIdsFull = new Set(
                          data.flatMap((h) => h.containers.map((c) => c.id)),
                        );
                        const allHeadContainerCollapsed = head.containers.every(
                          (c) => collapsedIds.has(c.id),
                        );

                        setCollapsedIds((prev) => {
                          const next = new Set(prev);
                          if (allHeadContainerCollapsed) {
                            // Expand all containers for this head
                            head.containers.forEach((c) => next.delete(c.id));
                          } else {
                            // Collapse all containers for this head
                            head.containers.forEach((c) => next.add(c.id));
                          }
                          return next;
                        });
                      }}
                    />
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 30 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-[2px] bg-gradient-to-b from-primary to-accent/50 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                  ></motion.div>

                  <div
                    className="relative flex pt-[24px] flex-1 items-start"
                    style={{
                      gap: isHeadCollapsed ? "5px" : "32px",
                      transition: "gap 0.5s ease-in-out",
                    }}
                  >
                    {head.containers.length > 1 && (
                      <motion.div
                        initial={false}
                        animate={{
                          left: collapsedIds.has(head.containers[0].id)
                            ? 88
                            : 128,
                          right: collapsedIds.has(
                            head.containers[head.containers.length - 1].id,
                          )
                            ? 88
                            : 128,
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute top-0 h-[2px] bg-gradient-to-r from-accent/50 via-primary to-accent/50 origin-center shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                      ></motion.div>
                    )}

                    {head.containers.map((container, cIdx) => {
                      const isContainerCollapsed = collapsedIds.has(
                        container.id,
                      );
                      return (
                        <motion.div
                          key={container.id}
                          initial={false}
                          animate={{
                            width: isContainerCollapsed ? 176 : 256,
                          }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          className="relative flex flex-col"
                        >
                          <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 w-[2px] h-[24px] bg-gradient-to-b from-primary/80 to-transparent"></div>
                          <HeadContainer
                            container={container}
                            delay={0.6 + hIdx * 0.2 + cIdx * 0.15}
                            isCollapsed={isContainerCollapsed}
                            onToggle={() => toggleContainer(container.id)}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
