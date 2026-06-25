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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://syahriza.vercel.app"; 

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Syahriza - Portfolio & Interactive Web Tools",
    template: "%s | Syahriza Portfolio", // Memudahkan sub-halaman mengubah judul secara dinamis (misal: "Ruang Pelepasan | Syahriza Portfolio")
  },
  description: "Syahriza's personal portfolio showcasing full-stack web development projects, creative tools, components, skills, and professional experience.",
  keywords: [
    "Syahriza", 
    "Web Developer Indonesia", 
    "Frontend Engineer", 
    "Next.js Portfolio", 
    "React Developer", 
    "Creative Web Tools"
  ],
  authors: [{ name: "Syahriza", url: SITE_URL }],
  creator: "Syahriza",
  
  // URL Kanonisasi untuk menghindari isu konten duplikat di mesin pencari
  alternates: {
    canonical: "/",
  },

  // Open Graph (Untuk optimasi tampilan share di WhatsApp, Facebook, Discord, LinkedIn)
  openGraph: {
    title: "Syahriza - Portfolio & Interactive Web Tools",
    description: "Explore web projects, custom web apps, and interactive components built with modern technologies.",
    url: SITE_URL,
    siteName: "Syahriza Portfolio",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/my-photo.png", // Buat file gambar ukuran 1200x630px di folder /public/og-image.png
        width: 1200,
        height: 630,
        alt: "Syahriza Portfolio & Interactive Web Tools Preview Image",
      },
    ],
  },

  // Twitter Card Meta Tags
  twitter: {
    card: "summary_large_image",
    title: "Syahriza - Portfolio & Interactive Web Tools",
    description: "Explore web projects, custom web apps, and interactive components built with modern technologies.",
    images: ["/my-photo.png"],
  },

  // Pengaturan Robot Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Favicons dan Ikon Aplikasi
  icons: {
    icon: "/my-photo.png",
    shortcut: "/my-photo.png",
    apple: "/my-photo.png", // Idealnya sediakan ikon ukuran khusus apple-touch-icon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // 💡 Skema JSON-LD untuk mempermudah Google memahami entitas pemilik website
  const jsonLdStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Syahriza",
    "url": SITE_URL,
    "image": `${SITE_URL}/my-photo.png`,
    "jobTitle": "Web Developer",
    "description": "Full-stack and frontend web developer specializing in React, Next.js, and modern web infrastructure.",
    "sameAs": [
      "https://github.com/syahrizaia",
      "https://linkedin.com/in/syahriza-ikhsan-alsistani",
    ],
    "knowsAbout": ["Web Development", "React", "Next.js", "TypeScript", "Tailwind CSS"]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950">
        {/* Suntikan JSON-LD Structured Data ke dalam Head */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdStructuredData) }}
        />

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