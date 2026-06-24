import type { Metadata } from "next";
import { cookies } from "next/headers";
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
import { LOCALE_COOKIE, localeDir, parseLocaleCookie } from "@/lib/i18n/locale-cookie";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://engsols.com"),
  title: "EngSols — Engineering Mentorship Platform",
  description:
    "Mentorship, portfolios, forum, live sessions, and news for oil & gas and applied engineers.",
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = parseLocaleCookie(cookieStore.get(LOCALE_COOKIE)?.value);
  const dir = localeDir(locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className={`${dmSans.variable} ${geistMono.variable} ${fraunces.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-bg-main text-text-main antialiased transition-colors duration-[250ms]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[500] focus:rounded-lg focus:bg-bg-main focus:px-4 focus:py-2 focus:shadow-lg"
        >
          Skip to content
        </a>
        <Analytics />
        <SentryInit />
        <ThemeProvider>
          <LocaleProvider initialLocale={locale}>
            <Navbar />
            <main id="main-content" className="flex-1 pb-16 lg:pb-0">
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
