"use client";

import { useEffect, useState, useRef } from "react";
import { EventData } from "@/components/events/types";
import { motion } from "framer-motion";
import SortableEventsList from "@/components/admin/SortableEventsList";
import EventForm from "@/components/admin/EventForm";
import { emptyEvent } from "@/components/admin/types";
import { getAuth } from 'firebase/auth';
import Spinner from "@/components/Spinner";
import { DriveImage } from '@/types/googleDrive';

export default function EventsManager({ driveImages }: { driveImages: DriveImage[] }) {
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState<Partial<EventData> | null>(null);
    const [form, setForm] = useState<Partial<EventData>>(emptyEvent);
    const [error, setError] = useState<string | null>(null);
    const [orderChanged, setOrderChanged] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch events
    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/events");
            const data = await res.json();
            // Ensure each event has an id property
            let eventData = (data.eventsArray || []).map((e: EventData) => ({ ...e, id: e.id }));
            
            // Sort by order and normalize the order values to be sequential
            eventData = eventData.sort((a: EventData, b: EventData) => (a.order ?? 0) - (b.order ?? 0))
                .map((e: EventData, idx: number) => ({ ...e, order: idx }));

            setEvents(eventData);
        } catch (e) {
            setError("Failed to load events");
        }
        setLoading(false);
    };

    // Force scroll to top
    useEffect(() => {
        // Immediate scroll
        if (typeof window !== "undefined") {
            window.scrollTo(0, 0);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, []);

    // Scroll to top on component mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    }, []);

    // Handle form changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Speaker management handlers
    const handleSpeakerChange = (idx: number, field: "name" | "bio", value: string) => {
        const speakers = Array.isArray(form.speakers) ? [...form.speakers] : [];
        speakers[idx] = { ...speakers[idx], [field]: value };
        setForm({ ...form, speakers });
    };

    const handleAddSpeaker = () => {
        const speakers = Array.isArray(form.speakers) ? [...form.speakers] : [];
        speakers.push({ name: "", bio: "" });
        setForm({ ...form, speakers });
    };

    const handleRemoveSpeaker = (idx: number) => {
        const speakers = Array.isArray(form.speakers) ? [...form.speakers] : [];
        speakers.splice(idx, 1);
        setForm({ ...form, speakers });
    };

    // Utility to get current user's ID token
    async function getIdToken() {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return null;
        return await user.getIdToken();
    }

    // Add or update event
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Slug logic
            let slug = form.slug?.trim() || form.title?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
            if (!slug) throw new Error("Title is required.");
            
            // Prevent duplicate slugs (ignore current event if editing)
            const duplicate = events.find(ev => ev.slug === slug && (!editing || ev.id !== editing.id));
            if (duplicate) {
                setError("An event with this URL already exists.");
                setLoading(false);
                return;
            }
            
            let submitForm = { ...form, slug };
            // If adding, assign order 0 and increment others
            if (!editing) {
                submitForm.order = 0;
                // Increment order of all existing events
                const updatedEvents = events.map(ev => ({ ...ev, order: (typeof ev.order === 'number' ? ev.order + 1 : 1) }));
                setEvents([submitForm as EventData, ...updatedEvents]);
            }
            const method = editing ? "PUT" : "POST";
            const idToken = await getIdToken();
            if (!idToken) throw new Error("You must be logged in to perform this action.");
            const res = await fetch("/api/events", {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${idToken}`,
                },
                body: JSON.stringify(editing ? submitForm : submitForm),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error || "Unknown error");
            setForm(emptyEvent);
            setEditing(null);
            fetchEvents();
            setError(null);
            setSuccessMessage('Event saved successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        }
        setLoading(false);
    };

    // Edit event
    const handleEdit = (event: EventData) => {
        setEditing(event);
        setForm(event);
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Delete event
    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this event?")) return;
        setLoading(true);
        setError(null);
        try {
            const idToken = await getIdToken();
            if (!idToken) throw new Error("You must be logged in to perform this action.");
            const res = await fetch("/api/events", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${idToken}`,
                },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error || "Unknown error");
            
            // If the deleted event was being edited, clear the form
            if (editing && editing.id === id) {
                setEditing(null);
                setForm(emptyEvent);
            }
            
            fetchEvents();
            setError(null);
            setSuccessMessage('Event deleted successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        }
        setLoading(false);
    };

    // Move event up
    const handleMoveUp = (event: EventData) => {
        const idx = events.findIndex(e => e.id === event.id);
        if (idx > 0) {
            const newEvents = [...events];
            // Swap order property with previous event only
            const prevOrder = newEvents[idx - 1].order;
            newEvents[idx - 1].order = newEvents[idx].order;
            newEvents[idx].order = prevOrder;
            
            // Sort by order after swap
            let updated = [...newEvents].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            
            // Reassign order to match array index
            updated = updated.map((e, i) => ({ ...e, order: i }));
            
            setEvents(updated);
            setOrderChanged(true);
        }
    };

    // Move event down
    const handleMoveDown = (event: EventData) => {
        const idx = events.findIndex(e => e.id === event.id);
        if (idx < events.length - 1) {
            const newEvents = [...events];
            // Swap order property with next event only
            const nextOrder = newEvents[idx + 1].order;
            newEvents[idx + 1].order = newEvents[idx].order;
            newEvents[idx].order = nextOrder;
            
            // Sort by order after swap
            let updated = [...newEvents].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            
            // Reassign order to match array index
            updated = updated.map((e, i) => ({ ...e, order: i }));
            
            setEvents(updated);
            setOrderChanged(true);
        }
    };

    // Save new order to backend
    const handleSaveOrder = async () => {
        setLoading(true);
        setError(null);
        try {
            const idToken = await getIdToken();
            if (!idToken) throw new Error("You must be logged in to perform this action.");
            // Use event.id for order
            const res = await fetch('/api/events', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({ order: events.map((e, i) => ({ id: e.id, order: i })) }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Unknown error');
            setOrderChanged(false);
            fetchEvents();
            setError(null);
            setSuccessMessage('Order saved successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        }
        setLoading(false);
    };

    // Handle form cancel
    const handleCancel = () => {
        setEditing(null);
        setForm(emptyEvent);
    };

    return (
        <motion.div
            ref={containerRef}
            tabIndex={-1} // Make it focusable
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-center mb-4 min-h-[85vh] text-primary p-8 max-[400px]:p-4 max-[352px]:p-2"
            style={{ scrollBehavior: 'auto' }}
        >
            <h1 className="text-4xl font-extrabold text-primary-700 mb-8 text-center">Events Admin</h1>
            {error && <div className="text-red-600 font-bold mb-4">{error}</div>}
            {successMessage && (
                <div style={{
                    position: 'fixed',
                    top: '80px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    background: '#4ade80',
                    color: '#065f46',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    fontSize: '1.1rem',
                    minWidth: '220px',
                    textAlign: 'center',
                }}>
                    {successMessage}
                </div>
            )}
            {/* Event Form Component */}
            <EventForm
                form={form}
                editing={Boolean(editing)}
                loading={loading}
                error={error}
                events={events} // Pass events data to the form
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleSpeakerChange={handleSpeakerChange}
                handleAddSpeaker={handleAddSpeaker}
                handleRemoveSpeaker={handleRemoveSpeaker}
                handleCancel={handleCancel}
                driveImages={driveImages}
            />
            {loading ? (
                <Spinner />
            ) :
                /* Draggable Events List Component */
                <SortableEventsList
                    events={events}
                    loading={loading}
                    orderChanged={orderChanged}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    handleMoveUp={handleMoveUp}
                    handleMoveDown={handleMoveDown}
                    handleSaveOrder={handleSaveOrder}
                />}
        </motion.div>
    );
}
