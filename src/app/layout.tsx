import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/dashboard/sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Listwin Portfolio — Executive Dashboard",
  description:
    "Analytics, search, and lead performance across Don Listwin's web properties, managed by Prism.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <TooltipProvider delayDuration={200}>
          <div className="flex min-h-screen w-full">
            <Sidebar />
            <main className="flex-1 min-w-0 bg-muted/30">{children}</main>
          </div>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
