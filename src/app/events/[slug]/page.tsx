import { EventData } from "@/components/events/types";
import { baseUrl } from "@/components/utils";
import { notFound } from "next/navigation";
import EventDetails from "@/components/events/EventDetails";

// Helper to fetch events list
async function fetchEvents(): Promise<EventData[]> {
  try {
    // const apiUrl = `${baseUrl}api/events`

    // // Use fetch with force-cache for static generation
    // const res = await fetch(apiUrl, { cache: 'force-cache' });

    // if (!res.ok) {
    //   console.warn(`Failed to fetch events: ${res.status}`);
    //   return [];
    // }
    // const data = await res.json();
const data = {  eventsArray: [
      ]}
    const events = data.eventsArray ?? [];
    return Array.isArray(events) ? events : [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

// Metadata generation for each event
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // Await params as per Next.js 15's async params
  const { slug } = await params;
  const events = await fetchEvents();
  const event = events.find((e: EventData) => e.slug === slug);
  if (!event) {
    return { title: "Event Not Found | Takhayul Literary Society GMC" };
  }

  const url = `${baseUrl}events/${event.slug}`;
  return {
    title: `${event.title} | Takhayul Literary Society GMC`,
    description: event.description.replace(/\n/g, ' '),
    keywords: [
      'Takhayul Literary Society GMC',
      'Gujranwala Medical College',
      'Literary Society',
      'GMC',
      'Medical College',
      'Gujranwala',
      'Society',
      'Events',
      event.title,
      event.venue,
      ...(event.speakers?.map((s) => s.name) ?? [])
    ],
    icons: { icon: '/logo.ico' },
    alternates: { canonical: url },    
    openGraph: {
      title: `${event.title} | Takhayul Literary Society GMC`,
      description: event.description.replace(/\n/g, ' '),
      url,
      siteName: 'Takhayul Literary Society GMC',
      images: [
        {
          url: event.image,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
      type: 'article',
      locale: 'en_US',
    },
  };
}

// Static paths generation
export async function generateStaticParams() {
  try {
    const events = await fetchEvents();
    if (!Array.isArray(events) || events.length === 0) {
      return [];
    }
    return events.map((e: EventData) => ({ slug: e.slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Page component
export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params for dynamic routing
  const { slug } = await params;
  const events = await fetchEvents();
  const event = events.find((e: EventData) => e.slug === slug);

  if (!event) {
    notFound();
  }

  return <EventDetails event={event} />;
}
