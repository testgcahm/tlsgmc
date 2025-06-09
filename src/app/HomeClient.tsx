'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBook, FaPen, FaUsers, FaCalendarAlt, FaUserPlus, FaEnvelope, FaQuoteLeft, FaStar, FaRegLightbulb } from 'react-icons/fa';
import useInView from '../components/useInView';
import React from 'react';

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const isRegistrationOpen = new Date() <= new Date('2025-05-06T23:59:59');

const features = [
  {
    icon: <FaBook className="text-5xl text-logo-tertiary mb-4" />,
    title: 'Literary Excellence',
    description: 'Explore the depths of literature through curated readings, discussions, and critical analysis of classic and contemporary works.',
    color: 'from-secondary-50 to-secondary-100'
  },
  {
    icon: <FaPen className="text-5xl text-tertiary mb-4" />,
    title: 'Creative Writing',
    description: 'Unleash your creativity through poetry, short stories, and essays. Join workshops led by experienced writers and published authors.',
    color: 'from-tertiary-50 to-tertiary-100'
  },
  {
    icon: <FaUsers className="text-5xl text-primary mb-4" />,
    title: 'Intellectual Community',
    description: 'Connect with like-minded individuals who share your passion for literature, language, and the power of written expression.',
    color: 'from-primary-50 to-primary-100'
  }
];

const stats = [
  { number: '500+', label: 'Active Members', icon: <FaUsers /> },
  { number: '25+', label: 'Events Hosted', icon: <FaCalendarAlt /> },
  { number: '15+', label: 'Published Writers', icon: <FaPen /> },
  { number: '100+', label: 'Literary Works', icon: <FaBook /> }
];

const journeySteps = {
  steps: [
    {
      icon: <FaRegLightbulb className="text-4xl text-secondary mb-4" />,
      title: 'Our Mission',
      description: "We strive to promote literature, creative writing, and intellectual discourse within the GMC community.",
      link: '/about',
      button: 'Discover More',
      bg: 'bg-gradient-to-br from-[#f5f3f4] via-[#ebe6e8] to-[#f9f9f9]'
    },
    {
      icon: <FaCalendarAlt className="text-4xl text-primary mb-4" />,
      title: 'Events & Activities',
      description: "Experience inspiring literary sessions, writing competitions, and intellectual gatherings. See what's coming up!",
      link: '/events',
      button: 'View Events',
      bg: 'bg-white'
    },    isRegistrationOpen ? {
      icon: <FaUserPlus className="text-4xl text-logo-tertiary mb-4" />,
      title: 'Join the Movement',
      description: "Ready to be part of something meaningful? Register for our next event and make a difference.",
      link: '/register',
      button: 'Register Now',
      bg: 'bg-gradient-to-br from-[#f7d9db] via-[#f5f3f4] to-[#f9f9f9]'
    } : {
      icon: <FaUserPlus className="text-4xl text-logo-tertiary mb-4 opacity-50" />,
      title: 'Registration Closed',
      description: "Event registration is now closed. Stay tuned for future opportunities!",
      link: '/events',
      button: 'See Events',
      bg: 'bg-gradient-to-br from-[#f7d9db] via-[#f5f3f4] to-[#f9f9f9]'
    },
    {
      icon: <FaEnvelope className="text-4xl text-secondary mb-4" />,
      title: 'Connect With Us',
      description: "Questions, ideas, or feedback? Reach out and let’s grow together.",
      link: '/contact',
      button: 'Contact Us',
      bg: 'bg-white'
    }
  ]
};

export default function HomeClient() {
  const [heroRef, heroInView] = useInView<HTMLElement>(0.3);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: heroInView ? 1 : 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className={`inset-0 transition-opacity z-0 duration-1000 ${heroInView ? 'opacity-100' : 'opacity-0'} w-full h-full absolute top-[82px] left-0`}
        >
          <Image
            src="/background.jpg"
            alt="Hero Background"
            fill
            style={{ objectFit: 'cover' }}
            priority
            placeholder="blur"
            quality={40} // Lower quality for faster load
            blurDataURL="/background.jpg" // Consider using a smaller, base64-encoded blur image for even faster placeholder
            fetchPriority="high"
          />
          <div className="inset-0 bg-black/50 w-full h-full absolute top-0 left-0 pointer-events-none" />
        </motion.div>
        <div className="text-center px-4 z-20 flex flex-col items-center justify-center h-full w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={heroInView ? 'show' : 'hidden'}
            className="flex flex-col items-center w-full"
          >
            <motion.div variants={childVariants} transition={{ duration: 1, ease: 'easeInOut' }}>              <Image
                src="/logo.png"
                alt="Takhayul Literary Society GMC Logo"
                width={180}
                height={180}
                className="mx-auto mb-6"
              />
            </motion.div>            
            <motion.h1
              variants={childVariants}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="text-4xl md:text-6xl font-bold text-white mb-4"
            >
              Takhayul Literary Society GMC
            </motion.h1>
            <motion.p
              variants={childVariants}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="max-[450px]:text-2xl min-[450px]:text-3xl sm:text-4xl font-bold text-secondary-400 mb-10"
            >
              Fostering Literary Excellence and Creative Expression
            </motion.p>
            <motion.div variants={childVariants} transition={{ duration: 1, ease: 'easeInOut' }}>
              <Link href="/contact" className="bg-secondary hover:bg-logo-tertiary text-primary-800  font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105 transform">
                Get in Touch
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Unique Journey Timeline */}
      <section className="relative py-24 px-4 bg-gray-50"> {/* Added subtle background to section */}
        <div className="max-w-4xl mx-auto flex flex-col items-center"> {/* Increased max-width */}
          {/* Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-secondary/20 to-primary/5 -translate-x-1/2 z-0 rounded-full" /> {/* Adjusted gradient */}

          {journeySteps.steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.0001 }}
              transition={{ duration: 0.8, delay: idx * 0.2, ease: 'easeOut' }} // Adjusted animation
              className={`relative z-10 w-full my-8 rounded-lg shadow-lg bg-white p-6 flex items-start space-x-6 border-l-4 border-secondary`} // Changed layout: flex, items-start, space-x-6, padding, shadow, consistent bg, border
            >
              {/* Timeline Dot */}
              <div className="absolute left-[-2px] top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-secondary rounded-full border-4 border-white z-20" />

              {/* Icon */}
              <div className="flex-shrink-0 text-secondary mt-1"> {/* Adjusted icon container */}
                {React.cloneElement(step.icon, { className: "text-3xl" })} {/* Resized icon */}
              </div>

              {/* Content */}
              <div className="flex-grow"> {/* Content takes remaining space */}
                <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-2">{step.title}</h2> {/* Adjusted font */}
                <p className="text-gray-600 mb-4 text-base">{step.description}</p> {/* Adjusted font size */}
                <Link href={step.link} className="inline-block bg-secondary hover:bg-logo-tertiary text-primary-900 font-semibold py-2 px-5 rounded text-sm transition-all duration-300 hover:scale-105"> {/* Adjusted button style */}
                  {step.button}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
