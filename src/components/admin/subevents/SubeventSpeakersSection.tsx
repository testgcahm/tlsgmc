import React from "react";
import { Trash2 } from "lucide-react";

interface SubeventSpeaker {
    name: string;
    bio: string;
    id: string; // Unique id for React key
}

interface SubeventSpeakersSectionProps {
    speakers: SubeventSpeaker[];
    onChange: (sidx: number, field: "name" | "bio", value: string) => void;
    onAdd: () => void;
    onRemove: (sidx: number) => void;
}

const SubeventSpeakersSection: React.FC<SubeventSpeakersSectionProps> = ({ speakers, onChange, onAdd, onRemove }) => (
    <div className="ml-2 mt-3">
        <label className="text-secondary my-2 font-semibold">Speakers</label>
        <div className="space-y-1">
            {speakers.map((sp, sidx) => (
                <div key={sp.id || sidx} className="flex flex-col mt-2 sm:flex-row gap-2 max-sm:mb-5 items-center">
                    <input
                        type="text"
                        value={sp.name || ""}
                        onChange={e => onChange(sidx, "name", e.target.value)}
                        className="w-full p-3 bg-white border rounded-lg focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 border-gray-300 text-black"
                        placeholder="Speaker Name"
                        required
                    />
                    <input
                        type="text"
                        value={sp.bio || ""}
                        onChange={e => onChange(sidx, "bio", e.target.value)}
                        className="w-full p-3 bg-white border rounded-lg focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#6d4aff] hover:border-[#6d4aff]/50 border-gray-300 text-black"
                        placeholder="Speaker Bio"
                    />
                    <button type="button" onClick={() => onRemove(sidx)} className="text-red-600 p-2 hover:bg-red-100 hover:rounded-2xl"><Trash2 className="w-[18px] h-[18px]" /></button>
                    <div key={`divider-${sp.id || sidx}`} className="min-sm:hidden w-full h-[1px] my-1 bg-primary-100" />
                </div>
            ))}
            <button type="button" onClick={onAdd} className="bg-primary-100 hover:bg-primary-200 text-primary-700 font-bold px-2 my-2 py-1 rounded shadow">Add Subevent Speaker</button>
        </div>
    </div>
);

export default SubeventSpeakersSection;
