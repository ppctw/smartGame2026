import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "夢想探索號列車 - Dream Explorer Train",
  description: "多人實體派對遊戲 - 一起前往夢夢車站的冒險旅程！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={notoSansTC.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
