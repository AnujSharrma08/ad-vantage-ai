"use client";

import { TranslationProvider } from "../context/TranslationContext";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <TranslationProvider>{children}</TranslationProvider>;
}
