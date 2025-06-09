import type { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: 'Register | Takhayul Literary Society GMC',
  description: 'Register for upcoming events at Takhayul Literary Society GMC. Secure your spot and join our community.',
  keywords: [
    "Takhayul Literary Society GMC",
    "Gujranwala Medical College",
    "Literary Society",
    "GMC",
    "Medical College",
    "Gujranwala",
    "Society",
    "Register",
    "Event Registration",
    "Literary Fiesta",
    "Literature"
  ],
  icons: {
    icon: '/logo.ico',
  },
  alternates: {
    canonical: 'https://takhayul-literary-society-gmc.vercel.app/register',
  },
  openGraph: {
    title: 'Register | Takhayul Literary Society GMC',
    description: 'Register for upcoming events at Takhayul Literary Society GMC. Secure your spot and join our community.',
    url: 'https://takhayul-literary-society-gmc.vercel.app/register',
    siteName: 'Takhayul Literary Society GMC',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Register Takhayul Literary Society GMC',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
};

export default function RegisterPage() {
  return <RegisterClient />;
}