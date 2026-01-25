import Providers from "@/src/components/Providers";
import Sidebar from "@/src/components/Sidebar";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function AuditHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-slate-950 text-slate-100`}
      >
        <div className="flex min-h-screen">
          <Providers>
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-8 overflow-auto">
              {children}
            </main>
          </Providers>
        </div>
      </body>
    </html>
  );
}
