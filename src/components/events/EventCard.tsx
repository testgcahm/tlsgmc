'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { EventData, Subevent, Speaker } from './types';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Calendar, MapPin, Users, Clock } from 'lucide-react';

interface EventCardProps {
  event: EventData;
}

const EventCard = ({ event }: EventCardProps) => {
  const [copied, setCopied] = useState(false);
  const [showSegments, setShowSegments] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const onShare = async () => {
    const url = `${window.location.origin}/events/${event.slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasSegments = event.subevents && event.subevents.length > 0;
  const sortedSubevents = hasSegments
    ? [...(event.subevents || [])].sort((a: Subevent, b: Subevent) => {
        if (typeof a.order === 'number' && typeof b.order === 'number') {
          return a.order - b.order;
        }
        if (typeof a.order === 'number') return -1;
        if (typeof b.order === 'number') return 1;
        const timeA = a.time.split(':').map(Number);
        const timeB = b.time.split(':').map(Number);
        if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
        return timeA[1] - timeB[1];
      })
    : [];

  return (
    <div className="relative bg-white rounded-3xl shadow-2xl border border-[#e5d3c6] overflow-hidden group transition-all duration-300 hover:shadow-3xl hover:border-[#5d0505]/40">
      {/* Event Image Section */}
      <div className="relative h-56 w-full cursor-pointer group-hover:scale-105 transition-transform duration-500" onClick={() => setEnlargedImage(event.image)}>
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover object-center rounded-t-3xl"
          priority
        />
        <div className="absolute top-4 left-4 bg-[#5d0505] text-white px-4 py-1 rounded-full text-xs font-bold shadow-md">
          Literary Event
        </div>
      </div>

      {/* Modal for Enlarged Image */}
      {enlargedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur" onClick={() => setEnlargedImage(null)}>
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={enlargedImage}
              alt="Enlarged preview"
              className="max-w-full max-h-full rounded-2xl shadow-2xl border-4 border-[#825a56]"
              onClick={e => e.stopPropagation()}
            />
            <button
              className="absolute -top-4 -right-4 text-white text-2xl font-bold bg-[#5d0505] hover:bg-[#825a56] rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 shadow-lg"
              onClick={() => setEnlargedImage(null)}
              aria-label="Close image preview"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Event Content Section */}
      <div className="p-6 flex flex-col gap-4">
        {/* Title & Description */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#0f0104] mb-1 group-hover:text-[#5d0505] transition-colors duration-300">
            {event.title}
          </h2>
          <p className="text-[#825a56] text-base line-clamp-2 mb-2">
            {event.description.split('\n')[0]}
          </p>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-2 gap-3 text-[#825a56] text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#5d0505]" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#5d0505]" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#5d0505]" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#5d0505]" />
            <span>{event.audience}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link href={`/events/${event.slug}`} className="flex-1">
            <button className="w-full px-5 py-2 bg-gradient-to-r from-[#5d0505] to-[#825a56] hover:from-[#0f0104] hover:to-[#5d0505] text-white font-semibold rounded-xl shadow-lg transition-all duration-300">
              View Details
            </button>
          </Link>
          {event.register && (
            <Link href={event.registrationLink || '/register'} className="flex-1">
              <button className="w-full px-5 py-2 bg-white hover:bg-[#f8f4f0] text-[#5d0505] font-semibold rounded-xl border-2 border-[#5d0505] shadow-lg transition-all duration-300">
                Register
              </button>
            </Link>
          )}
          <button
            className="flex-1 px-5 py-2 bg-[#825a56] hover:bg-[#5d0505] text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
            onClick={onShare}
            title="Share event"
          >
            {copied ? (
              <span className="flex items-center gap-2">
                <span className="text-sm">✓</span>
                Copied!
              </span>
            ) : (
              <span className="text-sm">Share</span>
            )}
          </button>
        </div>
      </div>

      {/* Segments Toggle */}
      {hasSegments && (
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setShowSegments(!showSegments)}
            className="p-2 bg-gradient-to-r from-[#5d0505] to-[#825a56] hover:from-[#0f0104] hover:to-[#5d0505] text-white rounded-full shadow-lg focus:outline-none transition-all duration-300"
            aria-expanded={showSegments}
            aria-controls={`segments-${event.slug}`}
            title={showSegments ? 'Hide Segments' : 'Show Segments'}
          >
            {showSegments ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      )}

      {/* Segments Section */}
      <AnimatePresence initial={false}>
        {hasSegments && showSegments && (
          <motion.div
            id={`segments-${event.slug}`}
            layout
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden bg-gradient-to-r from-[#f8f4f0] to-[#e8e0d8] border-t border-[#825a56]/20 rounded-b-3xl"
          >
            <div className="p-5">
              <h4 className="text-xl font-bold text-[#0f0104] mb-4 text-center">
                Event Segments
              </h4>
              <div className="grid gap-3">
                {sortedSubevents.map((segment: Subevent, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="bg-white/80 rounded-xl p-3 border border-[#825a56]/10 hover:border-[#5d0505]/40 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex-1">
                        <h5 className="font-semibold text-[#0f0104] text-base mb-1">
                          {segment.title}
                        </h5>
                        <p className="text-[#825a56] text-xs mb-1">
                          {segment.description}
                        </p>
                        {segment.speakers && segment.speakers.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {segment.speakers.map((speaker: Speaker, speakerIndex: number) => (
                              <span
                                key={speakerIndex}
                                className="px-2 py-0.5 bg-[#5d0505]/10 text-[#5d0505] text-xs rounded-full font-medium"
                              >
                                {speaker.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[#5d0505] font-semibold">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">{segment.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer/Branding */}
      <div className="flex items-center gap-3 px-6 py-4 border-t border-[#e5d3c6] bg-[#f8f4f0] rounded-b-3xl">
        <Image
          className="rounded-full border-2 border-[#5d0505] shadow-md"
          src="/logo.png"
          alt="TLSGMC Logo"
          width={40}
          height={40}
        />
        <div>
          <p className="font-semibold text-[#0f0104] text-sm">TLSGMC Team</p>
          <p className="text-xs text-[#825a56]">Literary Society</p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;