"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { translateText } from "../services/translationService";

interface TranslationContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (text: string) => Promise<string>;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<string>("en");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Load saved locale from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("app-locale");
      if (savedLocale) {
        setLocaleState(savedLocale);
      }
    }
  }, []);

  // Save locale to localStorage when it changes
  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("app-locale", newLocale);
    }
  };

  // Translation function
  const t = async (text: string): Promise<string> => {
    if (locale === "en") {
      return text;
    }

    setIsTranslating(true);
    try {
      const translated = await translateText(text, locale, "en");
      return translated;
    } catch (error) {
      console.error("Translation failed:", error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <TranslationContext.Provider
      value={{ locale, setLocale, t, isTranslating }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
