import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Syne } from "next/font/google";
import { MobileLayout } from "@/components/layout/mobile-layout";

export const metadata: Metadata = {
  title: "Pengbook",
  description: "Aplikasi Pencatatan Keuangan",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1a1a2e",
};

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`bg-secondary-100 antialiased ${syne.variable}`}>
        <MobileLayout>
          <Providers>{children}</Providers>
        </MobileLayout>
      </body>
    </html>
  );
}
