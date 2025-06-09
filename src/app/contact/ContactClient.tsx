'use client';

import React, { useState, useEffect } from 'react';
import { EmailIcon, PhoneIcon, FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/components/footer/FooterIcons';
import { Copy, Send, User, Mail, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import useInView from '@/components/useInView';
import { email, phoneNumber, spaceInNumber } from '@/components/utils';

const GOOGLE_FORM_URL = process.env.NEXT_PUBLIC_GOOGLE_FORM_CONTACT_URL;
const ENTRY_NAME = "entry.929348297";
const ENTRY_EMAIL = "entry.1520527655";
const ENTRY_MESSAGE = "entry.796312862";

const ContactClient: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({ name: false, email: false, message: false });
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);

    // Animation refs for on-view
    const [infoRef, infoInView] = useInView<HTMLDivElement>(0.2);
    const [formRef, formInView] = useInView<HTMLDivElement>(0.2);

    // Animation trigger on page load
    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: false });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let newErrors = {
            name: formData.name.trim() === '',
            email: formData.email.trim() === '' || !/\S+@\S+\.\S+/.test(formData.email),
            message: formData.message.trim() === '',
        };

        if (Object.values(newErrors).some((error) => error)) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        const formUrl = `${GOOGLE_FORM_URL}?${ENTRY_NAME}=${encodeURIComponent(formData.name)}&${ENTRY_EMAIL}=${encodeURIComponent(formData.email)}&${ENTRY_MESSAGE}=${encodeURIComponent(formData.message.trim().replace(/^\n+|\n+$/g, ''))}`;

        try {
            await fetch(formUrl, {
                mode: 'no-cors',
                method: 'POST',
            });
            setSuccessMessage('Message sent successfully!');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const scrollToContactForm = () => {
        const formSection = document.getElementById('contact-form-section');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth' });
        }
    };    
    
    return (
        <section id="contact" className="min-h-screen bg-white px-4 py-8">
            <div className="container mx-auto max-w-7xl">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-[#0f0104] mb-4">
                        Get In Touch
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#5d0505] to-[#825a56] mx-auto mb-6"></div>
                    <p className="text-lg text-[#825a56] max-w-2xl mx-auto leading-relaxed">
                        Connect with the Takhayul Literary Society. We'd love to hear from you and answer any questions you may have.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Information Section */}
                    <motion.div
                        ref={infoRef}
                        initial={{ opacity: 0, x: -60 }}
                        animate={infoInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="space-y-8"
                    >                        <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#5d0505]/20 p-8 text-[#0f0104]">
                            <h2 className="text-2xl font-bold text-[#5d0505] mb-6 flex items-center">
                                <MessageSquare className="mr-3" size={28} />
                                Contact Information
                            </h2>
                            <p className="text-[#825a56] mb-8 leading-relaxed">
                                Reach out to us through any of the following channels. We're here to help and would love to connect with you.
                            </p>
                            
                            <div className="space-y-6">
                                {/* Email */}
                                <div className="flex items-center group">
                                    <div className="w-10 h-10 bg-[#5d0505] rounded-full flex items-center justify-center mr-4 transition-colors duration-300">
                                        <EmailIcon className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[#5d0505] font-semibold text-sm">Email</p>
                                        <div className="flex items-center">
                                            <a href={`mailto:${email}`} className="text-[#0f0104] hover:text-[#5d0505] transition-colors duration-300 break-all">
                                                {email}
                                            </a>
                                            <button 
                                                onClick={handleCopyEmail} 
                                                className="ml-3 text-[#825a56] hover:text-[#5d0505] transition-colors duration-300"
                                                aria-label="Copy email address"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                        {copiedEmail && (
                                            <span className="text-xs text-green-600 animate-pulse">Email copied!</span>
                                        )}
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-center group">
                                    <div className="w-10 h-10 bg-[#5d0505] rounded-full flex items-center justify-center mr-4 transition-colors duration-300">
                                        <PhoneIcon className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[#5d0505] font-semibold text-sm">Phone</p>
                                        <div className="flex items-center">
                                            <a href={`tel:${phoneNumber}`} className="text-[#0f0104] hover:text-[#5d0505] transition-colors duration-300">
                                                {spaceInNumber(phoneNumber)}
                                            </a>
                                            <button 
                                                onClick={handleCopy} 
                                                className="ml-3 text-[#825a56] hover:text-[#5d0505] transition-colors duration-300"
                                                aria-label="Copy phone number"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                        {copied && (
                                            <span className="text-xs text-green-600 animate-pulse">Phone copied!</span>
                                        )}
                                    </div>
                                </div>
                            </div>                            
                            {/* Social Media */}
                            <div className="mt-8 pt-6 border-t border-[#5d0505]/20">
                                <p className="text-[#5d0505] font-semibold mb-4">Follow Us</p>
                                <div className="flex space-x-4">
                                    <a
                                        href="https://m.facebook.com/1193024860863894/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 hover:scale-110 bg-accent border-2 border-[#5d0505] rounded-full flex items-center justify-center hover:bg-accent-light text-white hover:shadow-lg transition-all duration-300 group"
                                    >
                                        <FacebookIcon />
                                    </a>
                                    <a
                                        href="https://www.instagram.com/takhayul_literary_society_gmc/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 hover:scale-110 bg-accent border-2 border-[#5d0505] rounded-full flex items-center justify-center hover:bg-accent-light text-white hover:shadow-lg transition-all duration-300 group"
                                    >
                                        <InstagramIcon />
                                    </a>
                                    <a
                                        href="https://whatsapp.com/channel/0029Vb9V8EWLNSa2uew73k28"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 hover:scale-110 bg-accent border-2 border-[#5d0505] rounded-full flex items-center justify-center hover:bg-accent-light text-white hover:shadow-lg transition-all duration-300 group"
                                    >
                                        <WhatsAppIcon />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form Section */}
                    <motion.div
                        ref={formRef}
                        initial={{ opacity: 0, x: 60 }}
                        animate={formInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        id="contact-form-section"
                        className="bg-white rounded-2xl shadow-2xl border-2 border-[#5d0505]/20 p-8 backdrop-blur-sm"
                    >
                        <h2 className="text-2xl font-bold text-[#0f0104] mb-2 flex items-center">
                            <Send className="mr-3 text-[#5d0505]" size={28} />
                            Send a Message
                        </h2>
                        <p className="text-[#825a56] mb-8 leading-relaxed">
                            Have a question or want to get involved? Drop us a message and we'll get back to you soon.
                        </p>

                        {/* Success Message */}
                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg"
                            >
                                <p className="text-green-700 font-semibold flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {successMessage}
                                </p>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="relative"
                            >                                <label className="flex items-center text-[#0f0104] font-semibold mb-2">
                                    <User size={18} className="mr-2 text-[#5d0505]" />
                                    Full Name
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-300 bg-neutral-light ${
                                        errors.name 
                                            ? 'border-red-500 focus:border-red-500' 
                                            : 'border-[#5d0505]/30 focus:border-[#5d0505] hover:border-[#825a56]'
                                    }`}
                                    placeholder="Enter your full name"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center animate-pulse">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Name is required
                                    </p>
                                )}
                            </motion.div>

                            {/* Email Field */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="relative"
                            >                                <label className="flex items-center text-[#0f0104] font-semibold mb-2">
                                    <Mail size={18} className="mr-2 text-[#5d0505]" />
                                    Email Address
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-300 bg-neutral-light ${
                                        errors.email 
                                            ? 'border-red-500 focus:border-red-500' 
                                            : 'border-[#5d0505]/30 focus:border-[#5d0505] hover:border-[#825a56]'
                                    }`}
                                    placeholder="Enter your email address"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center animate-pulse">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Valid email is required
                                    </p>
                                )}
                            </motion.div>

                            {/* Message Field */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="relative"
                            >                                <label className="flex items-center text-[#0f0104] font-semibold mb-2">
                                    <MessageSquare size={18} className="mr-2 text-[#5d0505]" />
                                    Message
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-300 bg-neutral-light resize-none ${
                                        errors.message 
                                            ? 'border-red-500 focus:border-red-500' 
                                            : 'border-[#5d0505]/30 focus:border-[#5d0505] hover:border-[#825a56]'
                                    }`}
                                    placeholder="Write your message here..."
                                    required
                                />
                                {errors.message && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center animate-pulse">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Message is required
                                    </p>
                                )}
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >                                
                            <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#5d0505] text-white font-bold py-4 px-6 rounded-lg hover:bg-[#0f0104] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending Message...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2" size={20} />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactClient;
