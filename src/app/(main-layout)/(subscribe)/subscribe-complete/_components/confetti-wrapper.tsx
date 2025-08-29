"use client";

import * as React from "react";

export function ConfettiWrapper() {
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Simple confetti alternative using CSS animation
  return (
    <div className="pointer-events-none absolute top-0 left-0 z-0 size-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform animate-pulse text-4xl">
        🎉
      </div>
    </div>
  );
}
