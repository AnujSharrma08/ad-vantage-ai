"use client";

import { useTranslate } from "@/src/hooks/useTranslate";

interface TranslateProps {
  text: string;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
}

export default function Translate({
  text,
  className,
  as = "span",
}: TranslateProps) {
  const translatedText = useTranslate(text);
  const Component = as;

  return <Component className={className}>{translatedText}</Component>;
}
