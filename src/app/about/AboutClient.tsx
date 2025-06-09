'use client';

import React from 'react';
import useInView from '@/components/useInView';

const AboutClient = () => {
  // Animation refs - each animates only once when it comes into view
  const [heroRef, heroInView] = useInView<HTMLElement>(0.1);
  const [missionRef, missionInView] = useInView<HTMLElement>(0.3);
  const [valuesRef, valuesInView] = useInView<HTMLElement>(0.2);
  const [achievementsRef, achievementsInView] = useInView<HTMLElement>(0.2);
  const [ctaRef, ctaInView] = useInView<HTMLElement>(0.3);

  const coreValues = [
    {
      icon: "📚",
      title: "Literary Excellence",
      description: "Promoting exceptional writing, creativity, and storytelling within the medical community."
    },
    {
      icon: "🤝",
      title: "Community Building",
      description: "Creating meaningful connections between writers, readers, and literary enthusiasts."
    },
    {
      icon: "🏛️",
      title: "Cultural Heritage",
      description: "Preserving and celebrating our rich literary traditions while embracing modern expression."
    },
    {
      icon: "🎓",
      title: "Educational Growth",
      description: "Fostering intellectual development through workshops, discussions, and creative programs."
    },
    {
      icon: "💡",
      title: "Innovation",
      description: "Encouraging new forms of literary expression and creative approaches to storytelling."
    },
    {
      icon: "🌟",
      title: "Excellence",
      description: "Maintaining the highest standards in all our literary endeavors and community activities."
    }
  ];

  const achievements = [
    {
      year: "2024",
      title: "Literary Excellence Award",
      description: "Recognized for outstanding contribution to literary culture in medical education",
      highlight: true
    },
    {
      year: "2023",
      title: "Best Society Award",
      description: "Awarded best literary society by Gujranwala Medical College",
      highlight: true
    },
    {
      year: "2022",
      title: "Cultural Impact Recognition",
      description: "Acknowledged for significant cultural impact in the medical community",
      highlight: false
    },
    {
      year: "2021",
      title: "Foundation & Launch",
      description: "Successfully established as a premier literary society",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative overflow-hidden"
      >
        <div className="bg-gradient-to-br from-primary via-primary-light to-secondary min-h-[80vh] flex items-center justify-center px-4">
          <div className={`max-w-5xl mx-auto text-center transform transition-all duration-1000 ${
            heroInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-neutral mb-6 leading-tight">
                About Our
                <span className="block text-gold">Society</span>
              </h1>
              <div className="w-32 h-2 bg-accent mx-auto rounded-full mb-8"></div>
            </div>
            
            <p className="text-xl md:text-2xl text-neutral-light max-w-3xl mx-auto leading-relaxed mb-8">
              The Takhayul Literary Society GMC stands as a beacon of creativity and intellectual discourse, 
              uniting medicine and literature in unprecedented harmony.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-neutral-light">
              <div className="flex items-center gap-2">
                <span className="text-gold font-bold text-2xl">2021</span>
                <span>Founded</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold font-bold text-2xl">500+</span>
                <span>Members</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold font-bold text-2xl">50+</span>
                <span>Events</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section 
        ref={missionRef}
        className="py-20 px-4 bg-neutral-light"
      >
        <div className="max-w-4xl mx-auto">
          <div className={`transform transition-all duration-800 ${
            missionInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-primary mb-6">Our Mission</h2>
              <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-l-8 border-accent">
              <blockquote className="text-xl md:text-2xl leading-relaxed text-foreground font-medium italic text-center">
                "To nurture creativity, foster intellectual discourse, and celebrate the profound intersection 
                of medicine and literature—creating a space where healing meets storytelling, and where 
                scientific minds discover the transformative power of words."
              </blockquote>
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-3 bg-primary text-neutral px-6 py-3 rounded-full">
                  <span className="text-gold">✦</span>
                  <span className="font-semibold">Est. 2021</span>
                  <span className="text-gold">✦</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section 
        ref={valuesRef}
        className="py-20 px-4 bg-gradient-to-br from-background to-neutral"
      >
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transform transition-all duration-800 ${
            valuesInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h2 className="text-5xl font-bold text-primary mb-6">Our Core Values</h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto">
              The principles that guide our literary community and shape our vision for the future
            </p>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full mt-6"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={value.title}
                className={`bg-white rounded-xl shadow-xl p-8 border-t-4 border-accent hover:shadow-2xl transition-all duration-500 transform ${
                  valuesInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                } hover:scale-105`}
                style={{ 
                  transitionDelay: valuesInView ? `${index * 100}ms` : '0ms'
                }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold text-primary mb-4">{value.title}</h3>
                <p className="text-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section 
        ref={achievementsRef}
        className="py-20 px-4 bg-gradient-to-br from-primary to-secondary"
      >
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transform transition-all duration-800 ${
            achievementsInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h2 className="text-5xl font-bold text-neutral mb-6">Our Achievements</h2>
            <p className="text-xl text-neutral-light max-w-3xl mx-auto">
              Milestones that mark our journey of excellence and community impact
            </p>
            <div className="w-24 h-1 bg-gold mx-auto rounded-full mt-6"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.year}
                className={`group relative overflow-hidden rounded-2xl transform transition-all duration-700 ${
                  achievementsInView ? 'translate-x-0 opacity-100' : index % 2 === 0 ? '-translate-x-8 opacity-0' : 'translate-x-8 opacity-0'
                } ${achievement.highlight ? 'bg-gradient-to-br from-gold to-accent' : 'bg-primary-light'}`}
                style={{ 
                  transitionDelay: achievementsInView ? `${index * 150}ms` : '0ms'
                }}
              >
                <div className="p-8 relative z-10">
                  <div className={`text-4xl font-black mb-4 ${
                    achievement.highlight ? 'text-neutral' : 'text-gold'
                  }`}>
                    {achievement.year}
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${
                    achievement.highlight ? 'text-neutral' : 'text-neutral'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`leading-relaxed ${
                    achievement.highlight ? 'text-neutral-dark' : 'text-neutral-light'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
                
                {achievement.highlight && (
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-neutral rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section 
        ref={ctaRef}
        className="py-20 px-4 bg-neutral-light"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transform transition-all duration-800 ${
            ctaInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h2 className="text-5xl font-bold text-primary mb-8">
              Join Our Literary Family
            </h2>
            <p className="text-xl text-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Become part of a vibrant community where medical minds meet literary souls, 
              where every voice matters, and where creativity knows no bounds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group bg-gradient-to-r from-accent to-accent-light text-neutral px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <span className="flex items-center gap-3">
                  Get Involved Today
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
              
              <button className="group border-2 border-primary text-primary px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:bg-primary hover:text-neutral">
                <span className="flex items-center gap-3">
                  Learn More
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="text-3xl mb-3">📝</div>
                <h4 className="font-bold text-primary mb-2">Creative Writing</h4>
                <p className="text-foreground">Express yourself through poetry, prose, and storytelling</p>
              </div>
              <div className="p-6">
                <div className="text-3xl mb-3">🎭</div>
                <h4 className="font-bold text-primary mb-2">Literary Events</h4>
                <p className="text-foreground">Participate in symposiums, workshops, and competitions</p>
              </div>
              <div className="p-6">
                <div className="text-3xl mb-3">🌐</div>
                <h4 className="font-bold text-primary mb-2">Global Community</h4>
                <p className="text-foreground">Connect with writers and readers worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutClient;
