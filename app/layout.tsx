import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import Navbar from "./components/navbar";
import MotionEffects from "./components/motion-effects";
import AppChrome from "./components/app-chrome";

export const metadata: Metadata = {
  metadataBase: new URL("https://mirus.in"),
  title: {
    default: "MIRUS | Luxury Indian Fashion",
    template: "%s | MIRUS",
  },
  description: "MIRUS is a premium Indian luxury fashion house for curated clothing, personal ordering, WhatsApp assistance, and door delivery.",
  keywords: ["MIRUS", "luxury Indian fashion", "premium clothing India", "designer clothing", "door delivery fashion"],
  openGraph: {
    title: "MIRUS | Luxury Indian Fashion",
    description: "Premium Indian clothing with personal ordering and door delivery.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider defaultTheme="light" storageKey="mirus-theme">
          <MotionEffects />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <AppChrome />
        </ThemeProvider>
      </body>
    </html>
  );
}
