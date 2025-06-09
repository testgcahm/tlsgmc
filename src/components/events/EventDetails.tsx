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
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Image Enlarge Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f0104]/90 backdrop-blur-sm" 
          onClick={() => setEnlargedImage(null)}
        >
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

      {/* Main Event Details Container */}
      <div className="min-h-screen bg-[#f8f4f0]">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="bg-gradient-to-br from-[#0f0104] via-[#5d0505] to-[#825a56] py-20 px-4">
            <div className="max-w-6xl mx-auto">
              {/* Navigation */}
              <div className="flex items-center justify-between mb-12">
                <Link href="/events">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Events
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onShare}
                  className="relative flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg"
                >
                  {copied && (
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white text-[#5d0505] px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg"
                    >
                      Link Copied!
                    </motion.span>
                  )}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share Event
                </motion.button>
              </div>

              {/* Event Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {event.title}
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Event Content */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Event Image */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#5d0505]/20 to-[#825a56]/20 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                <img
                  src={event.image}
                  alt={event.title}
                  className="relative w-full h-96 object-cover rounded-2xl shadow-2xl border-4 border-white cursor-zoom-in transform group-hover:scale-105 transition-all duration-300"
                  onClick={() => setEnlargedImage(event.image)}
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#0f0104]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-[#5d0505] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Literary Event
                </div>
              </motion.div>

              {/* Event Information */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                {/* Quick Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-6 border-2 border-[#825a56]/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#5d0505] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                      </div>
                      <span className="font-semibold text-[#825a56]">Date</span>
                    </div>
                    <p className="text-[#0f0104] font-medium">{event.date}</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 border-2 border-[#825a56]/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#5d0505] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                      </div>
                      <span className="font-semibold text-[#825a56]">Time</span>
                    </div>
                    <p className="text-[#0f0104] font-medium">{event.time}</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 border-2 border-[#825a56]/20 shadow-lg hover:shadow-xl transition-all duration-300 group md:col-span-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#5d0505] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <LocationIcon className="w-5 h-5 fill-white" />
                      </div>
                      <span className="font-semibold text-[#825a56]">Venue</span>
                    </div>
                    <p className="text-[#0f0104] font-medium">{event.venue}</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gradient-to-br from-white to-[#f8f4f0] rounded-xl p-6 border-2 border-[#825a56]/20 shadow-lg">
                  <h3 className="text-xl font-bold text-[#825a56] mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-[#5d0505]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <circle cx="5" cy="7" r="2" />
                      <circle cx="5" cy="12" r="2" />
                      <circle cx="5" cy="17" r="2" />
                      <line x1="9" y1="7" x2="20" y2="7" />
                      <line x1="9" y1="12" x2="20" y2="12" />
                      <line x1="9" y1="17" x2="20" y2="17" />
                    </svg>
                    Activities & Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <span className="font-semibold text-[#5d0505]">Activities:</span>
                      <div className="mt-1 text-[#0f0104]" dangerouslySetInnerHTML={{ __html: sanitize(event.activities.replace(/\n/g, '<br />')) }} />
                    </div>
                    <div>
                      <span className="font-semibold text-[#5d0505]">Target Audience:</span>
                      <p className="mt-1 text-[#0f0104]">{event.audience}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Event Description */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-16"
            >
              <div className="bg-gradient-to-br from-[#0f0104] to-[#5d0505] rounded-2xl p-8 text-white shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                  About This Event
                </h2>
                <div className="prose prose-lg prose-invert max-w-none text-center leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: sanitize(event.description.replace(/\n/g, '<br />')) }} />
                </div>
              </div>
            </motion.div>            {/* Event Segments (Subevents) */}
            {event.subevents && event.subevents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-16"
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#825a56] mb-4">
                    Event Timeline
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#5d0505] to-transparent mx-auto"></div>
                </div>
                
                <div className="space-y-8">
                  {event.subevents.map((sub, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      className="relative"
                    >
                      <div className="bg-gradient-to-br from-white to-[#f8f4f0] rounded-2xl p-8 border-2 border-[#825a56]/20 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                        {/* Timeline indicator */}
                        <div className="absolute -left-4 top-8 w-8 h-8 bg-[#5d0505] rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row gap-6 items-start">
                          {/* Subevent Image */}
                          {sub.imageUrl && (
                            <div className="flex-shrink-0 lg:w-64">
                              <img
                                src={sub.imageUrl}
                                alt={sub.title}
                                className="w-full h-48 lg:h-40 object-cover rounded-xl shadow-lg border-2 border-[#825a56]/20 cursor-zoom-in transform group-hover:scale-105 transition-all duration-300"
                                onClick={() => setEnlargedImage(sub.imageUrl || '')}
                              />
                            </div>
                          )}
                          
                          {/* Subevent Content */}
                          <div className="flex-1 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <span className="bg-[#5d0505] text-white px-4 py-2 rounded-full text-sm font-semibold">
                                {sub.time}
                              </span>
                              <h3 className="text-xl md:text-2xl font-bold text-[#825a56]">
                                {sub.title}
                              </h3>
                            </div>
                            
                            {sub.description && (
                              <div
                                className="text-[#0f0104] leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: sanitize(sub.description.replace(/\n/g, '<br />')) }}
                              />
                            )}
                            
                            {/* Subevent Speakers */}
                            {sub.speakers && sub.speakers.length > 0 && (
                              <div className="bg-[#825a56]/10 rounded-xl p-4 border-l-4 border-[#5d0505]">
                                <h4 className="font-semibold text-[#5d0505] mb-3 flex items-center gap-2">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  Featured Speakers
                                </h4>
                                <div className="space-y-2">
                                  {sub.speakers.map((speaker, i) => (
                                    <div key={i} className="text-sm">
                                      <span className="font-medium text-[#0f0104]">{speaker.name}</span>
                                      {speaker.bio && (
                                        <span className="text-[#825a56] ml-2">— {speaker.bio}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Main Speakers Section */}
            {event.speakers && event.speakers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-16"
              >
                <div className="bg-gradient-to-br from-[#825a56] to-[#5d0505] rounded-2xl p-8 text-white shadow-2xl">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                      Featured Speakers
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto"></div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {event.speakers.map((speaker, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {speaker.name}
                            </h3>
                            {speaker.bio && (
                              <p className="text-white/80 text-sm leading-relaxed">
                                {speaker.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Registration Section */}
            {event.register && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="mt-16 text-center"
              >
                <div className="bg-gradient-to-br from-[#f8f4f0] to-white rounded-2xl p-8 border-2 border-[#825a56]/20 shadow-xl">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#825a56] mb-4">
                    Ready to Join Us?
                  </h2>
                  <p className="text-[#0f0104] mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                    Don't miss this incredible literary event. Reserve your spot now and be part of our vibrant community.
                  </p>
                  
                  <Link href={event.registrationLink || '/register'}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-[#5d0505] to-[#825a56] hover:from-[#0f0104] hover:to-[#5d0505] text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg transform hover:-translate-y-1"
                    >
                      Register for {event.title}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default EventDetails;