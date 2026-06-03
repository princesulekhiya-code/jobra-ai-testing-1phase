import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";

const geistSans = localFont({
  src: "../../public/fonts/geist-regular.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "../../public/fonts/geist-mono-regular.woff2",
  variable: "--font-geist-mono",
  display: "swap",
});

const abhayaLibre = localFont({
  src: "../../public/fonts/abhaya-libre-regular.woff2",
  variable: "--font-abhaya-libre",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobRaai",
  description: "JobRaai - Your AI-powered job platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:wght@400;700&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${abhayaLibre.variable} antialiased overscroll-none`}
        style={{ WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" }}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
