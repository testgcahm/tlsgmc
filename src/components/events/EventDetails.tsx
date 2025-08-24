'use client';

import { motion } from 'framer-motion';
import { LocationIcon } from '../footer/FooterIcons';
import { useState, useEffect, useRef } from 'react';
import { EventData } from './types';
import Link from 'next/link';
import Image from 'next/image';

interface EventDetailsProps {
  event: EventData;
}

// Component for Event Information Card
const EventInfoCard = ({ event, sanitize }: { event: EventData; sanitize: (input: string) => string }) => (<div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-neutral-dark/20 p-6 max-[475px]:p-4 hover:shadow-2xl transition-all duration-300">
  <div className="flex items-center gap-3 mb-6 max-[475px]:mb-4">
    <div className="bg-gradient-to-br from-accent to-accent-dark p-3 max-[475px]:p-2 rounded-xl shadow-lg">
      <svg className="w-6 h-6 max-[475px]:w-5 max-[475px]:h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-2xl max-[600px]:text-xl max-[475px]:text-lg font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent break-normal">
      Event Details
    </h3>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-[475px]:gap-1 mb-4 max-[475px]:mb-3">
    <motion.div
      className="bg-gradient-to-br from-neutral to-neutral-light p-3 max-[475px]:p-2 rounded-xl border border-neutral-dark/20 shadow-sm"
    >
      <div className="flex items-center gap-3 max-[475px]:gap-2">
        <div className="bg-gradient-to-br from-primary to-primary-light p-2 max-[475px]:p-1.5 rounded-xl shadow-md">
          <svg className="w-5 h-5 max-[475px]:w-4 max-[475px]:h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </div>
        <div>
          <span className="text-sm max-[600px]:text-xs max-[475px]:text-xs font-medium text-primary-light/80 uppercase tracking-wider break-normal">Date</span>
          <p className="text-lg max-[600px]:text-base max-[475px]:text-sm font-bold text-primary break-normal">{event.date}</p>
        </div>
      </div>
    </motion.div>
    <motion.div
      className="bg-gradient-to-br from-neutral to-neutral-light p-3 max-[475px]:p-2 rounded-xl border border-neutral-dark/20 shadow-sm"
    >
      <div className="flex items-center gap-3 max-[475px]:gap-2">
        <div className="bg-gradient-to-br from-accent to-accent-dark p-2 max-[475px]:p-1.5 rounded-xl shadow-md">
          <svg className="w-5 h-5 max-[475px]:w-4 max-[475px]:h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <div>
          <span className="text-sm max-[600px]:text-xs max-[475px]:text-xs font-medium text-primary-light/80 uppercase tracking-wider break-normal">Time</span>
          <p className="text-lg max-[600px]:text-base max-[475px]:text-sm font-bold text-primary break-normal">{event.time}</p>
        </div>
      </div>
    </motion.div>
    <motion.div
      className="bg-gradient-to-br from-neutral to-neutral-light p-3 max-[475px]:p-2 rounded-xl border border-neutral-dark/20 shadow-sm"
    >
      <div className="flex items-center gap-3 max-[475px]:gap-2">
        <div className="bg-gradient-to-br from-gold to-gold/80 p-2 max-[475px]:p-1.5 rounded-xl shadow-md">
          <LocationIcon className="w-5 h-5 max-[475px]:w-4 max-[475px]:h-4 fill-white" />
        </div>
        <div>
          <span className="text-sm max-[600px]:text-xs max-[475px]:text-xs font-medium text-primary-light/80 uppercase tracking-wider break-normal">Venue</span>
          <p className="text-lg max-[600px]:text-base max-[475px]:text-sm font-bold text-primary break-normal">{event.venue}</p>
        </div>
      </div>
    </motion.div>
    <motion.div
      className="bg-gradient-to-br from-neutral to-neutral-light p-3 max-[475px]:p-2 rounded-xl border border-neutral-dark/20 shadow-sm"
    >
      <div className="flex items-center gap-3 max-[475px]:gap-2">
        <div className="bg-gradient-to-br from-logo-red to-logo-dark p-2 max-[475px]:p-1.5 rounded-xl shadow-md">
          <svg className="w-5 h-5 max-[475px]:w-4 max-[475px]:h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div>
          <span className="text-sm max-[600px]:text-xs max-[475px]:text-xs font-medium text-primary-light/80 uppercase tracking-wider break-normal">Audience</span>
          <p className="text-lg max-[600px]:text-base max-[475px]:text-sm font-bold text-primary break-normal">{event.audience}</p>
        </div>
      </div>
    </motion.div>
  </div>
  <div className="space-y-4 max-[475px]:space-y-3">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    ><div className="flex items-center gap-3 max-[475px]:gap-2 mb-2 max-[475px]:mb-1">
        <div className="bg-gradient-to-br from-accent to-accent-dark p-2.5 max-[475px]:p-2 rounded-lg shadow-md">
          <svg className="w-5 h-5 max-[475px]:w-4 max-[475px]:h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="5" cy="7" r="2" />
            <circle cx="5" cy="12" r="2" />
            <circle cx="5" cy="17" r="2" />
            <line x1="9" y1="7" x2="20" y2="7" />
            <line x1="9" y1="12" x2="20" y2="12" />
            <line x1="9" y1="17" x2="20" y2="17" />
          </svg>
        </div>
        <span className="text-xl max-[600px]:text-lg max-[475px]:text-base font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent break-normal">Activities</span>
      </div>
      <div className="bg-gradient-to-br from-neutral-light to-white border border-neutral-dark/20 rounded-xl p-3 max-[475px]:p-2 shadow-inner">
        <div className="text-primary-light max-[600px]:text-sm max-[500px]:text-sm leading-relaxed break-normal whitespace-pre-line" dangerouslySetInnerHTML={{ __html: sanitize(event.activities.replace(/\n/g, '<br />')) }} />
      </div>
    </motion.div><motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-3 max-[475px]:gap-2 mb-2 max-[475px]:mb-1">
        <div className="bg-gradient-to-br from-primary to-primary-light p-2.5 max-[475px]:p-2 rounded-lg shadow-md">
          <svg className="w-5 h-5 max-[475px]:w-4 max-[475px]:h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 12h6M9 16h6M9 8h6M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-xl max-[600px]:text-lg max-[475px]:text-base font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent break-normal">Description</span>
      </div>
      <div className="bg-gradient-to-br from-neutral-light to-white border border-neutral-dark/20 rounded-xl p-3 max-[475px]:p-2 shadow-inner">
        <div className="text-primary-light max-[600px]:text-sm max-[500px]:text-sm leading-relaxed break-normal whitespace-pre-line" dangerouslySetInnerHTML={{ __html: sanitize(event.description.replace(/\n/g, '<br />')) }} />
      </div>
    </motion.div>
  </div>
</div>
);

