'use client';

import EventsManager from '../../components/admin/EventsManager';
import { PublishType } from '@/types/publish';
import PublishConfirmModal from '../../components/admin/publish/PublishConfirmModal';
import PublishSuccessMessage from '../../components/admin/publish/PublishSuccessMessage';
import AuthProvider from '../../components/admin/auth/AuthProvider';
import ProfileDropdown from '../../components/admin/auth/ProfileDropdown';
import AdminActions from '../../components/admin/publish/AdminActions';
import AdminAccessDenied from '../../components/admin/auth/AdminAccessDenied';
import { SimpleSpinner } from '@/components/Spinner';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { DriveImage } from '@/types/googleDrive';
import { ALLOWED_EMAILS, MERGE_EMAILS } from '@/components/utils';
import { TriangleAlert } from 'lucide-react';
import { useIsOnline } from '@/components/context/IsOnlineContext';

interface AdminClientProps {
    driveImages: DriveImage[];
}

const allEmails = false;

export default function AdminClient({ driveImages }: AdminClientProps) {
    const allowedEmails = allEmails ? MERGE_EMAILS : ALLOWED_EMAILS;
    const [showDropdown, setShowDropdown] = useState(false);
    const [showPublishConfirm, setShowPublishConfirm] = useState(false);
    const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
    const [publishType, setPublishType] = useState<PublishType | null>(null);
    const [publishLoading, setPublishLoading] = useState(false);

    const isOnline = useIsOnline();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }
            setTimeout(() => {
                window.scrollTo(0, 0);
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }, 100);
        }
    }, []);

    // useEffect(() => {
    //     const unsubscribe = auth.onAuthStateChanged(() => {
    //         setShowDropdown(false);
    //     });
    //     return () => unsubscribe();
    // }, []);

    const handlePublishConfirm = async () => {
        setShowPublishConfirm(false);
        setPublishLoading(true);
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Not authenticated');
            const token = await user.getIdToken();
            let body = {};
            if (publishType === PublishType.Build) {
                body = { mode: PublishType.Build };
            }
            const res = await fetch('/api/publish', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.success) {
                setPublishSuccess(data.message || (publishType === PublishType.Build ? 'Full rebuild successful!' : 'Revalidation successful!'));
                setTimeout(() => setPublishSuccess(null), 3000);
            } else {
                alert(data.error || 'Publish failed.');
            }
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Publish failed.');
        } finally {
            setPublishLoading(false);
        }
    };

    return (
        <AuthProvider allowedEmails={allowedEmails}>
            {({ isLoggedIn, allowed, userEmail, loading, handleGoogleLogin, handleLogout }) => (
                <div>                    
                    {!isOnline ?
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className='min-h-[80vh] pt-10 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50'
                        >
                            <motion.div 
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                                className="max-w-md mx-4 text-center"
                            >
                                <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-red-500">
                                    <motion.div
                                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                        className="flex justify-center mb-6"
                                    >
                                        <div className="bg-red-100 p-4 rounded-full">
                                            <TriangleAlert className="w-12 h-12 text-red-600" />
                                        </div>
                                    </motion.div>
                                    
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                        You're Offline
                                    </h2>
                                    
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        The admin panel requires an internet connection to function properly. 
                                        Please check your network settings and try again.
                                    </p>
                                    
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                        <p className="text-red-700 font-medium text-sm">
                                            ⚠️ This page won't work offline
                                        </p>
                                    </div>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => window.location.reload()}
                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        Try Again
                                    </motion.button>
                                </div>
                                
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="mt-6 text-sm text-gray-500"
                                >
                                    <p>Need help? Check your:</p>
                                    <ul className="my-2 space-y-1">
                                        <li>• WiFi connection</li>
                                        <li>• Mobile data</li>
                                        <li>• Network settings</li>
                                    </ul>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                        :
                        isLoggedIn ? (
                            allowed ? (
                                <div className="relative">
                                    <ProfileDropdown
                                        userEmail={userEmail}
                                        showDropdown={showDropdown}
                                        setShowDropdown={setShowDropdown}
                                        handleLogout={handleLogout}
                                    />
                                    <EventsManager driveImages={driveImages} />
                                    <AdminActions
                                        loading={publishLoading}
                                        setShowPublishConfirm={setShowPublishConfirm}
                                        setPublishType={setPublishType}
                                        publishType={publishType}
                                    />
                                </div>
                            ) : (
                                <AdminAccessDenied userEmail={userEmail} handleLogout={handleLogout} />
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-100">
                                <h1 className="text-2xl text-accent font-bold mb-4">Please log in to access the Events Manager</h1>
                                <motion.button
                                    initial={{ scale: 0.8, opacity: 0, x: -40 }}
                                    animate={{ scale: 1, opacity: 1, x: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    whileHover={{ scale: 1.05, x: 5 }}
                                    whileTap={{ scale: 0.97, x: -2 }}
                                    className="bg-accent hover:bg-accent-light text-white font-bold px-4 py-2 rounded shadow-sm transition-all duration-200 focus:outline-none flex items-center gap-3 mb-2"
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                >
                                    {loading ? <SimpleSpinner /> : (
                                        <svg
                                            viewBox="-3 0 262 262"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-6 h-6"
                                        >
                                            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                            <g id="SVGRepo_iconCarrier">
                                                <path
                                                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                                                    fill="#4285F4"
                                                />
                                                <path
                                                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                                                    fill="#34A853"
                                                />
                                                <path
                                                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                                                    fill="#FBBC05"
                                                />
                                                <path
                                                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                                                    fill="#EB4335"
                                                />
                                            </g>
                                        </svg>
                                    )}
                                    <span>Sign in</span>
                                </motion.button>
                            </div>
                        )}
                    <PublishConfirmModal
                        show={showPublishConfirm}
                        loading={loading}
                        publishType={publishType}
                        onConfirm={handlePublishConfirm}
                        onCancel={() => setShowPublishConfirm(false)}
                    />
                    <PublishSuccessMessage message={publishSuccess} />
                </div>
            )}
        </AuthProvider>
    );
}
