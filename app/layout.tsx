import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import NavSidebar from "@/components/NavSidebar";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "@/components/ui/toaster";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

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
        <NavSidebar />
        <NuqsAdapter>
          <main className="bg-background ml-24 flex flex-col grow">
            {children}
            <Toaster />
          </main>
        </NuqsAdapter>
      </body>
    </html>
  );
}
