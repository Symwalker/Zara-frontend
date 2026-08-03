import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zara AI",
  description: "Autonomous SDR Outreach Pipeline",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} bg-slate-50 text-slate-900 flex flex-col lg:flex-row h-screen overflow-hidden antialiased`}
      >
        {/* Responsive Sidebar & Mobile Navigation */}
        <Sidebar />

        {/* Main Workspace Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}