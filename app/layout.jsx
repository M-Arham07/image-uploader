import { Geist, Geist_Mono } from "next/font/google";
import { EdgeStoreProvider } from '@/lib/edgestore';

import Link from "next/link";
import "./globals.css";
import { GitHubLogoIcon, InstagramLogoIcon } from "@radix-ui/react-icons";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Image Shared - Secure Multi-File Image Uploader",
  description: "Upload and share multiple images securely with real-time progress, instant sharing codes, and automatic deletion. Free, fast, and private image sharing.",
  keywords: "image upload, image sharing, temporary images, secure file sharing, free image uploader, share images online, instant image code, EdgeStore, MongoDB, Next.js, React, shadcn, Tailwind CSS",
  openGraph: {
    title: "Image Shared - Secure Multi-File Image Uploader",
    description: "Upload and share multiple images securely with real-time progress, instant sharing codes, and automatic deletion. Free, fast, and private image sharing.",
    type: "website",
    locale: "en_US",
    siteName: "Image Shared",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Image Shared Platform Preview"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Shared - Secure Multi-File Image Uploader",
    description: "Upload and share multiple images securely with real-time progress, instant sharing codes, and automatic deletion.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark overflow-hidden relative`} >
       
        <Link 
          href="https://github.com/M-Arham07" 
          target="_blank"
          className="absolute top-4 left-4 opacity-75 hover:opacity-100 transition-opacity"
        >
          <GitHubLogoIcon className="w-6 h-6 -z-10 text-gray-700 dark:text-gray-300" />
        </Link>

        
          <Link 
          href="https://instagram.com/arh4m_su" 
          target="_blank"
          className="absolute top-4 left-14 opacity-75 hover:opacity-100 transition-opacity"
        >
          <InstagramLogoIcon className="w-6 h-6 -z-10 text-gray-700 dark:text-gray-300" />
        </Link>
        <EdgeStoreProvider maxConcurrentUploads={10}>
          {children}
        </EdgeStoreProvider>
      </body>
    </html>
  );
}
