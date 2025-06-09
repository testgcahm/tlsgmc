import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: 'About | Takhayul Literary Society GMC',
  description: 'Learn about the mission, values, and origins of the Takhayul Literary Society GMC.',
  keywords: [
    "Takhayul Literary Society GMC",
    "Gujranwala Medical College",
    "Literary Society",
    "GMC",
    "Medical College",
    "Gujranwala",
    "Society",
    "About GMC",
    "Mission",
    "Values",
    "Literature"
  ],
  icons: {
    icon: '/logo.ico',
  },
  alternates: {
    canonical: 'https://takhayul-literary-society-gmc.vercel.app/about',
  },
  openGraph: {
    title: 'About | Takhayul Literary Society GMC',
    description: 'Learn about the mission, values, and origins of the Takhayul Literary Society GMC.',
    url: 'https://takhayul-literary-society-gmc.vercel.app/about',
    siteName: 'Takhayul Literary Society GMC',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'About Takhayul Literary Society GMC',
      },
    ],
    type: 'article',
    locale: 'en_US',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}