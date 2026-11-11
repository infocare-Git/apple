import type { Metadata, Viewport } from "next";
import { Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/Shell";

const noto = Noto_Sans_Devanagari({ subsets: ["devanagari", "latin"], weight: ["400", "500", "700"], variable: "--font-noto", display: "swap" });

export const metadata: Metadata = {
  title: "स्याउ साथी · Syau Sathi",
  description: "स्याउ किसानको साथी: बगैंचाको ज्ञान, बोट डाक्टर, किनमेल र बिक्री।",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#C62828", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ne" className={noto.variable}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
