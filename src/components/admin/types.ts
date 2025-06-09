import { EventData } from "@/components/events/types";

export const emptyEvent: Partial<EventData> = {
    slug: "",
    title: "",
    date: "",
    time: "",
    venue: "",
    activities: "",
    audience: "",
    description: "",
    image: "",
    register: false,
    speakers: [],
};