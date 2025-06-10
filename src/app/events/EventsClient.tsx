'use client';

import { motion } from 'framer-motion';
import EventCard from '../../components/events/EventCard';
import { EventData } from '@/components/events/types';
import useInView from '@/components/useInView';

interface EventsClientProps {
  events: EventData[];
}

export default function EventsClient({ events }: EventsClientProps) {
  // Animation refs using the same pattern as AboutClient
  const [heroRef, heroInView] = useInView<HTMLElement>(0.1);
  const [eventsRef, eventsInView] = useInView<HTMLElement>(0.2);

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

  return (
    <div className="min-h-screen bg-[#f8f4f0]">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
      >
        <div className="bg-gradient-to-br from-[#0f0104] to-[#5d0505] min-h-[50vh] py-16 flex items-center justify-center px-4">
          <div className={`max-w-6xl mx-auto text-center transform transition-all duration-1000 ${heroInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}>
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Literary Events
              </h1>
              <div className="w-32 h-1 bg-[#825a56] mx-auto rounded-full mb-6"></div>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                Discover our curated collection of literary gatherings, poetry nights, and creative expressions
                that bring our community together through the power of words.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2 text-lg">
                <span className="w-2 h-2 rounded-full bg-[#825a56]"></span>
                Annual Mushairah
              </div>
              <div className="flex items-center gap-2 text-lg">
                <span className="w-2 h-2 rounded-full bg-[#825a56]"></span>
                Intercollegiate Lierary Competition
              </div>
              <div className="flex items-center gap-2 text-lg">
                <span className="w-2 h-2 rounded-full bg-[#825a56]"></span>
                Open Mic
              </div>
              <div className="flex items-center gap-2 text-lg">
                <span className="w-2 h-2 rounded-full bg-[#825a56]"></span>
                Talk show
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section
        ref={eventsRef}
        className="py-20 px-4 max-[650px]:px-2 bg-gradient-to-br from-[#f8f4f0] to-[#e8e0d8]"
      >
        <div className="max-w-7xl mx-auto">
          {sortedEvents.length === 0 ? (
            <div className={`transform transition-all duration-800 ${eventsInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
              <div className="text-center bg-gradient-to-br from-[#0f0104] to-[#5d0505] rounded-2xl p-16 shadow-2xl border border-[#825a56]/20">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-[#825a56]/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <span className="text-4xl">📅</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    No Events Currently
                  </h2>
                  <p className="text-xl text-white/80 mb-8 leading-relaxed">
                    We're working on exciting new literary events for our community.
                    Stay tuned for upcoming poetry nights and creative gatherings!
                  </p>
                  <div className="w-16 h-1 bg-[#825a56] mx-auto rounded-full"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`transform transition-all duration-800 ${eventsInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-[#0f0104] mb-6">
                  Upcoming Events
                </h2>
                <p className="text-xl text-[#825a56] max-w-3xl mx-auto leading-relaxed">
                  Join us for these inspiring literary experiences that celebrate creativity,
                  community, and the transformative power of words.
                </p>
                <div className="w-24 h-1 bg-[#5d0505] mx-auto rounded-full mt-6"></div>
              </div>

              <div className="space-y-12">
                {sortedEvents.map((event, index) => (
                  <motion.div
                    key={event.slug}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: eventsInView ? 1 : 0, y: eventsInView ? 0 : 30 }}
                    transition={{
                      duration: 0.6,
                      delay: eventsInView ? index * 0.1 : 0,
                      ease: 'easeOut'
                    }}
                    className="relative"
                  >
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 max-[650px]:px-1 shadow-2xl border-2 border-[#5d0505]/30 transition-all duration-300 transform">
                      <EventCard event={event} />
                    </div>

                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
