'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Events', href: '/events' },
  { name: 'Contact Us', href: '/contact' },
];

const Header = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <header className="w-full shadow-lg border-b-2 bg-[#0f0104] border-[#5d0505]">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center group transition-all duration-300 hover:scale-105">
            <div className="relative">
              <div className="absolute inset-0 rounded-full opacity-30 blur-sm group-hover:opacity-50 transition-opacity duration-300 bg-[#5d0505]"></div>
              <Image
                src="/logo.png"
                alt="Takhayul Literary Society GMC Logo"
                width={60}
                height={60}
                className="relative z-10 rounded-full border-2 shadow-lg border-[#5d0505]"
              />
            </div>
            <div className="ml-3">
              <h1 className="font-bold text-xl md:text-2xl leading-tight text-[#825a56]">
                <span className="hidden min-[450px]:inline">
                  Takhayul Literary Society
                </span>
                <span className="inline min-[450px]:hidden">
                  TLSGMC
                </span>
              </h1>
              <p className="text-xs md:text-sm max[450px]:hidden font-medium text-white">
                Government Medical College
              </p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-6 py-3 rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 transform hover:scale-105 group ${
                  pathname === link.href
                    ? 'shadow-lg bg-[#5d0505] text-white'
                    : 'hover:!bg-accent-light/30 text-[#825a56]'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-[#5d0505]"></div>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden relative z-50 p-2 rounded-lg focus:outline-none transition-all duration-300 text-[#825a56] ${
              menuOpen ? 'bg-[#5d0505]/10' : 'bg-transparent'
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute top-0 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-2.5' : ''
                }`}
              ></span>
              <span
                className={`absolute top-2.5 left-0 w-full h-0.5 bg-current transition-all duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span
                className={`absolute top-5 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-2.5' : ''
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Overlay */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 backdrop-blur-sm z-40 transition-opacity duration-300 bg-[#0f0104]/80"
            onClick={() => setMenuOpen(false)}
          ></div>
          <nav className="lg:hidden fixed top-20 right-4 z-50 w-64 backdrop-blur-md rounded-2xl border-2 shadow-2xl overflow-hidden bg-[#0f0104]/95 border-[#5d0505]/30">
            <div className="p-2">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block relative p-4 m-1 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                    pathname === link.href
                      ? 'bg-[#5d0505] text-white shadow-lg'
                      : 'text-[#825a56] hover:text-white hover:bg-[#5d0505]/30'
                  }`}
                  onClick={() => setMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="relative z-10 flex items-center">
                    <span className="w-2 h-2 rounded-full mr-3 opacity-60 bg-[#5d0505]"></span>
                    {link.name}
                  </span>
                  {pathname === link.href && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-1 h-6 rounded-full bg-white"></div>
                  )}
                </Link>
              ))}
            </div>
            <div className="h-1 bg-gradient-to-r from-transparent via-[#5d0505] to-transparent"></div>
          </nav>
        </>
      )}
    </header>
  );
};

export default Header;
