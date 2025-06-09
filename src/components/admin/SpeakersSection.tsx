import React from "react";
import { Trash2 } from "lucide-react";

interface Speaker {
    name: string;
    bio: string;
}

interface SpeakersSectionProps {
    speakers: Speaker[];
    handleSpeakerChange: (idx: number, field: "name" | "bio", value: string) => void;
    handleAddSpeaker: () => void;
    handleRemoveSpeaker: (idx: number) => void;
}

const SpeakersSection: React.FC<SpeakersSectionProps> = ({ speakers, handleSpeakerChange, handleAddSpeaker, handleRemoveSpeaker }) => (
    <div>
        <label className="block text-secondary font-semibold text-xl mb-2">Speakers</label>
        <div className="space-y-2">
            {speakers.map((speaker, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-2 max-sm:mb-5 items-center">
                    <input
                        type="text"
                        value={speaker?.name || ""}
                        onChange={e => handleSpeakerChange(idx, "name", e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 border-gray-300 text-black"
                        placeholder={`Speaker #${idx + 1} Name`}
                        required
                    />
                    <input
                        type="text"
                        value={speaker?.bio || ""}
                        onChange={e => handleSpeakerChange(idx, "bio", e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 border-gray-300 text-black"
                        placeholder={`Speaker #${idx + 1} Bio`}
                        required
                    />
                    <button type="button" onClick={() => handleRemoveSpeaker(idx)} className="text-red-600 max-sm:py-2 hover:bg-red-100 hover:rounded-2xl hover:p-2 font-bold px-2" aria-label="Remove speaker">
                        <Trash2 size={18} />
                    </button>
                    <div className="min-sm:hidden w-full h-[1px] my-1 bg-primary-100" />
                </div>
            ))}
            <button type="button" onClick={handleAddSpeaker} className="bg-primary-100 hover:bg-primary-200 text-primary-700 font-bold px-4 py-1 rounded shadow mt-1">Add Speaker</button>
        </div>
    </div>
);

export default SpeakersSection;
