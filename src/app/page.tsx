import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: 'Takhayul Literary Society GMC | Home',
  description: 'Official site of the Takhayul Literary Society GMC. Discover our mission, literary events, and how to get involved.',
  keywords: [
    "Takhayul Literary Society GMC",
    "Gujranwala Medical College",
    "Literary Society",
    "GMC",
    "Medical College",
    "Gujranwala",
    "Society",
    "Literature",
    "Events",
    "Register",
    "Contact",
    "About"
  ],
  icons: {
    icon: '/logo.ico',
  },
  alternates: {
    canonical: 'https://takhayul-literary-society-gmc.vercel.app/',
  },
  openGraph: {
    title: 'Takhayul Literary Society GMC | Home',
    description: 'Official site of the Takhayul Literary Society GMC. Discover our mission, literary events, and how to get involved.',
    url: 'https://takhayul-literary-society-gmc.vercel.app/',
    siteName: 'Takhayul Literary Society GMC',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Takhayul Literary Society GMC',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
};

export default function Home() {
  return <HomeClient />;
}
