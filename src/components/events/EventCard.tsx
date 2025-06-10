'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useCallback, useMemo } from 'react';
import { EventData, Subevent, Speaker } from './types';
import Link from 'next/link';
import {
  ChevronDown,
  Share2,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  X,
  Sparkles
} from 'lucide-react';

interface EventCardProps {
  event: EventData;
  priority?: boolean;
  onImageLoad?: () => void;
}

const EventCard = ({ event, priority = false, onImageLoad }: EventCardProps) => {
  const [copied, setCopied] = useState(false);
  const [showSegments, setShowSegments] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  const onShare = useCallback(async () => {
    if (shareLoading) return;

    setShareLoading(true);
    try {
      const url = `${window.location.origin}/events/${event.slug}`;

      if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        await navigator.share({
          title: event.title,
          text: event.description.split('\n')[0],
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setShareLoading(false);
    }
  }, [event.slug, event.title, event.description, shareLoading]);

  const hasSegments = useMemo(() =>
    event.subevents && event.subevents.length > 0,
    [event.subevents]
  );

  // Sort subevents by order if available
  const sortedSubevents = useMemo(() => {
    if (!hasSegments) return [];

    return [...(event.subevents || [])].sort((a: Subevent, b: Subevent) => {
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
    });
  }, [hasSegments, event.subevents]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    onImageLoad?.();
  }, [onImageLoad]);

  const closeEnlargedImage = useCallback(() => {
    setEnlargedImage(null);
  }, []);

  const toggleSegments = useCallback(() => {
    setShowSegments(prev => !prev);
  }, []); return (
    <>
      {/* Enhanced Image Modal */}
      <AnimatePresence>
        {enlargedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/95 backdrop-blur-lg"
            onClick={() => setEnlargedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="abdolute max-w-[95vw] max-h-[95vh]"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={enlargedImage}
                alt="Enlarged preview"
                width={800}
                height={600}
                className="max-w-full max-h-full rounded-2xl shadow-2xl border-4 border-white/20 object-contain"
                priority
              />
              <button
                className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm text-secondary text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                onClick={() => setEnlargedImage(null)}
                aria-label="Close image preview"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Main Event Card */}
      <motion.article
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          duration: 0.6
        }}
        className="group relative"
      >
        {/* Main Content Container */}
        <div className="relative flex flex-col lg:flex-row min-h-[280px] bg-neutral rounded-3xl shadow-lg transition-all duration-500 overflow-hidden border border-accent/10 hover:border-accent/30">
          {/* Image Section */}
          <div className="relative lg:w-72 h-64 lg:h-auto overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-neutral-light animate-pulse flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-accent animate-spin" />
              </div>)}
            <Image
              src={event.image}
              alt={event.title}
              width={288}
              height={256}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              onLoad={handleImageLoad}
              priority={priority}
            />

            {/* Image Overlay with Event Type */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                {event.audience}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
            {/* Header */}
            <div className="space-y-4">
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl lg:text-3xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors duration-300"
                >
                  {event.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-logo-dark text-base lg:text-lg leading-relaxed"
                >
                  {event.description.split('\n')[0]}
                </motion.p>
              </div>

              {/* Event Meta */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 text-sm text-logo-brown"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span className="font-medium">{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    className="rounded-full ring-2 ring-accent/20"
                    src="/logo.png"
                    alt="GMC Logo"
                    width={24}
                    height={24}
                  />
                  <span>GMC Team</span>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 mt-6"
            >              <Link href={`/events/${event.slug}`} className="flex-1 min-w-[120px]">
                <button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Details
                </button>
              </Link>

              {event.register && (
                <Link href={event.registrationLink || 'register'} className="flex-1 min-w-[120px]">
                  <button className="w-full bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
                    Register
                  </button>
                </Link>
              )}

              <button
                onClick={onShare}
                disabled={shareLoading}
                className="relative bg-logo-red hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                title="Share event"
              >
                <Share2 className={`h-4 w-4 ${shareLoading ? 'animate-spin' : ''}`} />
                Share
                <AnimatePresence>
                  {copied && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap font-medium"
                    >
                      Link Copied! ✓
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          </div>
        </div>
        {/* Enhanced Segment Toggle Button */}
        {hasSegments && (
          <div className="absolute -bottom-6 left-1/2 z-50 transform -translate-x-1/2">            <motion.button
            onClick={toggleSegments}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="group/toggle relative p-3 bg-accent hover:bg-accent-dark text-white rounded-2xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all duration-300"
            aria-expanded={showSegments}
            aria-controls={`segments-${event.slug}`}
            title={showSegments ? 'Hide Segments' : 'Show Segments'}
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: showSegments ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
              <span className="text-sm font-medium hidden sm:inline">
                {showSegments ? 'Hide' : 'Show'} Segments
              </span>
            </div>
          </motion.button>
          </div>
        )}

        {/* Enhanced Segments Section */}
        <AnimatePresence initial={false}>
          {hasSegments && showSegments && (
            <motion.section
              id={`segments-${event.slug}`}
              layout
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: '3rem' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0.0, 0.2, 1],
                height: { duration: 0.6 }
              }}
              className="overflow-hidden relative bg-neutral-light"
            >
              {/* Decorative connecting line */}
              <div className="absolute top-0 left-1/2 w-1 h-12 bg-accent -translate-x-1/2 -translate-y-full rounded-full" />

              <div className="relative px-6 max-[650px]:px-1 pb-8 pt-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <h3 className="text-2xl lg:text-3xl font-bold text-secondary mb-2 flex items-center justify-center gap-3 max-[650px]:gap-1">
                    <Clock className="h-6 w-6 text-accent" />
                    Event Timeline
                  </h3>
                  <p className="text-logo-brown">Discover what's planned for this event</p>
                </motion.div>

                <div className="max-w-4xl mx-auto space-y-6">
                  {sortedSubevents.map((segment: Subevent, index: number) => (
                    <motion.div
                      key={`${segment.title}-${index}`}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.1 * index + 0.3,
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                      className="group/segment relative"
                    >                      
                    <div className="flex flex-col lg:flex-row gap-6 p-6 max-[650px]:p-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 border border-accent/10 hover:border-accent/30">

                        {/* Segment image */}
                        {segment.imageUrl && (<motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex-shrink-0 lg:w-48"
                        >
                          <Image
                            src={segment.imageUrl}
                            alt={segment.title}
                            width={192}
                            height={112}
                            className="w-full h-32 lg:h-28 object-cover rounded-xl shadow-md cursor-zoom-in border border-accent/20 hover:border-accent/40 transition-all duration-300"
                            onClick={() => setEnlargedImage(segment.imageUrl || '')}
                          />
                        </motion.div>
                        )}

                        {/* Segment content */}
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h4 className="text-xl font-bold text-secondary group-hover/segment:text-primary transition-colors">
                              {segment.title}
                            </h4>
                            <div className="flex items-center gap-2 text-accent font-semibold bg-accent/10 px-3 py-1 rounded-full text-sm">
                              <Clock className="h-4 w-4" />
                              {segment.time}
                            </div>
                          </div>

                          {segment.description && (
                            <p className="text-logo-dark leading-relaxed">
                              {segment.description}
                            </p>
                          )}

                          {segment.speakers && segment.speakers.length > 0 && (
                            <div className="bg-neutral/50 rounded-xl p-4 border border-accent/10">
                              <p className="text-sm font-bold text-logo-red mb-2 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Featured Speakers:
                              </p>
                              <div className="grid gap-2">
                                {(segment.speakers || []).map((speaker: Speaker, spkIndex: number) => (
                                  <motion.div
                                    key={spkIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * spkIndex }}
                                    className="flex items-start gap-3 p-2 rounded-lg bg-white/50"
                                  >
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                                    <div>
                                      <p className="font-semibold text-secondary text-sm">
                                        {speaker.name}
                                      </p>
                                      {speaker.bio && (
                                        <p className="text-xs text-logo-brown mt-1">
                                          {speaker.bio}
                                        </p>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </motion.article>
    </>
  );
};

export default EventCard;