// Component for Event Segments
const EventSegments = ({ subevents, sanitize, setEnlargedImage }: {
  subevents: any[];
  sanitize: (input: string) => string;
  setEnlargedImage: (url: string) => void;
}) => (
  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-neutral-dark/20 p-6 max-[475px]:p-4 hover:shadow-2xl transition-all duration-300">
    <div className="flex items-center gap-3 max-[475px]:gap-2 mb-6 max-[475px]:mb-4">
      <div className="bg-gradient-to-br from-gold to-gold/80 p-3 max-[475px]:p-2 rounded-xl shadow-lg">
        <svg className="w-6 h-6 max-[475px]:w-5 max-[475px]:h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
      <h3 className="text-2xl max-[600px]:text-xl max-[475px]:text-lg font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent break-normal">
        Event Segments
      </h3>
    </div>
    <div className="space-y-4 max-[475px]:space-y-3">
      {subevents.map((sub, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-gradient-to-br from-neutral-light to-white border border-neutral-dark/20 rounded-2xl p-4 max-[475px]:p-3"        ><div className="flex flex-col lg:flex-row gap-4 max-[475px]:gap-3">
            {sub.imageUrl && (<div className="flex-shrink-0 group">
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src={sub.imageUrl}
                  alt={sub.title}
                  width={224}
                  height={192}
                  className="w-full lg:w-56 h-48 max-[475px]:h-36 object-cover cursor-zoom-in shadow-lg border border-neutral-dark/20"
                  onClick={() => setEnlargedImage(sub.imageUrl)}
                />
              </div>
            </div>
            )}
            <div className="flex-1 space-y-2 max-[475px]:space-y-1">
              <div className="flex items-center gap-3 max-[475px]:gap-2">
                <div className="bg-gradient-to-br from-accent to-accent-dark p-2 max-[475px]:p-1.5 rounded-lg shadow-md">
                  <svg className="w-4 h-4 max-[475px]:w-3 max-[475px]:h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <span className="text-sm max-[600px]:text-xs max-[475px]:text-xs font-bold text-accent bg-accent/10 px-3 max-[475px]:px-2 py-1 rounded-full break-normal">{sub.time}</span>
              </div>

              <h4 className="text-xl max-[600px]:text-lg max-[475px]:text-base font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent break-normal">
                {sub.title}
              </h4>
              {sub.description && (
                <div className="bg-gradient-to-br from-neutral to-neutral-light rounded-xl p-3 max-[475px]:p-2 border border-neutral-dark/20">
                  <div className="text-primary-light max-[600px]:text-sm max-[500px]:text-sm break-normal leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: sanitize(sub.description.replace(/\n/g, '<br />')) }} />
                </div>
              )}
            </div>
          </div>
          {sub.speakers && sub.speakers.length > 0 && (
            <div className="bg-white rounded-xl mt-3 max-[475px]:mt-2 p-3 max-[475px]:p-2 border border-neutral-dark/20 shadow-sm">
              <div className="flex items-center gap-2 max-[475px]:gap-1 mb-2 max-[475px]:mb-1">
                <div className="bg-gradient-to-br from-logo-red to-logo-dark p-1.5 max-[475px]:p-1 rounded-lg">
                  <svg className="w-4 h-4 max-[475px]:w-3 max-[475px]:h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                  </svg>
                </div>
                <span className="font-bold max-[600px]:text-sm max-[475px]:text-xs text-primary break-normal">Speakers</span>
              </div>
              <div className="space-y-2 max-[475px]:space-y-1">{sub.speakers.map((sp: any, i: number) => (
                <div key={i} className="bg-gradient-to-r from-neutral to-neutral-light p-2 max-[475px]:p-1.5 rounded-lg border border-neutral-dark/20">
                  <span className="font-bold max-[600px]:text-sm max-[500px]:text-sm text-primary block break-normal">{sp.name}</span>
                  {sp.bio && <span className="text-sm max-[600px]:text-xs max-[500px]:text-sm text-primary-light mt-1 block break-normal">{sp.bio}</span>}
                </div>
              ))}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  </div>
);

// Component for Speakers Section
const SpeakersSection = ({ speakers }: { speakers: any[] }) => (
  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-neutral-dark/20 p-6 max-[475px]:p-4 hover:shadow-2xl transition-all duration-300">
    <div className="flex items-center gap-3 max-[475px]:gap-2 mb-6 max-[475px]:mb-4">
      <div className="bg-gradient-to-br from-logo-red to-logo-dark p-3 max-[475px]:p-2 rounded-xl shadow-lg">
        <svg className="w-6 h-6 max-[475px]:w-5 max-[475px]:h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      </div>
      <h3 className="text-2xl max-[600px]:text-xl max-[475px]:text-lg font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent break-normal">
        Featured Speakers
      </h3>
    </div>    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-[475px]:gap-2">
      {speakers.map((speaker: { name: string; bio?: string }, idx: number) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="group bg-gradient-to-br from-neutral to-neutral-light rounded-xl p-3 max-[475px]:p-2 border border-neutral-dark/20 hover:shadow-lg transition-all duration-300"
        ><div className="flex items-start gap-3 max-[475px]:gap-2">
            <div className="bg-gradient-to-br from-primary to-primary-light p-2 max-[475px]:p-1.5 rounded-full shadow-md group-hover:shadow-lg transition-shadow">
              <svg className="w-5 h-5 max-[475px]:w-4 max-[475px]:h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-primary text-lg max-[600px]:text-base max-[500px]:text-base mb-1 max-[475px]:mb-0 break-normal">{speaker.name}</h4>
              {speaker.bio && (
                <p className="text-primary-light max-[600px]:text-sm max-[500px]:text-sm leading-relaxed break-normal">{speaker.bio}</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

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
  }; return (
    <>
      {/* Image Overlay Modal */}
      {enlargedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/95 backdrop-blur-lg overflow-auto p-4"
          onClick={() => setEnlargedImage(null)}
        >          <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative"
          onClick={e => e.stopPropagation()}
        >            <Image
              src={enlargedImage}
              alt="Enlarged preview"
              width={800}
              height={600}
              className="w-auto h-auto max-w-[95vw] max-h-[90vh] rounded-2xl shadow-2xl border-4 border-white/20 object-contain"
              priority
            />
            <button
              className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-secondary text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              onClick={() => setEnlargedImage(null)}
              aria-label="Close image preview"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-neutral">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-neutral-dark/20 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">            <div className="flex items-center justify-between">
            <Link href='/events'>
              <motion.button
                whileHover={{ x: -5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 max-[450px]:gap-2 px-6 max-[450px]:px-4 py-3 max-[450px]:py-2 bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-white rounded-xl font-bold max-[450px]:text-sm shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 max-[450px]:h-4 max-[450px]:w-4 group-hover:translate-x-[-2px] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Events</span>
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group px-6 max-[450px]:px-4 py-3 max-[450px]:py-2 bg-gradient-to-r from-accent to-accent-light hover:from-accent-light hover:to-accent text-white rounded-xl font-bold max-[450px]:text-sm shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={onShare}
              title="Copy event link"
            >
              {copied && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-sm text-white bg-secondary px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10"
                >
                  Link Copied!
                </motion.span>
              )}                <div className="flex items-center gap-2 max-[450px]:gap-1">
                <svg className="w-5 h-5 max-[450px]:w-4 max-[450px]:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Share</span>
              </div>
            </motion.button>
          </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary-light text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-2xl max-[600px]:text-xl min-[475px]:text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                {event.title}
              </h1>
              {/* <div className="flex flex-wrap items-center justify-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  {event.date}
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  {event.time}
                </div>
                <div className="flex items-center gap-2">
                  <LocationIcon className="w-5 h-5 fill-current" />
                  {event.venue}
                </div>
              </div> */}
            </motion.div>
          </div>
        </div>
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-2 min-[475px]:px-4 sm:px-6 lg:px-8 py-4 min-[475px]:py-8 lg:py-12">
          <div className="grid grid-cols-1 min-[1000px]:grid-cols-3 gap-y-8 min-[1000px]:gap-x-3 min-[1250px]:gap-x-8">
            {/* Event Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-1 sticky max-lg:flex justify-center lg:justify-start"
            >              <div className="sticky top-8 w-full max-w-md lg:max-w-none">
                <Image
                  src={event.image}
                  alt={event.title}
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-xl shadow-lg border border-neutral-dark bg-white cursor-zoom-in hover:shadow-xl transition-shadow"
                  onClick={() => setEnlargedImage(event.image)}
                  priority
                />

                {/* Registration Button */}
                {event.register && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6"
                  >
                    <Link href={event.registrationLink || '/register'}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }} className="w-full bg-accent hover:bg-accent-light text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base max-[600px]:text-sm"
                      >
                        <svg className="w-4 h-4 max-[600px]:w-3 max-[600px]:h-3 lg:w-5 lg:h-5 inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        Register for {event.title}
                      </motion.button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>            {/* Content Sections */}
            <div className="col-span-2 space-y-5">
              {/* Event Information */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <EventInfoCard event={event} sanitize={sanitize} />
              </motion.div>

              {/* Event Segments */}
              {event.subevents && event.subevents.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <EventSegments
                    subevents={event.subevents}
                    sanitize={sanitize}
                    setEnlargedImage={setEnlargedImage}
                  />
                </motion.div>
              )}

              {/* Speakers Section */}
              {event.speakers && event.speakers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <SpeakersSection speakers={event.speakers} />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;