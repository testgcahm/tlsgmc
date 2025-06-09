'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { EventData, Subevent, Speaker } from './types';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface EventCardProps {
  event: EventData;
}

const EventCard = ({ event }: EventCardProps) => {
  const [copied, setCopied] = useState(false);
  const [showSegments, setShowSegments] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null); // State for enlarged image

  const onShare = async () => {
    const url = `${window.location.origin}/events/${event.slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasSegments = event.subevents && event.subevents.length > 0;

  // Sort subevents by order if available
  const sortedSubevents = hasSegments
    ? [...(event.subevents || [])].sort((a: Subevent, b: Subevent) => {
        if (typeof a.order === 'number' && typeof b.order === 'number') {
          return a.order - b.order;
        }
        if (typeof a.order === 'number') return -1;
        if (typeof b.order === 'number') return 1;
        // Fallback sort by time if order is not present
        const timeA = a.time.split(':').map(Number);
        const timeB = b.time.split(':').map(Number);
        if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
        return timeA[1] - timeB[1];
      })
    : [];

  return (
    <>
      {/* Enlarged Image Modal - Copied from EventDetails */}
      {enlargedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setEnlargedImage(null)}>
          <img
            src={enlargedImage}
            alt="Enlarged preview"
            className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl border-4 border-white"
            onClick={e => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
          <button
            className="absolute top-6 right-8 text-white text-3xl font-bold bg-black/60 rounded-full px-3 py-1 hover:bg-black/80 transition"
            onClick={() => setEnlargedImage(null)}
            aria-label="Close image preview"
          >
            &times;
          </button>
        </div>
      )}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative border border-primary-200/40 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white/80"
      >
        <div className="flex flex-col max-[750px]:pb-3 max-[550px]:pb-[18px] lg:flex-row">
          <div
            className="h-48 lg:h-auto lg:w-48 flex-none bg-cover bg-center text-center overflow-hidden"
            style={{ backgroundImage: `url('${event.image}')` }}
            title={event.title}
          ></div>
          <div className="pt-4 px-4 flex flex-col justify-between leading-normal flex-grow">
            <div className="mb-4 lg:mb-8">
              <p className="text-sm text-gray-600 flex items-center mb-1">
                <svg className="fill-current text-gray-500 w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
                </svg>
                {event.audience}
              </p>
              <div className="text-primary-900 font-bold text-xl mb-2">{event.title}</div>
              <p className="text-primary-700 text-base">{event.description.split('\n')[0]}</p>
            </div>
            <div className={`flex flex-row ${event.register ? 'max-[540px]:flex-col' : 'max-[430px]:flex-col'} items-start justify-between gap-4`}>
              <div className="flex items-center">
                <Image className="rounded-full mr-1" src="/logo.png" alt="GMC Logo" width={48} height={48} />
                <div className="text-sm">
                  <p className="text-primary-900 leading-none">GMC Team</p>
                  <p className="text-gray-600">{event.date}</p>
                </div>
              </div>
              <div className={`flex gap-2 flex-shrink-0 w-auto ${event.register ? 'max-[540px]:w-full max-[540px]:justify-center' : 'max-[430px]:w-full max-[430px]:justify-center'} max-[350px]:flex-col max-[350px]:w-full`}>
                <Link href={`/events/${event.slug}`}><button className="max-w-[120px] max-[350px]:max-w-full w-full bg-primary-500 hover:bg-primary-600 text-white font-bold px-4 py-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none">Details</button></Link>
                {event.register && (
                  <Link href={event.registrationLink || 'register'}><button className="max-w-[120px] max-[350px]:max-w-full w-full bg-secondary hover:bg-secondary/80 text-white font-bold px-4 py-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none">Register</button></Link>
                )}
                <button
                  className="relative max-w-[120px] max-[350px]:max-w-full w-full bg-primary text-white font-bold px-4 py-2 rounded-lg shadow-sm border border-primary-400 hover:bg-primary-500 transition-all duration-200 focus:outline-none"
                  onClick={onShare}
                  title="Copy event link"
                >
                  Share
                  {copied && (
                    <span className="absolute -top-4 -left-[14px] ml-2 -translate-y-1/2 text-xs text-primary bg-white px-2 py-1 rounded shadow animate-bounce whitespace-nowrap z-10">Link Copied!</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Segment Toggle Button - Made circular */}
        {hasSegments && (
          <div className="absolute -bottom-0 left-1/2 z-40 transform -translate-x-1/2 translate-y-1/2">
            <button
              onClick={() => setShowSegments(!showSegments)}
              className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-md focus:outline-none transition-transform duration-300"
              aria-expanded={showSegments}
              aria-controls={`segments-${event.slug}`}
              title={showSegments ? 'Hide Segments' : 'Show Segments'}
            >
              {showSegments ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        )}

        {/* Segments Section - Layout adapted from EventDetails */}
        <AnimatePresence initial={false}>
        {hasSegments && showSegments && (
          <motion.div
            id={`segments-${event.slug}`}
            layout
            initial={{ opacity: 0, y: -16, marginTop: 0 }}
            animate={{ opacity: 1, y: 0, marginTop: '2rem' }}
            exit={{ opacity: 0, y: -16, marginTop: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden px-4 pb-4 relative"
          >
            {/* Connecting Line */}
            <div className="absolute top-0 left-1/2 w-px h-8 bg-primary-300 -translate-x-1/2 -translate-y-full"></div>

            <h3 className="text-xl font-bold text-primary-600 mb-4 text-center">Segments</h3>
            <div className="space-y-4">
              {sortedSubevents.map((segment: Subevent, index: number) => (
                // Use layout similar to EventDetails
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 border-l-4 border-primary-400 pl-4 py-3 bg-primary-50/60 rounded-lg shadow-sm"
                >
                  {segment.imageUrl && (
                    <div className="flex-shrink-0 flex justify-center items-center w-full sm:w-32 md:w-40">
                      <img
                        src={segment.imageUrl}
                        alt={segment.title}
                        width={160} // Adjusted size for card view
                        height={100}
                        className="object-cover rounded-md shadow border border-primary-100 bg-white max-h-28 w-full sm:w-32 md:w-40 cursor-zoom-in"
                        onClick={() => setEnlargedImage(segment.imageUrl || '')} // Enlarge on click
                      />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="font-semibold text-primary-700 text-base">{segment.time} - {segment.title}</p>
                    {segment.description && <p className="text-sm text-primary-600 mt-1">{segment.description}</p>}
                    {segment.speakers && segment.speakers.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-primary-700">Speakers:</p>
                        <ul className="list-disc list-inside text-xs text-primary-600 pl-1">
                          {(segment.speakers || []).map((speaker: Speaker, spkIndex: number) => (
                            <li key={spkIndex}>{speaker.name}{speaker.bio ? ` (${speaker.bio})` : ''}</li> // Include bio
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default EventCard;
