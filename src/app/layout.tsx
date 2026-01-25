import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "AdVantage AI - Intelligent Ad Analysis",
  description: "AI-powered ad creative analysis and optimization platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <ToastContainer />
      <body className="bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
