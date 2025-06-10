'use client';

import React from 'react';
import Image from 'next/image';
import useInView from '@/components/useInView';

const AboutClient = () => {
  // Animation refs
  const [heroRef, heroInView] = useInView<HTMLElement>(0.1);
  const [missionRef, missionInView] = useInView<HTMLElement>(0.3);
  const [valuesRef, valuesInView] = useInView<HTMLElement>(0.2);
  const [teamRef, teamInView] = useInView<HTMLElement>(0.2);
  const coreValues = [
    {
      icon: "✍️",
      title: "Creative Expression",
      description: "Nurturing the artistic soul through diverse forms of literary creativity - poetry, prose, storytelling, and more."
    },
    {
      icon: "🤝",
      title: "Community Connection",
      description: "Building bridges between creative minds through shared stories, experiences, and literary exploration."
    },
    {
      icon: "📚",
      title: "Literary Excellence",
      description: "Promoting the art of fine writing, poetry, and storytelling while celebrating literary traditions."
    },
    {
      icon: "🌱",
      title: "Personal Growth",
      description: "Fostering self-reflection and emotional intelligence through the transformative power of literature."
    },
    {
      icon: "🎭",
      title: "Artistic Freedom",
      description: "Providing a platform for creative expression without boundaries, celebrating diverse voices and styles."
    },
    {
      icon: "🌟",
      title: "Literary Heritage",
      description: "Preserving and promoting the rich tradition of literature while embracing contemporary forms of expression."
    }
  ];  
  
  const teamMembers = [
    {
      name: "Poets & Writers",
      role: "Creative Artists",
      description: "Passionate poets and writers sharing their literary masterpieces",
      image: "/logo.png"
    },
    {
      name: "Event Organizers",
      role: "Program Coordinators",
      description: "Bringing poetry and literary nights, and creative events to life",
      image: "/logo.png"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f4f0]">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative overflow-hidden"
      >
        <div className="bg-gradient-to-br from-[#0f0104] to-[#5d0505] min-h-[85vh] py-3 flex items-center justify-center px-4">
          <div className={`max-w-6xl mx-auto text-center transform transition-all duration-1000 ${
            heroInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            <div className="mb-12">
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full opacity-30 blur-sm bg-white/20"></div>
                  <Image
                    src="/logo.png"
                    alt="Takhayul Literary Society GMC Logo"
                    width={120}
                    height={120}
                    className="relative z-10 rounded-full border-4 shadow-2xl border-white/30"
                  />
                </div>
              </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                About
                <span className="block bg-gradient-to-r from-[#f8f4f0] to-[#e8e0d8] bg-clip-text text-transparent">
                  Takhayul Literary Society
                </span>
              </h1>
              <div className="w-32 h-2 bg-[#f8f4f0] mx-auto rounded-full mb-8"></div>
            </div>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-12">
              Where words come alive and creativity flourishes, fostering poetic expression and literary excellence 
              through the transformative power of literature, poetry, and creative storytelling.
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="text-[#f8f4f0] font-bold text-xl">2018</span>
                <span>Founded</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="text-[#f8f4f0] font-bold text-xl">GMC</span>
                <span>Gujranwala Medical College</span>
              </div>              
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="text-[#f8f4f0] font-bold text-xl">Creative</span>
                <span>Community</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Purpose Section */}
      <section 
        ref={missionRef}
        className="py-20 px-4 bg-[#f8f4f0]"
      >
        <div className="max-w-6xl mx-auto">
          <div className={`transform transition-all duration-800 ${
            missionInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#0f0104] mb-6">Our Mission & Purpose</h2>
              <div className="w-24 h-1 bg-[#5d0505] mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Mission */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border-l-8 border-[#5d0505] transform transition-all duration-500 hover:shadow-3xl hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#5d0505] to-[#825a56] rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl text-white">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0f0104]">Our Mission</h3>
                </div>                
                <p className="text-lg text-[#825a56] leading-relaxed">
                  Empowering creative minds to express, reflect, and connect through the power of literature, poetry, and storytelling, 
                  enriching both personal and artistic lives.
                </p>
              </div>

              {/* Purpose */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border-l-8 border-[#825a56] transform transition-all duration-500 hover:shadow-3xl hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#825a56] to-[#5d0505] rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl text-white">💡</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0f0104]">Our Purpose</h3>
                </div>                
                <p className="text-lg text-[#825a56] leading-relaxed">
                  Where words meet soul, our literary society celebrates creativity, provides artistic inspiration, and promotes literary excellence among writers and poets. 
                  Through poetry, creative writing, literary discussions, and artistic exploration, we build a community that nurtures the timeless art of storytelling and verse.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section 
        ref={valuesRef}
        className="py-20 px-4 bg-gradient-to-br from-[#f8f4f0] to-[#e8e0d8]"
      >
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transform transition-all duration-800 ${
            valuesInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0f0104] mb-6">Our Core Values</h2>            <p className="text-xl text-[#825a56] max-w-3xl mx-auto">
              The principles that guide our literary community and inspire our passion for creative expression
            </p>
            <div className="w-24 h-1 bg-[#5d0505] mx-auto rounded-full mt-6"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={value.title}
                className={`bg-white rounded-xl shadow-xl p-8 border-t-4 border-[#5d0505] hover:shadow-2xl transition-all duration-500 transform ${
                  valuesInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                } hover:scale-105 group`}
                style={{ 
                  transitionDelay: valuesInView ? `${index * 100}ms` : '0ms'
                }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#5d0505] to-[#825a56] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">{value.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0f0104] mb-4">{value.title}</h3>
                  <p className="text-[#825a56] leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section 
        ref={teamRef}
        className="py-20 px-4 bg-gradient-to-br from-[#0f0104] to-[#5d0505]"
      >
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transform transition-all duration-800 ${
            teamInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Community</h2>            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Meet the passionate poets, writers, and creative minds who make our literary society flourish
            </p>
            <div className="w-24 h-1 bg-[#f8f4f0] mx-auto rounded-full mt-6"></div>
          </div>

          <div className="grid min-[600px]:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={member.name}
                className={`group relative overflow-hidden rounded-2xl transform transition-all duration-700 ${
                  teamInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                } bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20`}
                style={{ 
                  transitionDelay: teamInView ? `${index * 150}ms` : '0ms'
                }}
              >
                <div className="p-8 text-center">
                  <div className="relative mb-6">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="rounded-full border-4 border-white/30 mx-auto group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-[#f8f4f0] font-medium mb-3">{member.role}</p>
                  <p className="text-white/70 text-sm leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutClient;
