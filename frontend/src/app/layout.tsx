import type { Metadata } from "next";
import { Lora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
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
    <html
      lang="vi"
      className={`h-full antialiased ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme-css-vars');
                  if (saved) {
                    var theme = JSON.parse(saved);
                    var styleTag = document.createElement('style');
                    styleTag.id = 'dynamic-theme-style';
                    styleTag.innerHTML = ':root { --primary: ' + theme.lightText + '; --primary-soft: ' + theme.lightSoft + '; --primary-bg: ' + theme.lightBg + '; --primary-border: ' + theme.lightBorder + '; --ring: ' + theme.lightText + '; } .dark { --primary: ' + theme.darkText + '; --primary-soft: ' + theme.darkSoft + '; --primary-bg: ' + theme.darkBg + '; --primary-border: ' + theme.darkBorder + '; --ring: ' + theme.darkText + '; }';
                    document.head.appendChild(styleTag);
                  }
                } catch(e) {}
              })();
            `
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-full flex flex-col font-sans",
          lora.variable,
          jetbrainsMono.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}


