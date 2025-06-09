'use client';

import { motion } from 'framer-motion';
import { LocationIcon } from '../footer/FooterIcons';
import { useState, useEffect, useRef } from 'react';
import { EventData } from './types';
import Link from 'next/link';

interface EventDetailsProps {
  event: EventData;
}

const EventDetails = ({ event }: EventDetailsProps) => {
  const [copied, setCopied] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const domPurifyRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('dompurify').then((mod) => {
        domPurifyRef.current = mod.default || mod;
      });
    }
  }, []);

  const sanitize = (input: string) => {
    if (domPurifyRef.current && typeof domPurifyRef.current.sanitize === 'function') {
      return domPurifyRef.current.sanitize(input);
    }
    return input;
  };

  const onShare = async () => {
    const url = `${window.location.origin}/events/${event.slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      {enlargedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setEnlargedImage(null)}>
          <img
            src={enlargedImage}
            alt="Enlarged preview"
            className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl border-4 border-white"
            onClick={e => e.stopPropagation()}
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
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="min-h-[85vh] text-primary p-0 flex flex-col mx-3 md:mx-8 mb-8"
      >
        <div className="flex items-center justify-between w-full">
          <Link href='/events'><button
            className="m-4 sm:m-6 md:m-8 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm md:text-base font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 self-start transition-all duration-300 flex items-center gap-2 border border-primary-400 hover:translate-x-[-5px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Events
          </button>
          </Link>
          {/* Share button in row with Back to Events */}
          <button
            className="m-4 sm:m-6 md:m-8 px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary-500 border border-primary-400 transition relative font-semibold shadow"
            onClick={onShare}
            title="Copy event link"
          >
            {copied && (
              <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 text-xs text-primary bg-white px-2 py-1 rounded shadow animate-bounce whitespace-nowrap z-10">Link Copied!</span>
            )}
            Share
          </button>
        </div>
        <h2 className="text-2xl max-[390px]:text-xl sm:text-3xl md:text-4xl font-bold text-primary-900 mb-4 mt-2 text-center w-full flex items-center justify-center">
          {event.title}
        </h2>
        <div className="flex flex-col min-[975px]:space-x-8 min-[975px]:flex-row min-[975px]:items-start items-center justify-center">
          <div className="mb-8 min-[975px]:mb-0 flex-col max-w-[500px] space-y-6 w-full flex items-center justify-center">
            <img
              src={event.image}
              alt={event.title}
              width={500}
              height={350}
              className="w-full min-[500px]:min-w-[400px] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-contain h-auto rounded-xl shadow border border-primary-100 bg-white cursor-zoom-in"
              onClick={() => setEnlargedImage(event.image)}
            />
          </div>
          <div className="w-full min-[975px]:min-w-[520px] min-[975px]:max-w-[750px] max-[975px]:max-w-[750px] border border-primary-300 p-8 max-[450px]:p-4 rounded-2xl shadow-[2px_2px_8px_2px_rgba(102,102,153,0.3)] flex flex-col gap-6 md:gap-8 bg-white">
            <section>
              <h3 className="font-semibold text-lg sm:text-xl md:text-2xl mb-3 md:mb-4 text-primary-900 border-b border-primary-200 pb-2 flex flex-col items-center">
                Event Information
              </h3>
              <ul className="list-none pl-0 space-y-3 md:space-y-4 text-gray-800 text-sm sm:text-base md:text-lg mb-3">
                <li className="flex flex-row max-[450px]:flex-col min-[450px]:items-center"><span className="flex-shrink-0 text-primary-500 font-semibold w-32 max-sm:w-28 flex items-center gap-1">{/* Calendar */}
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  Date:</span> <span className="max-[450px]:ml-5 text-blue-950 font-medium flex-1">{event.date}</span></li>
                <li className="flex flex-row max-[450px]:flex-col min-[450px]:items-center"><span className="flex-shrink-0 text-primary-500 font-semibold w-32 max-sm:w-28 flex items-center gap-1">{/* Clock */}
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  Time:</span> <span className="max-[450px]:ml-5 text-blue-950 font-medium flex-1">{event.time}</span></li>
                <li className="flex flex-row max-[450px]:flex-col min-[450px]:items-center"><span className="flex-shrink-0 text-primary-500 font-semibold w-32 max-sm:w-28 flex items-center gap-1">{/* Location */}
                  <LocationIcon className="w-5 h-5 fill-primary-400" />
                  Venue:</span> <span className="max-[450px]:ml-5 text-blue-950 font-medium flex-1">{event.venue}</span></li>
                <li className="flex flex-row max-[450px]:flex-col min-[450px]:items-center"><span className="flex-shrink-0 text-primary-500 font-semibold w-32 max-sm:w-28 flex items-center gap-1">{/* List/Activities */}
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="5" cy="7" r="2" /><circle cx="5" cy="12" r="2" /><circle cx="5" cy="17" r="2" /><line x1="9" y1="7" x2="20" y2="7" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="17" x2="20" y2="17" /></svg>
                  Activities:</span> <span className="max-[450px]:ml-5 text-blue-950 font-medium flex-1" dangerouslySetInnerHTML={{ __html: sanitize(event.activities.replace(/\n/g, '<br />')) }} /></li>
                <li className="flex flex-row max-[450px]:flex-col min-[450px]:items-center"><span className="flex-shrink-0 text-primary-500 font-semibold w-32 max-sm:w-28 flex items-center gap-1">{/* Users/Audience */}
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  Audience:</span> <span className="max-[450px]:ml-5 text-blue-950 font-medium flex-1">{event.audience}</span></li>
              </ul>
              <div className="bg-[#ededffc5] border border-primary-200 rounded-lg p-4 mt-3 md:mt-4 text-gray-800 text-base sm:text-lg leading-relaxed shadow-sm">
                <span className="block font-medium text-primary-700 mb-2 border-b border-primary-200 pb-2">Description:</span>
                <span dangerouslySetInnerHTML={{ __html: sanitize(event.description.replace(/\n/g, '<br />')) }} />
              </div>
            </section>
            {/* Subevents Section */}
            {event.subevents && event.subevents.length > 0 && (
              <section>
                <h3 className="font-semibold text-lg sm:text-xl md:text-2xl mb-3 md:mb-4 text-primary-800 border-b border-primary-200 pb-2">Event Segments</h3>
                <div className="space-y-6 mt-4">
                  {event.subevents?.map((sub, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center gap-4 border-l-4 border-primary-400 pl-4 py-4 bg-primary-50 rounded-lg shadow-sm">
                      {sub.imageUrl && (
                        <div className="flex-shrink-0 flex justify-center items-center w-full md:w-48">
                          <img
                            src={sub.imageUrl}
                            alt={sub.title}
                            className="object-cover rounded-xl shadow border border-primary-100 bg-white max-h-40 w-full md:w-48 md:h-40 cursor-zoom-in"
                            style={{ maxWidth: '192px', minHeight: '120px', background: '#fff' }}
                            onClick={() => setEnlargedImage(sub.imageUrl || '')}
                          />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="font-bold text-primary-700 text-base md:text-lg mb-1">{sub.time} - {sub.title}</div>
                        {sub.description && (
                          <div
                            className="text-gray-700 mb-2 text-sm md:text-base"
                            dangerouslySetInnerHTML={{ __html: sanitize(sub.description.replace(/\n/g, '<br />')) }}
                          />
                        )}
                        {sub.speakers && sub.speakers.length > 0 && (
                          <div className="mt-2">
                            <span className="font-semibold text-secondary">Speakers:</span>
                            <ul className="list-disc ml-5">
                              {sub.speakers?.map((sp, i) => (
                                <li key={i}><span className="font-medium">{sp.name}</span>{sp.bio && ` — ${sp.bio}`}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {/* Speakers Section */}
            {event.speakers && event.speakers.length > 0 && (
              <section>
                <h3 className="font-semibold text-lg sm:text-xl md:text-2xl mb-3 md:mb-4 text-secondary-800 border-b border-primary-200 pb-2">Speakers</h3>
                <div className="space-y-4 md:space-y-5 mt-4">
                  {event.speakers.map((speaker: { name: string; bio?: string }, idx: number) => (
                    <div key={idx}>
                      <span className="font-semibold text-base sm:text-lg text-secondary">{speaker.name}</span>
                      <p className="text-gray-700 text-sm sm:text-base mt-1">{speaker.bio}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {event.register && (
              <div className="flex justify-center mt-4 md:mt-6">
                <Link href={event.registrationLink || '/register'}>
                  <button className="bg-secondary hover:bg-secondary/90 text-white font-bold px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary/50 text-sm sm:text-base md:text-lg">Register for {event.title}</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
};

export default EventDetails;