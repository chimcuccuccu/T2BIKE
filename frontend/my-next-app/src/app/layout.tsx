'use client'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { HeaderPage } from "@/components/Header/header-page";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/Toast/toaster";
import { WishlistProvider } from "@/context/WishlistContext";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Layout root wrapper
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hiddenHeaderPaths = ["/dashboard"];
  const showHeader = !hiddenHeaderPaths.includes(pathname);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {showHeader && <HeaderPage />}
              <main>{children}</main>
            </WishlistProvider>
          </CartProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
