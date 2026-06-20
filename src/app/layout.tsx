import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Playa - Plateforme de Jeux Web",
  description: "Des mini-jeux funs et colorés dans une ambiance tropicale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="container" style={{ minHeight: "calc(100vh - 80px)", paddingBottom: "40px" }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
