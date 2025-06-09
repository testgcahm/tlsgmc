export interface EventData {
  id?: string;
  slug: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  activities: string;
  audience: string;
  description: string;
  image: string;
  register?: boolean;
  registrationLink?: string;
  speakers?: {
    name: string;
    bio: string;
  }[];
  subevents?: {
    time: string;
    title: string;
    description?: string;
    imageUrl?: string;
    order?: number; // Added for sorting and reordering
    speakers?: {
      name: string;
      bio?: string;
    }[];
  }[];
  order?: number; // Added for sorting and reordering
}

export interface Speaker {
  name: string;
  bio?: string;
}

export interface Subevent {
  time: string;
  title: string;
  description?: string;
  imageUrl?: string;
  order?: number;
  speakers?: Speaker[];
}