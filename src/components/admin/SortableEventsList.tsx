import React from "react";
import { EventData } from "@/components/events/types";
import Spinner from "@/components/Spinner";

// Event card component with move up/down buttons
type EventItemProps = {
    event: EventData;
    onEdit: (event: EventData) => void;
    onDelete: (id: string) => void;
    onMoveUp: (event: EventData) => void;
    onMoveDown: (event: EventData) => void;
    isFirst: boolean;
    isLast: boolean;
};

function EventItem({ event, onEdit, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: EventItemProps) {
    return (
        <div className="bg-white border border-primary-100 rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Event info */}
            {/* Move up/down buttons */}
            <div className="flex flex-col max-sm:flex-row gap-1 mr-2">
                <button
                    className={`px-2 py-1 rounded max-w-8 bg-primary-100 text-primary-700 font-bold shadow ${isFirst ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-200'}`}
                    onClick={() => onMoveUp(event)}
                    disabled={isFirst}
                >↑</button>
                <button
                    className={`px-2 py-1 rounded max-w-8 bg-primary-100 text-primary-700 font-bold shadow ${isLast ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-200'}`}
                    onClick={() => onMoveDown(event)}
                    disabled={isLast}
                >↓</button>
            </div>
            <div className="flex-grow flex items-center gap-3">
                <div className="flex-grow">
                    <div className="font-bold text-lg text-primary-700">{event.title}</div>
                    <div className="text-sm text-primary-500">{event.date} | {event.time} | {event.venue}</div>
                    <div className="text-sm text-gray-700 mt-1">{event.description?.slice(0, 80)}{event.description && event.description.length > 80 ? "..." : ""}</div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2">
                <button
                    className="bg-secondary hover:bg-secondary/90 text-white font-bold px-4 py-2 rounded shadow"
                    onClick={() => onEdit(event)}
                >Edit</button>
                <button
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded shadow"
                    onClick={() => event.id && onDelete(event.id)}
                    disabled={!event.id}
                >Delete</button>
            </div>
        </div>
    );
}

type SortableEventsListProps = {
    events: EventData[];
    loading: boolean;
    orderChanged: boolean;
    handleEdit: (event: EventData) => void;
    handleDelete: (id: string) => void;
    handleMoveUp: (event: EventData) => void;
    handleMoveDown: (event: EventData) => void;
    handleSaveOrder: () => void;
};

export default function SortableEventsList({
    events,
    loading,
    orderChanged,
    handleEdit,
    handleDelete,
    handleMoveUp,
    handleMoveDown,
    handleSaveOrder,
}: SortableEventsListProps) {
    // Always sort events by their 'order' property before rendering
    const sortedEvents = [...events].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return (
        <div className="w-full max-w-4xl">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-4">All Events
            </h2>
            {loading ? <div className="text-primary-700 pl-20 pt-10"><Spinner /></div> : (
                <div className="grid gap-6">
                    {sortedEvents.length === 0 && <div className="text-gray-500">No events found.</div>}
                    {sortedEvents.map((event, idx) => (
                        <EventItem
                            key={event.slug}
                            event={event}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onMoveUp={handleMoveUp}
                            onMoveDown={handleMoveDown}
                            isFirst={idx === 0}
                            isLast={idx === sortedEvents.length - 1}
                        />
                    ))}
                </div>
            )}
            {orderChanged && (
                <div className="flex my-4 justify-center items-center"><button onClick={handleSaveOrder} className="ml-4 text-base bg-primary-600 hover:bg-primary-700 text-white font-bold px-2 py-1 rounded shadow transition-all">Save Order</button></div>
            )}
        </div>
    );
}