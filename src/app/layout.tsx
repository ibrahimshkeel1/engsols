import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommunityBottomNav } from "@/components/layout/CommunityBottomNav";
import { PageTransition } from "@/components/motion/PageTransition";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { Analytics } from "@/components/analytics/Analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
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
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <Analytics />
        <ThemeProvider>
          <LocaleProvider>
            <Navbar />
            <main className="flex-1 pb-16 lg:pb-0">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <CommunityBottomNav />
            <Toaster position="bottom-center" richColors />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
