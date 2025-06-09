'use client';

import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import useInView from '../../components/useInView';
import { motion } from 'framer-motion';
import { FolderType } from '../../types/googleDrive';

const GOOGLE_FORM_URL = process.env.NEXT_PUBLIC_GOOGLE_FORM_SUBMIT_URL;
const ENTRY_NAME = "entry.1649783382";
const ENTRY_FATHER = "entry.1058043668";
const ENTRY_GENDER = "entry.265549784";
const ENTRY_EMAIL = "entry.1849943279";
const ENTRY_PHONE = "entry.1259517599";
const ENTRY_CNIC = "entry.565316031";
const ENTRY_CATEGORY = "entry.936925128";
const ENTRY_INSTITUTE = "entry.1577305617";
const ENTRY_FILE_URL = "entry.421343422";

const CATEGORY_OPTIONS = [
    "Medical Student / HO / MO / PGR",
    "Other Degree Student"
];
const GENDER_OPTIONS = ["Male", "Female"];

const RegisterClient: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        father: '',
        gender: '',
        email: '',
        phone: '',
        cnic: '',
        category: '',
        institute: '',
        fileUrl: '',
        folderType: FolderType.Register
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errors, setErrors] = useState({
        name: '',
        father: '',
        gender: '',
        email: '',
        phone: '',
        cnic: '',
        category: '',
        institute: '',
        fileUrl: '',
        imageFile: '',
    });
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // Replace single leftRef with individual refs for each section
    const [welcomeRef, welcomeInView] = useInView<HTMLDivElement>(0.2);
    const [paymentRef, paymentInView] = useInView<HTMLDivElement>(0.01);
    const [joinRef, joinInView] = useInView<HTMLDivElement>(0.01);

    // Increase threshold for form animation to trigger earlier
    const [rightRef, rightInView] = useInView<HTMLDivElement>(0.01);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            setErrors((prev) => ({ ...prev, imageFile: 'Only jpg, jpeg, png allowed.' }));
            setImageFile(null);
            return;
        }
        if (file.size > 250 * 1024) {
            setErrors((prev) => ({ ...prev, imageFile: 'Image must be less than 250KB.' }));
            setImageFile(null);
            return;
        }
        setImageFile(file);
        setErrors((prev) => ({ ...prev, imageFile: '' }));
    };

    const validate = () => {
        const newErrors: typeof errors = {
            name: formData.name.trim() ? '' : 'Name is required.',
            father: formData.father.trim() ? '' : "Father's name is required.",
            gender: GENDER_OPTIONS.includes(formData.gender) ? '' : 'Select gender.',
            email: /.+@.+\..+/.test(formData.email) ? '' : 'Valid email required.',
            phone: formData.phone.trim() ? '' : 'Phone is required.',
            cnic: formData.cnic.trim() ? '' : 'CNIC is required.',
            category: CATEGORY_OPTIONS.includes(formData.category) ? '' : 'Select category.',
            institute: formData.institute.trim() ? '' : 'Institute is required.',
            fileUrl: '',
            imageFile: imageFile ? '' : 'Image is required.',
        };
        setErrors(newErrors);
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const newErrors = validate();
        const firstErrorField = Object.keys(newErrors).find((key) => newErrors[key as keyof typeof newErrors]);
        if (firstErrorField) {
            setLoading(false);
            // Scroll to first error field
            const el = document.querySelector(`[name="${firstErrorField}"]`);
            if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Upload image to local API route
        let imageUrl = '';
        try {
            const form = new FormData();
            form.append('image', imageFile!);
            form.append('folderType', formData.folderType); // NEW
            const res = await fetch('/api/image-upload', {
                method: 'POST',
                body: form,
            });
            const data = await res.json();
            if (!data.success) throw new Error('Image upload failed');
            imageUrl = data.url;
        } catch (err) {
            setErrors((prev) => ({ ...prev, imageFile: 'Image upload failed. Please try again.' }));
            setLoading(false);
            return;
        }

        const formUrl = `${GOOGLE_FORM_URL}?${ENTRY_NAME}=${encodeURIComponent(formData.name)}&${ENTRY_FATHER}=${encodeURIComponent(formData.father)}&${ENTRY_GENDER}=${encodeURIComponent(formData.gender)}&${ENTRY_EMAIL}=${encodeURIComponent(formData.email)}&${ENTRY_PHONE}=${encodeURIComponent(formData.phone)}&${ENTRY_CNIC}=${encodeURIComponent(formData.cnic)}&${ENTRY_CATEGORY}=${encodeURIComponent(formData.category)}&${ENTRY_INSTITUTE}=${encodeURIComponent(formData.institute)}&${ENTRY_FILE_URL}=${encodeURIComponent(imageUrl)}`;

        try {
            await fetch(formUrl, {
                mode: 'no-cors',
                method: 'POST',
            });
            setSuccessMessage('Registration submitted successfully!');
            setFormData({ name: '', father: '', gender: '', email: '', phone: '', cnic: '', category: '', institute: '', fileUrl: '', folderType: FolderType.Register });
            setImageFile(null);
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText('03200035854');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const inputFields = [
        { name: 'name', label: `Name`, type: 'text', required: true },
        { name: 'father', label: `Father's Name`, type: 'text', required: true },
        { name: 'gender', label: `Gender`, type: 'radio', required: true },
        { name: 'email', label: `Email`, type: 'email', required: true },
        { name: 'phone', label: `Phone Number`, type: 'tel', required: true },
        { name: 'cnic', label: `CNIC (National Identity Card Number)`, type: 'text', required: true },
        { name: 'category', label: `Category`, type: 'radio', required: true },
        { name: 'institute', label: `Institute Name`, type: 'text', required: true },
        { name: 'imageFile', label: `Upload Payment Receipt`, type: 'file', required: true },
    ] as const;

    return (
        <section id="register" className="p-6 min-h-screen flex flex-col bg-white min-[400px]:text-base text-sm">
            <h1 className="text-4xl font-bold text-primary mb-8 text-center">Register</h1>
            {successMessage && (
                <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 animate-[bounce_1s_ease-in-out]">
                    <p className="text-green-600 text-center font-semibold bg-green-50 py-2 px-6 rounded-lg border border-green-200 shadow-lg">
                        {successMessage}
                    </p>
                </div>
            )}
            <div className="flex flex-col min-[975px]:space-x-8 min-[975px]:flex-row min-[975px]:items-start items-center justify-center">
                <div className="mb-8 min-[975px]:mb-0 flex-col max-w-[500px] space-y-6">
                    {/* Welcome section with slide-in-left animation */}
                    <motion.div
                        ref={welcomeRef}
                        initial={{ x: -100, opacity: 0 }}
                        animate={welcomeInView ? { x: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="bg-white rounded-xl shadow-lg border-l-4 border-secondary max-[400px]:p-4 max-[320px]:p-2 p-8 flex flex-col items-center text-center first-block-text"
                    >                        <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-3 drop-shadow-sm">Welcome to Literary Fiesta'2025</h2>
                        <p className="text-lg text-gray-700 mb-4 font-medium">An inspiring event dedicated to literature, creative writing, and intellectual discourse for the GMC community and beyond.</p>
                        <div className="my-2">
                            <span className="inline-block bg-secondary text-primary-900 font-semibold px-4 py-1 rounded-full text-base mb-2">May 7th, 2025 &middot; GMCTH Auditorium</span>
                        </div>
                        <p className="text-base text-primary-700 mb-2">Engage with renowned speakers, connect with peers, and be part of a memorable experience.</p>
                    </motion.div>

                    {/* Payment section with fade-in-up animation */}
                    <motion.div
                        ref={paymentRef}
                        initial={{ y: 50, opacity: 0, scale: 0.9 }}
                        animate={paymentInView ? { y: 0, opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
                        className="bg-white border-l-4 border-secondary rounded-xl max-[400px]:p-4 max-[320px]:p-2 p-6 shadow-lg text-center flex flex-col items-center w-full relative"
                    >
                        <span className="inline-block bg-secondary text-primary-900 font-semibold px-4 py-1 rounded-full text-base mb-2">Payment</span>
                        <p className="text-base text-secondary font-bold mb-2">Registration Fee: <span className='text-logo-tertiary'>800 Rs</span></p>
                        <p className="text-sm text-gray-500 mb-2">See payment details below and secure your spot today!</p>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={paymentInView ? { y: 0, opacity: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="bg-[#f3eaff] border-2 border-[#ab9eff] max-w-[300px] rounded-xl p-6 shadow-lg text-center relative flex flex-col items-center"
                        >
                            <h3 className="text-xl font-bold text-[#552e91] mb-3">Easypaisa</h3>
                            <div className="flex flex-col gap-1 items-center w-full">
                                <div className="flex items-center justify-center w-full">
                                    <span className="text-sm font-medium text-[#552e91]">Account:</span>
                                    <span className="font-mono font-bold ml-2 text-[#7e5be9]">03200035854</span>
                                    <button onClick={copyToClipboard} className="ml-2 text-[#7e5be9] hover:text-[#552e91] transition cursor-pointer align-middle">
                                        <Copy size={18} />
                                    </button>
                                </div>
                                <span className="text-sm text-[#552e91] font-semibold">Account Title: <span className="text-[#7e5be9] font-bold">Hamza</span></span>
                            </div>
                            {copied && (
                                <span className="text-xs text-[#552e91] absolute top-4 right-4 bg-[#e9ddff] px-2 py-1 rounded shadow">Copied!</span>
                            )}
                        </motion.div>
                    </motion.div>

                </div>
                <div className={`w-full min-[975px]:min-w-[520px] max-[975px]:max-w-[750px] mb-4 transition-all duration-700 delay-300 transform ${rightInView ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'} flex flex-col justify-center items-center`}>
                    {/* Join section with pulse and bounce animation */}
                    <motion.p
                        ref={joinRef}
                        initial={{ opacity: 0 }}
                        animate={joinInView ?
                            { opacity: 1, scale: [1, 1.05, 1] } :
                            {}}
                        transition={{
                            duration: 1,
                            delay: 0.4,
                            scale: {
                                times: [0, 0.5, 1],
                                duration: 1.5,
                                repeat: Infinity,
                                repeatDelay: 3
                            }
                        }}
                        className="text-center text-lg max-w-[600px] w-full font-bold text-primary-700 my-8 bg-secondary/20 rounded-lg px-4 py-2 shadow-sm"
                    >
                        Ready to join? <span className="text-secondary">Register by filling out this form!</span>
                    </motion.p>
                    <div ref={rightRef} className={`bg-white shadow-[2px_2px_8px_2px_rgba(102,102,153,0.3)] w-full min-[975px]:min-w-[520px] min-[975px]:max-w-[750px] max-[975px]:max-w-[750px] border border-primary-300 p-8 rounded-2xl transition-all duration-700 delay-300 transform ${rightInView ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'} flex justify-center`}>
                        <form onSubmit={handleSubmit} className="space-y-4 w-full">
                            {inputFields.map((field, idx) => {
                                // Each input gets its own in-view hook
                                const [inputRef, inputInView] = useInView<HTMLInputElement | HTMLDivElement>(0.2);
                                return (
                                    <motion.div
                                        key={field.name}
                                        ref={inputRef}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={inputInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.5, delay: 0.05 }}
                                        className="w-full"
                                    >
                                        <label className="block text-primary font-semibold mb-1">{field.label} {field.required && <span className="text-red-500">*</span>}</label>
                                        {field.type !== 'radio' && field.type !== 'file' ? (
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                value={formData[field.name as keyof typeof formData]}
                                                onChange={handleChange}
                                                className={`w-full p-3 border rounded-lg focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 ${errors[field.name as keyof typeof errors] ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder={`Enter your ${field.label.toLowerCase()}`}
                                                required={field.required}
                                            />
                                        ) : field.name === 'category' ? (
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className={`w-full cursor-pointer p-3 border rounded-lg focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                                                required
                                            >
                                                <option value="">Select category</option>
                                                {CATEGORY_OPTIONS.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        ) : field.type === 'radio' ? (
                                            <div className="flex flex-col">
                                                <label className="inline-flex items-center">
                                                    <input type="radio" name={field.name} value="Male" checked={formData[field.name] === 'Male'} onChange={handleChange} className="form-radio text-[#552e91] focus:outline-none focus:ring-1 focus:ring-[#552e91] rounded-full" required />
                                                    <span className="ml-2">Male</span>
                                                </label>
                                                <label className="inline-flex items-center">
                                                    <input type="radio" name={field.name} value="Female" checked={formData[field.name] === 'Female'} onChange={handleChange} className="form-radio text-[#552e91] focus:outline-none focus:ring-1 focus:ring-[#552e91] rounded-full" required />
                                                    <span className="ml-2">Female</span>
                                                </label>
                                            </div>
                                        ) : field.type === 'file' && (
                                            <div className="relative w-full">
                                                <input
                                                    id="image-upload"
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/jpg"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                                <label htmlFor="image-upload" className="w-full flex items-center justify-start px-4 py-3 bg-white border rounded-lg cursor-pointer focus:outline-none transition-all duration-300 focus:ring-1 border-gray-300 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 text-gray-500">
                                                    {imageFile ? imageFile.name : 'Click to select image (jpg, jpeg, png)'}
                                                </label>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    Max size: 250KB. Supported formats: jpg, jpeg, png
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    If your image is too large, compress it at <a href="https://imagecompressor.11zon.com/en/image-compressor/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">this link</a>.
                                                </p>
                                                {errors.imageFile && (
                                                    <p className="text-red-500 text-sm mt-1 animate-[pulse_0.5s_ease-in-out]">
                                                        Please upload a valid image (max 250KB, jpg/jpeg/png).
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        {errors[field.name as keyof typeof errors] && (
                                            <p className="text-red-500 text-sm mt-1 animate-[pulse_0.5s_ease-in-out]">
                                                {field.label} is required.
                                            </p>
                                        )}
                                    </motion.div>
                                );
                            })}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={rightInView ? { y: 0, opacity: 1 } : {}}
                                transition={{ duration: 0.5, delay: 0.8 }}
                                className="w-full"
                            >
                                <button
                                    type="submit"
                                    className="w-full bg-primary cursor-pointer font-semibold text-white p-3 rounded-lg hover:bg-secondary hover:text-primary-900 hover:scale-[1.02] transition-all duration-300 shadow-md flex justify-center items-center disabled:opacity-60 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    {loading ?
                                        <span className="animate-spin border-4 border-[#552e91] border-t-transparent rounded-full w-6 h-6 inline-block"></span> :
                                        'Register'
                                    }
                                </button>
                            </motion.div>
                        </form>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default RegisterClient;
