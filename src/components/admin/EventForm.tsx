import React, { useState, useEffect, useRef } from "react";
import { EventData } from "@/components/events/types";
import SpeakersSection from "./SpeakersSection";
import SubeventsSection from "./subevents/SubeventsSection";
import { FolderType } from "@/types/googleDrive";
import { SimpleSpinner } from "../Spinner";
import { RefreshCcw } from "lucide-react";
import { DriveImage } from '@/types/googleDrive';
import Image from "next/image";

type EventFormProps = {
    form: Partial<EventData>;
    editing: boolean;
    loading: boolean;
    error: string | null;
    events: EventData[];
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleSpeakerChange: (idx: number, field: "name" | "bio", value: string) => void;
    handleAddSpeaker: () => void;
    handleRemoveSpeaker: (idx: number) => void;
    handleCancel: () => void;
    driveImages?: DriveImage[];
};

export default function EventForm({
    form,
    editing,
    loading,
    error,
    events,
    handleChange,
    handleSubmit,
    handleSpeakerChange,
    handleAddSpeaker,
    handleRemoveSpeaker,
    handleCancel,
    driveImages: staticDriveImages,
}: EventFormProps) {

    // Track whether the user has manually edited the slug
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    // Track when the slug is deliberately cleared
    const [slugManuallyCleared, setSlugManuallyCleared] = useState(false);

    // Check for duplicate slugs whenever slug or editing changes
    const [slugExists, setSlugExists] = useState(false);
    const [slugHasSpaces, setSlugHasSpaces] = useState(false);

    // Check if slug contains spaces
    useEffect(() => {
        if (!form.slug) {
            setSlugExists(false);
            setSlugHasSpaces(false);
            return;
        }

        // Check if slug contains spaces
        setSlugHasSpaces(form.slug.includes(' '));

        // Check if any other event (not the one being edited) has the same slug
        const duplicate = events.find(
            event => event.slug === form.slug && (editing === false || (editing === true && event.id !== form.id))
        );

        setSlugExists(!!duplicate);
    }, [form.slug, events, editing, form.id]);

    // Main event image upload state
    const [mainImageUploading, setMainImageUploading] = useState(false);
    const [mainImageError, setMainImageError] = useState("");

    // New: Google Drive images state, updated with size information
    const [driveImages, setDriveImages] = useState(staticDriveImages || []);
    const [driveLoading, setDriveLoading] = useState(false);
    const [driveError, setDriveError] = useState<string | null>(null);

    // Fetch latest images from Drive
    const refreshDriveImages = async () => {
        setDriveLoading(true);
        setDriveError(null);
        try {
            const res = await fetch('/api/drive-images');
            const data = await res.json();
            if (data.success && Array.isArray(data.images)) {
                setDriveImages(data.images);
            } else {
                setDriveError(data.error || 'Failed to fetch images');
            }
        } catch (err) {
            setDriveError('Failed to fetch images');
        }
        setDriveLoading(false);
    };

    // New: Handler for selecting image from library (simplified)
    const handleSelectMainImageFromLibrary = (url: string) => {
        handleChange({ target: { name: 'image', value: url } } as any);
        setShowImageModal(false);
    };

    // Main event image upload handler
    const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            setMainImageError('Only PNG, JPG, and JPEG formats are supported.');
            return;
        }
        if (file.size > 250 * 1024) {
            setMainImageError('File size must be less than 250KB.');
            return;
        }
        setMainImageUploading(true);
        setMainImageError("");
        handleChange({ target: { name: 'image', value: 'uploading' } } as any);
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('folderType', FolderType.Events);
            const res = await fetch('/api/image-upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.success && data.url) {
                handleChange({ target: { name: 'image', value: data.url } } as any);
                setMainImageError("");
                // Refresh drive images after upload
                await refreshDriveImages();
            } else {
                setMainImageError('Image upload failed: ' + (data.error || 'Unknown error'));
                handleChange({ target: { name: 'image', value: '' } } as any);
            }
        } catch (err) {
            setMainImageError('Image upload failed.');
            handleChange({ target: { name: 'image', value: '' } } as any);
        }
        setMainImageUploading(false);
    };

    // Slug auto-update logic
    const prevTitle = useRef(form.title);
    React.useEffect(() => {
        // Do NOT regenerate slug if it was manually cleared
        if (slugManuallyCleared) {
            return;
        }

        // Only update slug if title exists and user hasn't manually edited the slug
        if (form.title && form.title.trim() !== "" && !slugManuallyEdited) {
            const autoSlug = form.title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");

            // Only update when field is empty (excluding the case where user cleared it)
            if (form.slug === undefined || form.slug === "") {
                handleChange({
                    target: {
                        name: "slug",
                        value: autoSlug,
                        type: "text"
                    }
                } as any);
            }
        }

        // Save current title for comparison in next render
        prevTitle.current = form.title;
    }, [form.title, form.slug, slugManuallyEdited, slugManuallyCleared]);

    // Modal state for image selection
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageTab, setImageTab] = useState<'upload' | 'library'>('upload');

    // Custom handler for slug changes to track when it's manually edited
    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // If the field is being cleared, mark it as deliberately cleared
        if (e.target.value === '') {
            setSlugManuallyCleared(true);
        } else {
            // Otherwise, track that user has manually edited the slug
            setSlugManuallyEdited(true);
        }

        // Pass the change to the regular handler
        handleChange(e);
    };

    return (
        <form onSubmit={(e) => {
            // Prevent form submission if slug contains spaces
            if (form.slug && form.slug.includes(' ')) {
                e.preventDefault();
                return;
            }
            handleSubmit(e);
        }} className="bg-white border-l-4 border-secondary rounded-2xl shadow-[2px_2px_8px_2px_rgba(102,102,153,0.15)] max-[480px]:px-4 max-[360px]:px-2 p-8 mb-10 w-full max-w-2xl space-y-5 transition-all duration-700">
            <h2 className="text-2xl font-extrabold text-primary mb-4 drop-shadow-sm">{editing ? "Edit Event" : "Add Event"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <label htmlFor="title" className="block text-primary font-semibold mb-1">Title <span className='text-red-500'>*</span></label>
                    <input id="title" name="title" value={form.title || ""} onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 border-gray-300 text-black" required />
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="slug" className="block text-primary font-semibold mb-1">Url <span className='text-red-500'>*</span></label>
                    <div className="flex items-center space-x-2">
                        <input
                            id="slug"
                            name="slug"
                            value={form.slug || ""}
                            onChange={handleSlugChange}
                            className={`flex-1 p-3 border w-full rounded-lg focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 border-gray-300 ${slugExists || slugHasSpaces ? 'border-red-500 focus:ring-red-500 hover:border-red-500/80 text-red-800' : ''}`}
                            placeholder="Auto-generated from title or set manually"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => {
                                if (form.title) {
                                    const autoSlug = form.title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
                                    handleChange({
                                        target: {
                                            name: "slug",
                                            value: autoSlug,
                                            type: "text"
                                        }
                                    } as any);
                                    // Reset manual flags since we're intentionally regenerating
                                    setSlugManuallyEdited(false);
                                    setSlugManuallyCleared(false);
                                }
                            }}
                            className="bg-primary text-white px-2 py-2 max-h-9 rounded-lg hover:bg-primary-600 transition-colors"
                            title="Auto-generate URL from title"
                            disabled={!form.title}
                        >
                            <RefreshCcw className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="text-xs mt-1 flex justify-between">
                        {slugExists && <span className="text-red-500 font-medium">URL already exists!</span>}
                        {slugHasSpaces && <span className="text-red-500 font-medium">URL cannot contain spaces!</span>}
                    </div>
                </div>
                <div>
                    <label htmlFor="date" className="block text-primary font-semibold mb-1">Date <span className='text-red-500'>*</span></label>
                    <input id="date" name="date" value={form.date || ""} onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 border-gray-300 text-black" required />
                </div>
                <div>
                    <label htmlFor="time" className="block text-primary font-semibold mb-1">Time <span className='text-red-500'>*</span></label>
                    <input id="time" name="time" value={form.time || ""} onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 border-gray-300 text-black" required />
                </div>
                <div className="w-full sm:col-span-2">
                    <label htmlFor="venue" className="block text-primary font-semibold mb-1">Venue <span className='text-red-500'>*</span></label>
                    <input id="venue" name="venue" value={form.venue || ""} onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 border-gray-300 text-black" required />
                </div>
                <div className="w-full sm:col-span-2">
                    <label htmlFor="audience" className="block text-primary font-semibold mb-1">Audience <span className='text-red-500'>*</span></label>
                    <input id="audience" name="audience" value={form.audience || ""} onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 border-gray-300 text-black" required />
                </div>

            </div>
            <div>
                <label className="block text-primary font-semibold mb-1">Event Image <span className='text-red-500'>*</span></label>
                <div className="w-full flex items-center justify-start px-4 py-3 bg-white border rounded-lg cursor-pointer focus:outline-none transition-all duration-300 focus:ring-1 border-gray-300 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 text-gray-500"
                    onClick={() => setShowImageModal(true)}
                    title="Click to change image"
                >
                    <span>{form.image && form.image !== 'uploading' ? 'Change Image' : 'Click to select image (jpg, jpeg, png)'}</span>
                </div>
                {form.image && form.image !== 'uploading' && (
                    <Image src={form.image} alt={form.title || ''} title="Event" width={96} height={96} className="mt-2 rounded" />
                )}
                <p className="text-xs text-gray-600 mt-1">
                    Max size: 250KB. Supported formats: jpg, jpeg, png
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    If your image is too large, compress it at <a href="https://imagecompressor.11zon.com/en/image-compressor/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">this link</a>.
                </p>
                {mainImageError && (
                    <p className="text-red-500 text-sm mt-1 animate-[pulse_0.5s_ease-in-out]">{mainImageError}</p>
                )}
                {mainImageUploading && <div className="p-1"><SimpleSpinner className='w-5 h-5' /></div>}
            </div>

            {/* Modal for image selection */}
            {showImageModal && (
                <div className="fixed inset-0 z-50 flex items-center h-screen justify-center bg-black/40">
                    <div className="bg-white max-[510px]:px-2 max-[510px]:pt-10 max-[510px]:mx-1 rounded-lg p-6 max-w-lg w-full relative">
                        <button className="absolute top-2 right-2 text-xl" onClick={() => setShowImageModal(false)}>&times;</button>
                        <div className="flex gap-2 mb-4">
                            <button type="button" className={`px-3 py-1 rounded ${imageTab === 'upload' ? 'bg-primary text-white' : 'bg-gray-200 text-primary'}`} onClick={() => setImageTab('upload')}>Upload from PC</button>
                            <button type="button" className={`px-3 py-1 rounded ${imageTab === 'library' ? 'bg-primary text-white' : 'bg-gray-200 text-primary'}`} onClick={() => setImageTab('library')}>Select from Library</button>
                        </div>
                        {imageTab === 'upload' && (
                            <>
                                <input
                                    id="image-upload-modal"
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    style={{ display: 'none' }}
                                    onChange={async (e) => {
                                        await handleMainImageChange(e);
                                        setShowImageModal(false);
                                    }}
                                    disabled={mainImageUploading}
                                />
                                <label htmlFor="image-upload-modal" className="w-full flex items-center justify-center px-4 py-3 bg-white border rounded-lg cursor-pointer focus:outline-none transition-all duration-300 focus:ring-1 border-gray-300 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 text-gray-500">
                                    {mainImageUploading ? <SimpleSpinner className='w-5 h-5' /> : 'Click to select image (jpg, jpeg, png)'}
                                </label>
                            </>
                        )}
                        {imageTab === 'library' && (
                            <div>
                                <div className="font-bold text-lg mb-2 text-primary-700 text-center">Select an image from your library</div>
                                {driveLoading && <div className="text-center py-6"><SimpleSpinner /></div>}
                                {driveError && <div className="text-red-500 text-center py-4">{driveError}</div>}
                                {!driveLoading && !driveError && driveImages.length === 0 && (
                                    <div className="text-gray-500 text-center py-8">No images found in your Google Drive folder.</div>
                                )}
                                <div className="flex justify-start mb-2">
                                    <button
                                        type="button"
                                        className="px-3 py-1 font-semibold rounded bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
                                        disabled={driveLoading}
                                        onClick={async () => {
                                            setDriveLoading(true);
                                            setDriveError(null);
                                            try {
                                                const res = await fetch('/api/cleanup-unused', { method: 'POST' });
                                                const data = await res.json();
                                                if (data.success) {
                                                    await refreshDriveImages();
                                                    alert(`Deleted ${data.count} unused image(s).`);
                                                } else {
                                                    setDriveError(data.error || 'Failed to remove unused images');
                                                }
                                            } catch (err) {
                                                setDriveError('Failed to remove unused images');
                                            }
                                            setDriveLoading(false);
                                        }}
                                    >
                                        Remove unused images
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 max-[510px]:grid-cols-2 overflow-x-hidden gap-3 max-h-72 overflow-y-auto p-1">
                                    {driveImages.map(img => (
                                        <button
                                            key={img.id}
                                            type="button"
                                            className="relative group focus:outline-none"
                                            title={img.isOverSizeLimit
                                                ? `${img.name} (${img.sizeKB}KB - Too large, max size is 250KB)`
                                                : `${img.name} (${img.sizeKB}KB)`}
                                            onClick={() => !img.isOverSizeLimit && handleSelectMainImageFromLibrary(img.url)}
                                            disabled={img.isOverSizeLimit}
                                        >
                                            <div className="relative">
                                                <Image
                                                    src={img.url}
                                                    alt={img.name}
                                                    height={96}
                                                    width={96}
                                                    className={`rounded border-2 transition-all shadow-sm h-24 w-full object-cover bg-white
                                                        ${img.isOverSizeLimit
                                                            ? 'border-red-500 opacity-70'
                                                            : 'border-transparent group-hover:border-primary-500 group-focus:border-primary-600'}`}
                                                />
                                                {img.isOverSizeLimit && (
                                                    <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                                                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
                                                            {img.sizeKB}KB (Too large)
                                                        </span>
                                                    </div>
                                                )}
                                                <span className={`absolute bottom-1 left-1 right-1 bg-black/60 text-white text-xs rounded px-1 py-0.5 
                                                    ${img.isOverSizeLimit ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus:opacity-100'} transition`}>
                                                    {img.name} {img.sizeKB && `(${img.sizeKB}KB)`}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div>
                <div className="flex items-center mt-2">
                    <input
                        id="register"
                        name="register"
                        type="checkbox"
                        checked={!!form.register}
                        onChange={e => handleChange({
                            target: {
                                name: 'register',
                                value: e.target.checked,
                                type: 'checkbox',
                            }
                        } as any)}
                        className="mr-2 h-5 my-3 w-5 text-secondary focus:ring-secondary border-gray-300 rounded"
                    />
                    <label htmlFor="register" className="text-primary font-semibold select-none cursor-pointer">Enable registration for this event</label>
                </div>
                {/* {form.register && (
                    <div>
                        <label htmlFor="registrationLink" className="block text-primary font-semibold mb-1 mt-2">Registration Link <span className='text-red-500'>*</span></label>
                        <input
                            id="registrationLink"
                            name="registrationLink"
                            value={form.registrationLink || '/register'}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 border-gray-300 text-black"
                            placeholder="/page name"
                            required
                        />
                    </div>
                )} */}
            </div>
            <div>
                <label htmlFor="activities" className="block text-primary font-semibold mb-1">Activities <span className='text-red-500'>*</span></label>
                <textarea id="activities" name="activities" value={form.activities || ""} onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 border-gray-300 text-black" rows={2} required />
            </div>
            <div>
                <label htmlFor="description" className="block text-primary font-semibold mb-1">Description <span className='text-red-500'>*</span></label>
                <textarea id="description" name="description" value={form.description || ""} onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 border-gray-300 text-black" rows={3} required />
            </div>

            <SpeakersSection
                speakers={form.speakers || []}
                handleSpeakerChange={handleSpeakerChange}
                handleAddSpeaker={handleAddSpeaker}
                handleRemoveSpeaker={handleRemoveSpeaker}
            />
            <SubeventsSection
                form={form}
                driveImages={driveImages}
                handleChange={handleChange}
                refreshDriveImages={refreshDriveImages}
            />
            <div className="flex gap-4 mt-2">
                <button type="submit" className="w-full bg-primary cursor-pointer font-semibold text-white p-3 rounded-lg hover:bg-secondary hover:text-primary-900 hover:scale-[1.02] transition-all duration-300 shadow-md flex justify-center items-center disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading}>{editing ? "Update" : "Add"} Event</button>
                {editing && <button type="button" className="w-full bg-gray-200 hover:bg-gray-300 text-primary-700 font-bold p-3 rounded-lg shadow-md" onClick={handleCancel}>Cancel</button>}
            </div>
            {error && <div className="text-red-500 text-sm mt-2 animate-[pulse_0.5s_ease-in-out]">{error}</div>}
        </form>
    );
}