import { useEffect, useRef } from "react";

/**
 * Hook that enables auto-scroll when mouse nears edges of a scrollable container
 * Creates invisible detection zones on all 4 edges for smooth scrolling
 * @param {string} containerId - ID of the scrollable container
 * @param {number} edgeDistance - Distance from edge to trigger scroll (default: 50px)
 * @param {number} maxScrollSpeed - Maximum pixels per frame to scroll (default: 8)
 */
export const useEdgeScroll = (
  containerId,
  edgeDistance = 50,
  maxScrollSpeed = 8,
) => {
  const scrollFrameRef = useRef(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isMouseOverRef = useRef(false);
  const retryTimeoutRef = useRef(null);

  useEffect(() => {
    function setupScroll() {
      const container = document.getElementById(containerId);

      if (!container) {
        console.warn(
          `[useEdgeScroll] Container with id "${containerId}" not found, retrying in 100ms...`,
        );
        // Retry after a short delay
        retryTimeoutRef.current = setTimeout(setupScroll, 100);
        return;
      }

      console.log(
        `[useEdgeScroll] Hook initialized for container: ${containerId}`,
      );

      const scroll = () => {
        // Only continue scrolling loop if mouse is still over container
        if (!isMouseOverRef.current) {
          return;
        }

        const rect = container.getBoundingClientRect();
        const { x: mouseX, y: mouseY } = mousePositionRef.current;

        // Calculate distance from edges
        const distFromLeft = mouseX - rect.left;
        const distFromRight = rect.right - mouseX;
        const distFromTop = mouseY - rect.top;
        const distFromBottom = rect.bottom - mouseY;

        // Determine scroll direction and speed
        let scrollX = 0;
        let scrollY = 0;

        // Horizontal scrolling (left/right edges)
        if (distFromLeft < edgeDistance && distFromLeft > 0) {
          // Near left edge - scroll left
          scrollX = -maxScrollSpeed * (1 - distFromLeft / edgeDistance);
        } else if (distFromRight < edgeDistance && distFromRight > 0) {
          // Near right edge - scroll right
          scrollX = maxScrollSpeed * (1 - distFromRight / edgeDistance);
        }

        // Vertical scrolling (top/bottom edges)
        if (distFromTop < edgeDistance && distFromTop > 0) {
          // Near top edge - scroll up
          scrollY = -maxScrollSpeed * (1 - distFromTop / edgeDistance);
        } else if (distFromBottom < edgeDistance && distFromBottom > 0) {
          // Near bottom edge - scroll down
          scrollY = maxScrollSpeed * (1 - distFromBottom / edgeDistance);
        }

        // Apply scrolling if needed
        if (scrollX !== 0 || scrollY !== 0) {
          console.log(
            `[useEdgeScroll] Scrolling: X=${scrollX.toFixed(2)}, Y=${scrollY.toFixed(2)}`,
          );
          container.scrollLeft += scrollX;
          container.scrollTop += scrollY;
        }

        // Continue animation loop
        scrollFrameRef.current = requestAnimationFrame(scroll);
      };

      const handleMouseMove = (e) => {
        mousePositionRef.current = { x: e.clientX, y: e.clientY };
        console.log(
          `[useEdgeScroll] Mouse moved to: ${e.clientX}, ${e.clientY}`,
        );

        // Start scrolling animation if not already running
        if (!isMouseOverRef.current) {
          isMouseOverRef.current = true;
          console.log(
            `[useEdgeScroll] Mouse entered container, starting scroll loop`,
          );
          scrollFrameRef.current = requestAnimationFrame(scroll);
        }
      };

      const handleMouseLeave = () => {
        isMouseOverRef.current = false;
        console.log(
          `[useEdgeScroll] Mouse left container, stopping scroll loop`,
        );
        if (scrollFrameRef.current) {
          cancelAnimationFrame(scrollFrameRef.current);
        }
      };

      console.log(`[useEdgeScroll] Adding event listeners to container`);
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      // Store cleanup function in ref so it can be called in the outer cleanup
      retryTimeoutRef.current = () => {
        console.log(`[useEdgeScroll] Cleaning up event listeners`);
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
        if (scrollFrameRef.current) {
          cancelAnimationFrame(scrollFrameRef.current);
        }
      };
    }

    // Start the setup/retry process
    setupScroll();

    return () => {
      // Clear any pending retries
      if (
        retryTimeoutRef.current &&
        typeof retryTimeoutRef.current === "number"
      ) {
        clearTimeout(retryTimeoutRef.current);
      }
      // Run cleanup if it was set up
      if (
        retryTimeoutRef.current &&
        typeof retryTimeoutRef.current === "function"
      ) {
        retryTimeoutRef.current();
      }
      if (scrollFrameRef.current) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, [containerId, edgeDistance, maxScrollSpeed]);
};
