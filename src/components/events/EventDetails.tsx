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
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f0] to-[#e8e0d8] py-10 px-4">
      {/* Enlarged Image Modal */}
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

      {/* Header Section */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <Link href="/events">
            <button className="flex items-center gap-2 px-5 py-2 bg-[#5d0505] hover:bg-[#825a56] text-white font-semibold rounded-xl shadow transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Events
            </button>
          </Link>
          <button
            onClick={onShare}
            className="flex items-center gap-2 px-5 py-2 bg-[#825a56] hover:bg-[#5d0505] text-white font-semibold rounded-xl shadow transition-all duration-300 relative"
          >
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-[#5d0505] px-3 py-1 rounded-lg text-sm font-medium shadow-lg">Copied!</span>
            )}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            Share Event
          </button>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#0f0104] text-center mb-2">{event.title}</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#5d0505] to-transparent mx-auto mb-6"></div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        {/* Event Image */}
        <div className="relative group cursor-pointer" onClick={() => setEnlargedImage(event.image)}>
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-80 object-cover rounded-2xl shadow-xl border-4 border-[#825a56]/20 group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4 bg-[#5d0505] text-white px-4 py-1 rounded-full text-xs font-bold shadow-md">
            Literary Event
          </div>
        </div>

        {/* Event Info */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-[#825a56]/20 shadow">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-[#5d0505]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span className="font-semibold text-[#825a56]">Date</span>
              </div>
              <p className="text-[#0f0104] font-medium">{event.date}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#825a56]/20 shadow">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-[#5d0505]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span className="font-semibold text-[#825a56]">Time</span>
              </div>
              <p className="text-[#0f0104] font-medium">{event.time}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#825a56]/20 shadow col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <LocationIcon className="w-5 h-5 text-[#5d0505]" />
                <span className="font-semibold text-[#825a56]">Venue</span>
              </div>
              <p className="text-[#0f0104] font-medium">{event.venue}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-[#f8f4f0] rounded-xl p-4 border border-[#825a56]/20 shadow">
            <h3 className="text-lg font-bold text-[#825a56] mb-2">Activities & Details</h3>
            <div className="mb-2">
              <span className="font-semibold text-[#5d0505]">Activities:</span>
              <div className="mt-1 text-[#0f0104]" dangerouslySetInnerHTML={{ __html: sanitize(event.activities.replace(/\n/g, '<br />')) }} />
            </div>
            <div>
              <span className="font-semibold text-[#5d0505]">Target Audience:</span>
              <p className="mt-1 text-[#0f0104]">{event.audience}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="max-w-4xl mx-auto mt-14">
        <div className="bg-gradient-to-br from-[#0f0104] to-[#5d0505] rounded-2xl p-8 text-white shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">About This Event</h2>
          <div className="prose prose-lg prose-invert max-w-none text-center leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: sanitize(event.description.replace(/\n/g, '<br />')) }} />
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      {event.subevents && event.subevents.length > 0 && (
        <div className="max-w-4xl mx-auto mt-14">
          <h2 className="text-2xl md:text-3xl font-bold text-[#825a56] mb-6 text-center">Event Timeline</h2>
          <div className="space-y-8">
            {event.subevents.map((sub, idx) => (
              <div key={idx} className="bg-gradient-to-br from-white to-[#f8f4f0] rounded-2xl p-6 border border-[#825a56]/20 shadow group relative">
                <div className="absolute -left-4 top-8 w-8 h-8 bg-[#5d0505] rounded-full border-4 border-white shadow flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {sub.imageUrl && (
                    <div className="flex-shrink-0 md:w-48">
                      <img
                        src={sub.imageUrl}
                        alt={sub.title}
                        className="w-full h-32 object-cover rounded-xl shadow border border-[#825a56]/20 cursor-zoom-in group-hover:scale-105 transition-all duration-300"
                        onClick={() => setEnlargedImage(sub.imageUrl || '')}
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="bg-[#5d0505] text-white px-4 py-2 rounded-full text-xs font-semibold">{sub.time}</span>
                      <h3 className="text-lg md:text-xl font-bold text-[#825a56]">{sub.title}</h3>
                    </div>
                    {sub.description && (
                      <div className="text-[#0f0104] leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitize(sub.description.replace(/\n/g, '<br />')) }} />
                    )}
                    {sub.speakers && sub.speakers.length > 0 && (
                      <div className="bg-[#825a56]/10 rounded-xl p-3 border-l-4 border-[#5d0505] mt-2">
                        <h4 className="font-semibold text-[#5d0505] mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Featured Speakers
                        </h4>
                        <div className="space-y-1">
                          {sub.speakers.map((speaker, i) => (
                            <div key={i} className="text-xs">
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
            ))}
          </div>
        </div>
      )}

      {/* Main Speakers Section */}
      {event.speakers && event.speakers.length > 0 && (
        <div className="max-w-4xl mx-auto mt-14">
          <div className="bg-gradient-to-br from-[#825a56] to-[#5d0505] rounded-2xl p-8 text-white shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Featured Speakers</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {event.speakers.map((speaker, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{speaker.name}</h3>
                      {speaker.bio && (
                        <p className="text-white/80 text-sm leading-relaxed">{speaker.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Registration Section */}
      {event.register && (
        <div className="max-w-3xl mx-auto mt-14 text-center">
          <div className="bg-gradient-to-br from-[#f8f4f0] to-white rounded-2xl p-8 border border-[#825a56]/20 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-[#825a56] mb-4">Ready to Join Us?</h2>
            <p className="text-[#0f0104] mb-8 text-lg leading-relaxed max-w-2xl mx-auto">Don't miss this incredible literary event. Reserve your spot now and be part of our vibrant community.</p>
            <Link href={event.registrationLink || '/register'}>
              <button className="bg-gradient-to-r from-[#5d0505] to-[#825a56] hover:from-[#0f0104] hover:to-[#5d0505] text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg transform hover:-translate-y-1">
                Register for {event.title}
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;