"use client";

import * as React from "react";

export function ConfettiWrapper() {
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Simple confetti alternative using CSS animation
  return (
    <div className="absolute left-0 top-0 z-0 pointer-events-none size-full">
      <div className="animate-pulse text-4xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        🎉
      </div>
    </div>
  );
}
