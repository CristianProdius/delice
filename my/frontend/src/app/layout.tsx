import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Delice - Handcrafted Chocolate",
  description: "Artisan chocolate products and chocolate-making courses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
