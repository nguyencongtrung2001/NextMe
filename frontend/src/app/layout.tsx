import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

const lora = Lora({
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Grow Personal - Trồng Hoa Hành Trình Của Bạn",
  description: "Thiết lập các thói quen tích cực, vượt qua thử thách mỗi ngày và ngắm nhìn khu vườn tâm hồn của bạn nở rộ rực rỡ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-full flex flex-col font-sans",
          plusJakartaSans.variable,
          lora.variable,
          jetbrainsMono.variable
        )}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}


