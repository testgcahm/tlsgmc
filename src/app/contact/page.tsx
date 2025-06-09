import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
    title: 'Contact | Takhayul Literary Society GMC',
    description: 'Contact the Takhayul Literary Society GMC for questions, feedback, or collaboration opportunities.',
    keywords: [
      "Takhayul Literary Society GMC",
      "Gujranwala Medical College",
      "Literary Society",
      "GMC",
      "Medical College",
      "Gujranwala",
      "Society",
      "Contact",
      "Feedback",
      "Collaboration",
      "Literature"
    ],
    icons: {
      icon: '/logo.ico',
    },
    alternates: {
      canonical: 'https://takhayul-literary-society-gmc.vercel.app/contact',
    },
    openGraph: {
      title: 'Contact | Takhayul Literary Society GMC',
      description: 'Contact the Takhayul Literary Society GMC for questions, feedback, or collaboration opportunities.',
      url: 'https://takhayul-literary-society-gmc.vercel.app/contact',
      siteName: 'Takhayul Literary Society GMC',
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: 'Contact Takhayul Literary Society GMC',
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
  };

export default function ContactPage() {
  return <ContactClient />;
}