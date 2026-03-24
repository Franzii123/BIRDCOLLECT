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
  savedAt: string;
};
