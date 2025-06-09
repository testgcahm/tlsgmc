'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useInView from '../components/useInView';
import React from 'react';

// Color classes based on globals.css theme
// bg-primary: navy, text-secondary: black, bg-accent: crimson, etc.

export default function HomeClient() {
  const [heroRef, heroInView] = useInView<HTMLElement>(0.2);
  const [quoteRef, quoteInView] = useInView<HTMLElement>(0.2);

  return (
    <main className="min-h-screen bg-primary text-neutral">
      {/* Hero Section */}
      <section ref={heroRef} className="relative flex items-center justify-center min-h-[90vh] overflow-hidden bg-accent-light/30">
        <div className="absolute inset-0 z-0">
          <Image
            src="/background.jpg"
            alt="Hero Background"
            fill
            style={{ objectFit: 'cover', opacity: 0.18 }}
            priority
            quality={40}
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center px-4 py-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: heroInView ? 1 : 0.7, y: heroInView ? 0 : 40 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <Image
              src="/logo.png"
              alt="Takhayul Literary Society GMC Logo"
              width={120}
              height={120}
              className="mb-6 rounded-full border-4 border-logo-brown shadow-xl bg-white/10"
            />
            <h1 className="text-5xl md:text-7xl font-extrabold text-neutral drop-shadow-lg mb-4 tracking-tight">
              Takhayul Literary Society GMC
            </h1>
            <p className="text-2xl md:text-3xl text-neutral/80 font-medium mb-8 max-w-2xl">
              Where Imagination Meets Excellence
            </p>
            <Link href="/contact" className="inline-block bg-accent hover:bg-logo-red text-neutral font-bold py-3 px-10 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 text-lg">
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section ref={quoteRef} className="py-20 px-4 bg-gradient-to-r from-neutral-light via-neutral-dark to-neutral-light flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: quoteInView ? 1 : 0, y: quoteInView ? 0 : 30 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-3xl mx-auto text-center"
        >
          <div>
            <blockquote className="text-3xl md:text-4xl font-semibold text-logo-red italic mb-6">
              "The ultimate aim of the ego is not to see something, but to be something"
            </blockquote>
            <span className="block text-lg text-logo-brown font-bold">— Muhammad Iqbal</span>
          </div>
          <div className="my-10 flex justify-center">
            <span className="inline-block w-16 h-1 bg-logo-brown rounded-full opacity-40"></span>
          </div>
          <div>
            <blockquote className="text-3xl md:text-4xl font-semibold text-logo-red italic mb-6">
              "Literature is the art of discovering something extraordinary about ordinary people, and saying with ordinary words something extraordinary."
            </blockquote>
            <span className="block text-lg text-logo-brown font-bold">— Boris Pasternak</span>
          </div>
        </motion.div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-accent-dark flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral mb-6">Ready to be part of the story?</h2>
        <p className="text-lg text-neutral/80 mb-8 max-w-xl">
          Whether you are a poet, a storyteller, or simply a lover of words, Takhayul Literary Society welcomes you. Let your voice be heard and your imagination soar.
        </p>
        <Link href="/contact" className="inline-block bg-accent hover:bg-logo-red text-neutral font-bold py-3 px-10 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 text-lg">
          Contact Us
        </Link>
      </section>
    </main>
  );
}
