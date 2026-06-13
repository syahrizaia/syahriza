import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import AudioPlayer from "@/components/audio-player";
import GlobalGiftWidget from "@/components/GlobalGiftWidget";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Syahriza - Portfolio",
  description: "Syahriza's Portfolio showcasing projects, skills, and experience in web development.",
  icons: {
    icon: "/my-photo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />

        <main className="grow">
          {children}

          <Toaster position="top-center" reverseOrder={false} />
          <GlobalGiftWidget />
        </main>

        <AudioPlayer />
      </body>
    </html>
  );
}
