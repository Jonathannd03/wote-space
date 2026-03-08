import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wote Space - Espace Humanitaire à Goma",
  description: "Un espace de coordination humanitaire au service des organisations, associations et acteurs communautaires à Goma, RDC.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
