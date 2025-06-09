import type { Metadata } from "next";
import EventsClient from "./EventsClient";
import { EventData } from "@/components/events/types";
import { baseUrl } from "@/components/utils";

export const metadata: Metadata = {
  title: 'Events | Takhayul Literary Society GMC',
  description: 'See upcoming and past events organized by the Takhayul Literary Society GMC.',
  keywords: [
    "Takhayul Literary Society GMC",
    "Gujranwala Medical College",
    "Literary Society",
    "GMC",
    "Medical College",
    "Gujranwala",
    "Society",
    "Events",
    "Competitions",
    "Speakers",
    "Literature"
  ],
  icons: {
    icon: '/logo.ico',
  },  alternates: {
    canonical: 'https://takhayul-literary-society-gmc.vercel.app/events',
  },
  openGraph: {
    title: 'Events | Takhayul Literary Society GMC',
    description: 'See upcoming and past events organized by the Takhayul Literary Society GMC.',
    url: 'https://takhayul-literary-society-gmc.vercel.app/events',    siteName: 'Takhayul Literary Society GMC',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Takhayul Literary Society GMC Events',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
};

// Page component
export default async function EventsPage() {
  try {
    const apiUrl = `${baseUrl}api/events`

    // Use fetch with force-cache to enable static generation at build time
    const res = await fetch(apiUrl, { cache: 'force-cache' });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch events: ${res.status}`);
    }

    const data = await res.json();
    const events: EventData[] = data.eventsArray || [];
    return <EventsClient events={events} />;
  } catch (error) {
    console.error("Error fetching events:", error);
    // Return empty events array instead of failing the build
    return <EventsClient events={[]} />;
  }
}
