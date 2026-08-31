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
    "Executive snapshot of Don Listwin's five web projects — how each is doing from reviewed GA, Search, and Cove inquiry data.",
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
          <div className="flex min-h-screen w-full flex-col md:flex-row">
            <Sidebar />
            <main className="min-w-0 flex-1 bg-background">{children}</main>
          </div>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
