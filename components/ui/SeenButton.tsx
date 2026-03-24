"use client";

import { useEffect, useState } from "react";
import type { Bird, SavedBird } from "@/lib/types";

const STORAGE_KEY = "birdcollect:sightings";

type Props = {
  bird: Bird;
  region?: string;
  placeId?: string;
};

export default function SeenButton({
  bird,
  region = "Deutschland",
  placeId,
}: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const items: SavedBird[] = raw ? JSON.parse(raw) : [];
    setSaved(items.some((item) => item.id === bird.id));
  }, [bird.id]);

  function handleToggle() {
    const raw = localStorage.getItem(STORAGE_KEY);
    const items: SavedBird[] = raw ? JSON.parse(raw) : [];

    const exists = items.some((item) => item.id === bird.id);

    if (exists) {
      const updated = items.filter((item) => item.id !== bird.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSaved(false);
      return;
    }

    const entry: SavedBird = {
      ...bird,
      region,
      placeId,
      savedAt: new Date().toISOString(),
    };

    const updated = [entry, ...items];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaved(true);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`rounded-full px-5 py-3 text-sm transition-colors ${
        saved
          ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
          : "bg-[#1f1f1c] text-white hover:bg-stone-700"
      }`}
    >
      {saved ? "Entfernen" : "Als gesehen speichern"}
    </button>
  );
}
