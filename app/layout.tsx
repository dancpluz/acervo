import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import SideBar from "@/components/Sidebar";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';

const poppins = Poppins({ weight: ['400','500','600'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Acervo",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${poppins.className}`}>
        <NextTopLoader color="#465613" />
        <SideBar />
        <main className="bg-background ml-24 h-dvh">
          {children}
        </main>
      </body>
    </html>
  );
}
