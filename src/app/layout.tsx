// src/app/layout.tsx
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/ui/sidebar";
import { BreadcrumbWrapper } from "@/components/breadcrumb-wrapper";
import { Providers } from "./providers";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto"
});

export const metadata: Metadata = {
  title: "Painel Vet Laudos",
  description: "Sistema de gestão",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex",
          roboto.className
        )}
      >
        <Sidebar />

        <Providers>
          <main className="flex-1 p-6">
            <BreadcrumbWrapper />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
