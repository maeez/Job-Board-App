import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Providers from "@/components/providers";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  title: "Job Board",
  description: "Find your next opportunity to grow",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body className={`${beVietnamPro.className} antialiased`}>
       <Providers>{children}</Providers> 
      </body>
    </html>
  );
}
