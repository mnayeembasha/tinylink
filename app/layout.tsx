import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';

import "./globals.css";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata:Metadata = {
  title: "Tiny Link",
  description:"Generate tiny urls for your brand with ease"
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${inter.variable} antialiased tracking-tight`}
      >
      <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
