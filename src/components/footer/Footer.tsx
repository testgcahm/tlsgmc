'use client';

import Link from 'next/link';
import Image from 'next/image';
import { EmailIcon, FacebookIcon, InstagramIcon, LocationIcon, PhoneIcon, WhatsAppIcon } from './FooterIcons';
import { Copy } from 'lucide-react';
import React, { useState } from 'react';
import { email, phoneNumber, spaceInNumber } from '../utils';

const Footer = () => {
    const [copied, setCopied] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(phoneNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const handleCopyEmail = () => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    return (
        <footer className="bg-[#0f0104] border-t-2 border-[#5d0505] text-white pt-8 px-4 sm:px-8 pb-8">
            <div className="max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_3fr] gap-10 lg:gap-16 items-start">
                    
                    {/* Logo and About Section */}
                    <div className="space-y-4 flex flex-col items-start md:col-span-1">
                        <div className="flex items-center group transition-all duration-300 hover:scale-105">
                            <div className="relative mr-3">
                                <div className="absolute inset-0 rounded-full opacity-30 blur-sm group-hover:opacity-50 transition-opacity duration-300 bg-[#5d0505]"></div>
                                <Image
                                    src="/logo.png"
                                    alt="Takhayul Literary Society GMC Logo"
                                    width={60}
                                    height={60}
                                    className="relative z-10 rounded-full border-2 shadow-lg border-[#5d0505]"
                                />
                            </div>
                            <div>
                                <h2 className="font-bold text-xl leading-tight text-[#825a56]">
                                    Takhayul Literary Society
                                </h2>
                                <p className="text-sm font-medium text-white/80">
                                    Government Medical College
                                </p>
                            </div>
                        </div>
                        
                        <p className="text-white/70 text-left leading-relaxed">
                            Fostering literary excellence, creative expression, and intellectual discourse within the Gujranwala Medical College community.
                        </p>
                        
                        <div className="flex space-x-3 mt-4">
                            <SocialIcon href="https://www.facebook.com/people/Takhayul-Literary-Society/100067471032724/" icon="facebook" />
                            <SocialIcon href="https://www.instagram.com/takhayul_literary_society_gmc/" icon="instagram" />
                            <SocialIcon href="https://whatsapp.com/channel/0029Vb9V8EWLNSa2uew73k28" icon="whatsapp" />
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div className="flex flex-col md:mt-4 md:pl-5 lg:pl-0 items-start w-full md:col-span-1 lg:col-auto">
                        <h3 className="font-bold text-lg mb-6 text-[#825a56] border-b border-[#5d0505] pb-2">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            <FooterLink href="/" label="Home" />
                            <FooterLink href="/about" label="About Us" />
                            <FooterLink href="/events" label="Events" />
                            <FooterLink href="/contact" label="Contact Us" />
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="flex flex-col lg:mt-4 items-start w-full md:col-span-2 lg:col-span-1">
                        <h3 className="font-bold text-lg mb-6 text-[#825a56] border-b border-[#5d0505] pb-2">
                            Contact Us
                        </h3>
                        
                        <address className="not-italic space-y-4 text-white/70 w-full">
                            <div className="flex items-start group hover:text-white transition-colors duration-300">
                                <LocationIcon className="mt-1 mr-3 flex-shrink-0 text-gray-300" />
                                <span className="leading-relaxed">
                                    Gondalanwala Village, Ali pur Chatha Road, Gujranwala Punjab Pakistan
                                </span>
                            </div>
                            
                            <div className="flex items-center flex-wrap group hover:text-white transition-colors duration-300">
                                <EmailIcon className="mr-3 flex-shrink-0 text-gray-300" />
                                <a 
                                    href="mailto:takhayulliterarysociety@gmail.com" 
                                    className="hover:text-[#825a56] transition-colors break-all"
                                >
                                    {email}
                                </a>
                                <button 
                                    onClick={handleCopyEmail} 
                                    className="ml-2 p-1 rounded hover:bg-[#5d0505]/30 text-[#825a56] hover:text-white transition-all duration-300" 
                                    aria-label="Copy email address"
                                >
                                    <Copy size={16} />
                                </button>
                                {copiedEmail && (
                                    <span className="ml-2 text-xs text-white bg-[#5d0505] px-2 py-1 rounded shadow animate-bounce">
                                        Copied!
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex items-center flex-wrap group hover:text-white transition-colors duration-300">
                                <PhoneIcon className="mr-3 flex-shrink-0 text-gray-300" />
                                <a 
                                    href={`tel:${phoneNumber}`} 
                                    className="hover:text-[#825a56] transition-colors"
                                >
                                    {spaceInNumber(phoneNumber)}
                                </a>
                                <button 
                                    onClick={handleCopy} 
                                    className="ml-2 p-1 rounded hover:bg-[#5d0505]/30 text-[#825a56] hover:text-white transition-all duration-300" 
                                    aria-label="Copy phone number"
                                >
                                    <Copy size={16} />
                                </button>
                                {copied && (
                                    <span className="ml-2 text-xs text-white bg-[#5d0505] px-2 py-1 rounded shadow animate-bounce">
                                        Copied!
                                    </span>
                                )}
                            </div>
                        </address>
                        
                        <div className="mt-6 rounded-lg max-w-[800px] overflow-hidden shadow-2xl border-2 border-[#5d0505] w-full h-48 md:h-56">
                            <iframe
                                title="Gujranwala Medical College Map"
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d54017.51389275296!2d74.13238!3d32.201681!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f2f2c72a3040b%3A0x73d5df7d05f93168!2sGujranwala%20Medical%20College!5e0!3m2!1sen!2sus!4v1745758103569!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

// Footer Link Component
const FooterLink = ({ href, label }: { href: string; label: string }) => {
    return (
        <li>
            <Link 
                href={href} 
                className="relative text-white/70 transition-all duration-300 group flex items-center py-1"
            >
                <span className="w-2 h-2 rounded-full mr-3 opacity-60 bg-[#5d0505] transition-colors duration-300"></span>
                <span className="relative">
                    {label}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#825a56] transition-all duration-300 group-hover:w-full"></div>
                </span>
            </Link>
        </li>
    );
};

// Social Media Icon Component
const SocialIcon = ({ href, icon }: { href: string; icon: string }) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 rounded-full bg-[#5d0505] flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg border border-[#5d0505]/50 hover:border-[#825a56]/50"
        >
            {icon === 'facebook' && <FacebookIcon />}
            {icon === 'instagram' && <InstagramIcon />}
            {icon === 'whatsapp' && <WhatsAppIcon />}
        </a>
    );
};


export default Footer;