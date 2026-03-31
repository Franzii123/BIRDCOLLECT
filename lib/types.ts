export type Bird = {
  id: string;
  name: string;
  scientific: string;
  image: string | null;
  wikipedia?: string | null;
  summary?: string | null;
  rank?: string | null;
  observationsCount?: number | null;
};

export type SavedBird = Bird & {
  region: string;
  placeId?: string;
  city?: string;
  lat?: number;
  lng?: number;
  savedAt: string;
};

export type Sighting = {
  id: string;
  bird_id: string;
  name: string;
  scientific?: string | null;
  image_url?: string | null;
  city: string;
  lat?: number | null;
  lng?: number | null;
  notes?: string | null;
  date_seen?: string;
};
