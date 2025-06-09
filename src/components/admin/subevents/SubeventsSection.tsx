import React, { useMemo, useRef, useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { SimpleSpinner } from "../../Spinner";
import SubeventSpeakersSection from "./SubeventSpeakersSection";
import { EventData } from "@/components/events/types";
import { FolderType } from "@/types/googleDrive";
import Image from "next/image";

// Define a SubeventSpeaker interface with an id
interface SubeventSpeaker {
    name: string;
    bio: string;
    id: string;
}

// Update SubeventWithError to use SubeventSpeaker
interface SubeventWithError {
    time: string;
    title: string;
    description?: string;
    imageUrl?: string;
    speakers?: SubeventSpeaker[];
    imageError?: string;
    order?: number; // For drag-and-drop reordering
    id: string; // Unique id for React key and dnd-kit
}

interface SubeventsSectionProps {
    form: Partial<EventData>;
    driveImages: { id: string, name: string, url: string, sizeKB?: number, isOverSizeLimit?: boolean }[];
    handleChange: (e: any) => void;
    refreshDriveImages?: () => Promise<void>;
}

const SubeventsSection: React.FC<SubeventsSectionProps> = ({
    form,
    driveImages,
    handleChange,
    refreshDriveImages
}) => {
    // State to control which subevent's image modal is open and which tab is active
    const [showSubeventImageModalIdx, setShowSubeventImageModalIdx] = useState<number | null>(null);
    const [subeventImageTab, setSubeventImageTab] = useState<'upload' | 'library'>('upload');
    const [removeUnusedLoading, setRemoveUnusedLoading] = useState(false);
    const [removeUnusedError, setRemoveUnusedError] = useState<string | null>(null);

    const [driveLoading, setDriveLoading] = useState(false);
    const [driveError, setDriveError] = useState<string | null>(null);

    // Store a stable reference to a counter for generating unique IDs
    const idCounterRef = useRef(0);
    // Create a stable ID generator function
    const generateUniqueId = (prefix: string) => `${prefix}-${++idCounterRef.current}-${Math.random().toString(36).slice(2)}`;

    // Ensure subevents and their speakers always have stable IDs
    const normalizedSubevents = useMemo(() => {
        return ((form.subevents as SubeventWithError[]) || []).map(sub => {
            // Assume sub.id already exists and is stable
            // Ensure speakers within the subevent also have stable IDs
            const speakers = (sub.speakers || []).map((sp: SubeventSpeaker) => {
                // Assume sp.id already exists and is stable
                // If an ID is missing here, it's an issue with how speakers are added/managed
                return { ...sp, id: sp.id };
            });
            // If sub.id is missing here, it's an issue with how subevents are added/managed
            return { ...sub, id: sub.id, speakers };
        });
    }, [form.subevents]);

    // Local state for subevent image uploading and errors
    const [subeventUploading, setSubeventUploading] = useState<boolean[]>(Array(normalizedSubevents.length).fill(false));
    const [subeventImageErrors, setSubeventImageErrors] = useState<string[]>(Array(normalizedSubevents.length).fill(""));


    const handleRemoveSubeventSpeaker = (subIdx: number, sIdx: number) => {
        const updated = [...normalizedSubevents];
        const speakers = [...(updated[subIdx].speakers || [])];
        if (sIdx >= 0 && sIdx < speakers.length) {
            speakers.splice(sIdx, 1);
            updated[subIdx] = { ...updated[subIdx], speakers };
            handleChange({ target: { name: 'subevents', value: updated } } as any);
        }
    };

    const handleAddSubeventSpeaker = (subIdx: number) => {
        const updated = [...normalizedSubevents];
        const newSpeaker = { name: '', bio: '', id: generateUniqueId('speaker') };
        const speakers = [
            ...(updated[subIdx].speakers || []),
            newSpeaker
        ];
        updated[subIdx] = { ...updated[subIdx], speakers };
        handleChange({ target: { name: 'subevents', value: updated } } as any);
    };

    // Handle subevent move up/down
    const handleMoveSubevent = (fromIdx: number, toIdx: number) => {
        if (toIdx < 0 || toIdx >= normalizedSubevents.length) return;
        const updated = [...normalizedSubevents];
        const [moved] = updated.splice(fromIdx, 1);
        updated.splice(toIdx, 0, moved);
        const withOrder = updated.map((sub, i) => ({ ...sub, order: i }));
        handleChange({ target: { name: 'subevents', value: withOrder } } as any);
    };

    const handleSelectSubeventImageFromLibrary = (idx: number, url: string) => {
        const updated = [...normalizedSubevents];
        updated[idx] = { ...updated[idx], imageUrl: url, imageError: '' };
        handleChange({ target: { name: 'subevents', value: updated } } as any);
        setShowSubeventImageModalIdx(null);
    };

    // Sync state arrays if subevents length changes
    useEffect(() => {
        setSubeventUploading(arr => arr.length === normalizedSubevents.length ? arr : Array(normalizedSubevents.length).fill(false));
        setSubeventImageErrors(arr => arr.length === normalizedSubevents.length ? arr : Array(normalizedSubevents.length).fill(""));
    }, [normalizedSubevents.length]);

    // Dedicated handler for subevent image upload
    const handleSubeventImageChange = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        let updated = [...(form.subevents || [])] as SubeventWithError[];
        if (!allowedTypes.includes(file.type)) {
            updated[idx] = { ...updated[idx], imageError: 'Only PNG, JPG, and JPEG formats are supported.' };
            setSubeventImageErrors(errors => {
                const arr = [...errors]; arr[idx] = 'Only PNG, JPG, and JPEG formats are supported.'; return arr;
            });
            handleChange({ target: { name: 'subevents', value: updated } } as any);
            return;
        }
        if (file.size > 250 * 1024) {
            updated[idx] = { ...updated[idx], imageError: 'File size must be less than 250KB.' };
            setSubeventImageErrors(errors => {
                const arr = [...errors]; arr[idx] = 'File size must be less than 250KB.'; return arr;
            });
            handleChange({ target: { name: 'subevents', value: updated } } as any);
            return;
        }
        setSubeventUploading(arr => { const copy = [...arr]; copy[idx] = true; return copy; });
        setSubeventImageErrors(errors => { const arr = [...errors]; arr[idx] = ''; return arr; });
        updated[idx] = { ...updated[idx], imageUrl: 'uploading', imageError: '' };
        handleChange({ target: { name: 'subevents', value: updated } } as any);
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('folderType', FolderType.Events);
            const res = await fetch('/api/image-upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            updated = [...(form.subevents || [])] as SubeventWithError[];
            if (data.success && data.url) {
                updated[idx] = { ...updated[idx], imageUrl: data.url, imageError: '' };
                setSubeventImageErrors(errors => { const arr = [...errors]; arr[idx] = ''; return arr; });
                if (refreshDriveImages) await refreshDriveImages();
            } else {
                updated[idx] = { ...updated[idx], imageUrl: '', imageError: 'Image upload failed: ' + (data.error || 'Unknown error') };
                setSubeventImageErrors(errors => { const arr = [...errors]; arr[idx] = 'Image upload failed: ' + (data.error || 'Unknown error'); return arr; });
            }
        } catch (err) {
            updated = [...(form.subevents || [])] as SubeventWithError[];
            updated[idx] = { ...updated[idx], imageUrl: '', imageError: 'Image upload failed.' };
            setSubeventImageErrors(errors => { const arr = [...errors]; arr[idx] = 'Image upload failed.'; return arr; });
        }
        setSubeventUploading(arr => { const copy = [...arr]; copy[idx] = false; return copy; });
        handleChange({ target: { name: 'subevents', value: updated } } as any);
    };

    // Subevent state and handlers remain
    // Subevent speaker handlers
    const handleSubeventChange = (idx: number, field: string, value: unknown) => {
        const updated = [...normalizedSubevents];
        updated[idx] = { ...updated[idx], [field]: value };
        handleChange({ target: { name: 'subevents', value: updated } } as any);
    };

    const handleAddSubevent = () => {
        const newSubevent = {
            time: '',
            title: '',
            description: '',
            speakers: [],
            id: generateUniqueId('subevent')
        };
        const updated = [
            ...normalizedSubevents,
            newSubevent
        ];
        handleChange({ target: { name: 'subevents', value: updated } } as any);
    };

    const handleRemoveSubevent = (idx: number) => {
        const updated = [...normalizedSubevents];
        updated.splice(idx, 1);
        handleChange({ target: { name: 'subevents', value: updated } } as any);
    };

    const handleSubeventSpeakerChange = (subIdx: number, sIdx: number, field: "name" | "bio", value: string) => {
        const updated = [...normalizedSubevents];
        const speakers = [...(updated[subIdx].speakers || [])];
        if (speakers[sIdx]) {
            speakers[sIdx] = { ...speakers[sIdx], [field]: value };
            updated[subIdx] = { ...updated[subIdx], speakers };
            handleChange({ target: { name: 'subevents', value: updated } } as any);
        }
    };

    return (
        <div>
            <label className="block text-primary font-semibold text-xl mb-2">Event Segments (Subevents)</label>
            <div className="space-y-2">
                {normalizedSubevents.map((sub, idx) => (
                    <div key={sub.id} className="border-l-4 border-primary-400 pl-4 p-3 py-2 bg-[#f6f6ff] rounded mb-2 flex flex-col">
                        <div className="flex items-center mb-2 text-gray-400">
                            <span className="text-primary font-bold">Segment: {idx + 1}</span>
                            <div className="ml-auto flex gap-1">
                                <button
                                    type="button"
                                    className="p-1 rounded text-primary-600 bg-primary-100 hover:bg-primary-200 disabled:opacity-50"
                                    onClick={() => handleMoveSubevent(idx, idx - 1)}
                                    disabled={idx === 0}
                                    title="Move Up"
                                >
                                    <ArrowUp size={18} />
                                </button>
                                <button
                                    type="button"
                                    className="p-1 rounded text-primary-600 bg-primary-100 hover:bg-primary-200 disabled:opacity-50"
                                    onClick={() => handleMoveSubevent(idx, idx + 1)}
                                    disabled={idx === normalizedSubevents.length - 1}
                                    title="Move Down"
                                >
                                    <ArrowDown size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mb-2">
                            <input
                                type="text"
                                value={sub.time || ""}
                                onChange={e => handleSubeventChange(idx, "time", e.target.value)}
                                className="w-full p-3 bg-white border rounded-lg focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 border-gray-300 text-black"
                                placeholder="Time (e.g. 10:00 AM)"
                                required
                            />
                            <input
                                type="text"
                                value={sub.title || ""}
                                onChange={e => handleSubeventChange(idx, "title", e.target.value)}
                                className="w-full p-3 bg-white border rounded-lg focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 border-gray-300 text-black"
                                placeholder="Segment Title"
                                required
                            />
                        </div>
                        <div className="flex flex-col my-3">
                            <label className="block text-primary font-semibold mb-1">Segment Image </label>
                            <div className="w-full flex items-center justify-start px-4 py-3 bg-white border rounded-lg cursor-pointer focus:outline-none transition-all duration-300 focus:ring-1 border-gray-300 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 text-gray-500"
                                onClick={() => setShowSubeventImageModalIdx(idx)}
                                title="Click to change image"
                            >
                                <span>{sub.imageUrl && sub.imageUrl !== 'uploading' ? 'Change Image' : 'Click to select image (jpg, jpeg, png)'}</span>
                            </div>
                            {sub.imageUrl && sub.imageUrl !== 'uploading' && (
                                <Image alt={sub.title} width={96} height={96} src={sub.imageUrl} title="Event" className="mt-2 rounded" />
                            )}
                            <p className="text-xs text-gray-600 mt-1">
                                Max size: 250KB. Supported formats: jpg, jpeg, png
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                If your image is too large, compress it at <a href="https://imagecompressor.11zon.com/en/image-compressor/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">this link</a>.
                            </p>
                            {subeventImageErrors[idx] && (
                                <p className="text-red-500 text-sm mt-1 animate-[pulse_0.5s_ease-in-out]">
                                    {subeventImageErrors[idx]}
                                </p>
                            )}
                            {subeventUploading[idx] && <div className="p-1"><SimpleSpinner className='w-5 h-5' /></div>}
                        </div>

                        {/* Modal for image selection - exact match from EventForm.tsx */}
                        {showSubeventImageModalIdx === idx && (
                            <div className="fixed inset-0 z-50 flex items-center h-screen justify-center bg-black/40">
                                <div className="bg-white max-[510px]:px-2 max-[510px]:pt-10 max-[510px]:mx-1 rounded-lg p-6 max-w-lg w-full relative">
                                    <button className="absolute top-2 right-2 text-xl" onClick={() => setShowSubeventImageModalIdx(null)}>&times;</button>
                                    <div className="flex gap-2 mb-4">
                                        <button
                                            type="button"
                                            className={`px-3 py-1 rounded ${subeventImageTab === 'upload' ? 'bg-primary text-white' : 'bg-gray-200 text-primary'}`}
                                            onClick={() => setSubeventImageTab('upload')}
                                        >Upload from PC</button>
                                        <button
                                            type="button"
                                            className={`px-3 py-1 rounded ${subeventImageTab === 'library' ? 'bg-primary text-white' : 'bg-gray-200 text-primary'}`}
                                            onClick={() => setSubeventImageTab('library')}
                                        >Select from Library</button>
                                    </div>
                                    {subeventImageTab === 'upload' && (
                                        <>
                                            <input
                                                id={`subevent-image-${idx}-modal`}
                                                type="file"
                                                accept="image/png,image/jpeg,image/jpg"
                                                style={{ display: 'none' }}
                                                onChange={async (e) => {
                                                    handleSubeventImageChange(e, idx);
                                                    setShowSubeventImageModalIdx(null);
                                                }}
                                                disabled={subeventUploading[idx]}
                                            />
                                            <label htmlFor={`subevent-image-${idx}-modal`} className="w-full flex items-center justify-center px-4 py-3 bg-white border rounded-lg cursor-pointer focus:outline-none transition-all duration-300 focus:ring-1 border-gray-300 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 text-gray-500">
                                                {subeventUploading[idx] ? <SimpleSpinner className='w-5 h-5' /> : 'Click to select image (jpg, jpeg, png)'}
                                            </label>
                                        </>
                                    )}
                                    {subeventImageTab === 'library' && (
                                        <div>
                                            <div className="font-bold text-lg mb-2 text-primary-700 text-center">Select an image from your library</div>
                                            {driveLoading && <div className="text-center py-6"><SimpleSpinner /></div>}
                                            {driveError && <div className="text-red-500 text-center py-4">{driveError}</div>}
                                            {removeUnusedError && <div className="text-red-500 text-center py-2">{removeUnusedError}</div>}
                                            <div className="flex justify-start mb-2">
                                                <button
                                                    type="button"
                                                    className="px-3 py-1 font-semibold rounded bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2"
                                                    disabled={driveLoading || removeUnusedLoading}
                                                    onClick={async () => {
                                                        setRemoveUnusedLoading(true);
                                                        setRemoveUnusedError(null);
                                                        try {
                                                            const res = await fetch('/api/cleanup-unused', { method: 'POST' });
                                                            const data = await res.json();
                                                            if (data.success) {
                                                                alert(`Deleted ${data.count} unused image(s).`);
                                                                if (refreshDriveImages) await refreshDriveImages();
                                                            } else {
                                                                setRemoveUnusedError(data.error || 'Failed to remove unused images');
                                                            }
                                                        } catch (err) {
                                                            setRemoveUnusedError('Failed to remove unused images');
                                                        }
                                                        setRemoveUnusedLoading(false);
                                                    }}
                                                >
                                                    {removeUnusedLoading && <SimpleSpinner className="w-4 h-4 mr-2" />}Remove unused images
                                                </button>
                                            </div>
                                            {!driveLoading && !driveError && driveImages.length === 0 && (
                                                <div className="text-gray-500 text-center py-8">No images found in your Google Drive folder.</div>
                                            )}
                                            <div className="grid grid-cols-3 max-[510px]:grid-cols-2 overflow-x-hidden gap-3 max-h-72 overflow-y-auto p-1">
                                                {driveImages.map(img => (
                                                    <button
                                                        key={img.id}
                                                        type="button"
                                                        className="relative group focus:outline-none"
                                                        title={img.isOverSizeLimit
                                                            ? `${img.name} (${img.sizeKB}KB - Too large, max size is 250KB)`
                                                            : `${img.name} (${img.sizeKB}KB)`}
                                                        onClick={() => {
                                                            if (!img.isOverSizeLimit) {
                                                                handleSubeventChange(idx, 'imageUrl', img.url);
                                                                setShowSubeventImageModalIdx(null);
                                                            }
                                                        }}
                                                        disabled={img.isOverSizeLimit}
                                                    >
                                                        <div className="relative">
                                                            <Image
                                                                src={img.url}
                                                                alt={img.name}
                                                                width={96}
                                                                height={96}
                                                                className={`rounded border-2 transition-all shadow-sm w-full h-24 object-cover bg-white
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

                        <textarea
                            value={sub.description || ""}
                            onChange={e => handleSubeventChange(idx, "description", e.target.value)}
                            className="w-full bg-white p-3 border rounded-lg focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 border-gray-300 text-black"
                            placeholder="Segment Description"
                            rows={2}
                            required
                        />
                        <SubeventSpeakersSection
                            speakers={sub.speakers || []}
                            onChange={(sidx, field, value) => handleSubeventSpeakerChange(idx, sidx, field, value)}
                            onAdd={() => handleAddSubeventSpeaker(idx)}
                            onRemove={sidx => handleRemoveSubeventSpeaker(idx, sidx)}
                        />
                        <div className="w-full justify-center items-center flex">
                            <button type="button" onClick={() => handleRemoveSubevent(idx)} className="text-red-600 hover:bg-red-100 w-fit mt-2 px-2 py-1 rounded font-bold">Remove Segment</button>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={handleAddSubevent} className="bg-secondary text-white font-bold px-4 py-2 rounded-lg shadow-md hover:bg-secondary-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 mt-2">Add Segment</button>
            </div>
        </div>
    );
};

export default SubeventsSection;
