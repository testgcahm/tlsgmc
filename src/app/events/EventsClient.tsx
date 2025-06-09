'use client';

import { motion } from 'framer-motion';
import EventCard from '../../components/events/EventCard';
import { EventData } from '@/components/events/types';

interface EventsClientProps {
  events: EventData[];
}

export default function EventsClient({ events }: EventsClientProps) {
  // Ensure events is always an array
  const safeEvents = Array.isArray(events) ? events : [];

  // Sort events by 'order' property (ascending), missing order goes last
  const sortedEvents = [...safeEvents].sort((a, b) => {
    if (typeof a.order === 'number' && typeof b.order === 'number') {
      return a.order - b.order;
    }
    if (typeof a.order === 'number') return -1;
    if (typeof b.order === 'number') return 1;
    return 0;
  });

  if (sortedEvents.length === 0) {
    return <div className="text-center flex items-center justify-center text-red-600 min-h-[30vh] text-3xl font-bold my-20">Currently there are no events</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center mb-4 min-h-[85vh] text-primary p-8 max-[400px]:p-4 max-[352px]:p-2"
    >
      <h1 className="text-4xl font-extrabold text-primary-700 mb-8 text-center">Events</h1>
      <div className="grid gap-10 w-full max-w-4xl">
        {sortedEvents.map((event) => (
          <div key={event.slug}>
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
