import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Fraunces } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommunityBottomNav } from "@/components/layout/CommunityBottomNav";
import { PageTransition } from "@/components/motion/PageTransition";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { Analytics } from "@/components/analytics/Analytics";
import { SentryInit } from "@/components/analytics/SentryInit";
import { PwaInstallPrompt } from "@/components/layout/PwaInstallPrompt";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EngSols — Engineering Mentorship Platform",
  description:
    "Mentorship, portfolios, forum, live sessions, and news for oil & gas and applied engineers.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSans.variable} ${geistMono.variable} ${fraunces.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <Analytics />
        <SentryInit />
        <ThemeProvider>
          <LocaleProvider>
            <Navbar />
            <main className="flex-1 pb-16 lg:pb-0">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <CommunityBottomNav />
            <Toaster position="bottom-center" richColors />
            <PwaInstallPrompt />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
