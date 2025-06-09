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
      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f0104]/90 backdrop-blur-sm" onClick={() => setEnlargedImage(null)}>
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

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative bg-gradient-to-br from-white to-[#f8f4f0] rounded-2xl shadow-xl border-2 border-[#825a56]/20 hover:border-[#5d0505]/40 transition-all duration-300 hover:shadow-2xl overflow-hidden group"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Event Image */}
          <div className="relative overflow-hidden lg:w-80 h-64 lg:h-auto">
            <div 
              className="w-full h-full bg-cover bg-center cursor-zoom-in transform group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: `url('${event.image}')` }}
              onClick={() => setEnlargedImage(event.image)}
              title="Click to enlarge"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0104]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            {/* Event Type Badge */}
            <div className="absolute top-4 left-4 bg-[#5d0505] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              Literary Event
            </div>
          </div>

          {/* Event Content */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Event Title */}
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-[#0f0104] mb-2 group-hover:text-[#5d0505] transition-colors duration-300">
                  {event.title}
                </h3>
                <p className="text-[#825a56] text-lg leading-relaxed line-clamp-2">
                  {event.description.split('\n')[0]}
                </p>
              </div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                <div className="flex items-center gap-3 text-[#825a56]">
                  <Calendar className="w-5 h-5 text-[#5d0505]" />
                  <span className="font-medium">{event.date}</span>
                </div>
                <div className="flex items-center gap-3 text-[#825a56]">
                  <Clock className="w-5 h-5 text-[#5d0505]" />
                  <span className="font-medium">{event.time}</span>
                </div>
                <div className="flex items-center gap-3 text-[#825a56]">
                  <MapPin className="w-5 h-5 text-[#5d0505]" />
                  <span className="font-medium">{event.venue}</span>
                </div>
                <div className="flex items-center gap-3 text-[#825a56]">
                  <Users className="w-5 h-5 text-[#5d0505]" />
                  <span className="font-medium">{event.audience}</span>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-[#825a56]/20">
              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image 
                    className="rounded-full border-2 border-[#5d0505] shadow-md" 
                    src="/logo.png" 
                    alt="TLSGMC Logo" 
                    width={48} 
                    height={48} 
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#5d0505] border-2 border-white"></div>
                </div>
                <div>
                  <p className="font-semibold text-[#0f0104]">TLSGMC Team</p>
                  <p className="text-sm text-[#825a56]">Literary Society</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full sm:w-auto">
                <Link href={`/events/${event.slug}`} className="flex-1 sm:flex-none">
                  <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#5d0505] to-[#825a56] hover:from-[#0f0104] hover:to-[#5d0505] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    View Details
                  </button>
                </Link>
                
                {event.register && (
                  <Link href={event.registrationLink || '/register'} className="flex-1 sm:flex-none">
                    <button className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-[#f8f4f0] text-[#5d0505] font-semibold rounded-xl border-2 border-[#5d0505] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      Register
                    </button>
                  </Link>
                )}
                
                <button
                  className="relative px-4 py-3 bg-[#825a56] hover:bg-[#5d0505] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
          </div>
        </div>

        {/* Segments Toggle Button */}
        {hasSegments && (
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <button
              onClick={() => setShowSegments(!showSegments)}
              className="p-3 bg-gradient-to-r from-[#5d0505] to-[#825a56] hover:from-[#0f0104] hover:to-[#5d0505] text-white rounded-full shadow-lg hover:shadow-xl focus:outline-none transition-all duration-300 transform hover:scale-110"
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

        {/* Segments Section */}
        <AnimatePresence initial={false}>
          {hasSegments && showSegments && (
            <motion.div
              id={`segments-${event.slug}`}
              layout
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: '2rem' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden bg-gradient-to-r from-[#f8f4f0] to-[#e8e0d8] border-t-2 border-[#825a56]/20"
            >
              {/* Connecting Line */}
              <div className="absolute top-0 left-1/2 w-1 h-6 bg-[#5d0505] -translate-x-1/2 -translate-y-full rounded-full"></div>

              <div className="p-6 lg:p-8">
                <h4 className="text-2xl font-bold text-[#0f0104] mb-6 text-center">
                  Event Segments
                </h4>
                <div className="grid gap-4">
                  {sortedSubevents.map((segment: Subevent, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-[#825a56]/20 hover:border-[#5d0505]/40 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <h5 className="font-semibold text-[#0f0104] text-lg mb-1">
                            {segment.title}
                          </h5>
                          <p className="text-[#825a56] text-sm mb-2">
                            {segment.description}
                          </p>
                          {segment.speakers && segment.speakers.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {segment.speakers.map((speaker: Speaker, speakerIndex: number) => (
                                <span 
                                  key={speakerIndex}
                                  className="px-2 py-1 bg-[#5d0505]/10 text-[#5d0505] text-xs rounded-full font-medium"
                                >
                                  {speaker.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[#5d0505] font-semibold">
                          <Clock className="w-4 h-4" />
                          <span>{segment.time}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-[#825a56]/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-4 left-4 w-2 h-2 bg-[#5d0505]/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </motion.div>
    </>
  );
};

export default EventCard;