"use client";

import { GameProvider } from "@/contexts/GameContextSocket";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}
