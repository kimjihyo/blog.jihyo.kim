"use client";

import { Confetti, type ConfettiRef } from "@/components/magicui/confetti";
import * as React from "react";

export function ConfettiWrapper() {
  const confettiRef = React.useRef<ConfettiRef>(null);

  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    confettiRef.current?.fire();
  }, []);

  return (
    <Confetti
      ref={confettiRef}
      className="absolute left-0 top-0 z-0 pointer-events-none size-full"
    />
  );
}
