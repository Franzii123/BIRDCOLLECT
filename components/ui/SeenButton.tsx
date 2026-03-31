"use client";
import { useEffect, useState } from "react";
import type { Bird, SavedBird } from "@/lib/types";

const STORAGE_KEY = "birdcollect:sightings";

type Props = {
  bird: Bird;
  region?: string;
  placeId?: string;
};

async function geocodeCity(city: string): Promise<{ lat: number; lng: number } | null> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&countrycodes=de&format=json&limit=1`
  );
  const data = await res.json();
  if (!data[0]) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

export default function SeenButton({ bird, region = "Deutschland", placeId }: Props) {
  const [saved, setSaved] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const items: SavedBird[] = raw ? JSON.parse(raw) : [];
    setSaved(items.some((item) => item.id === bird.id));
  }, [bird.id]);

  async function handleSave() {
    setLoading(true);
    let coords = null;
    if (city.trim()) coords = await geocodeCity(city.trim());

    const raw = localStorage.getItem(STORAGE_KEY);
    const items: SavedBird[] = raw ? JSON.parse(raw) : [];
    const entry: SavedBird = {
      ...bird,
      region,
      placeId,
      city: city.trim() || undefined,
      lat: coords?.lat,
      lng: coords?.lng,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...items]));
    setSaved(true);
    setShowInput(false);
    setLoading(false);
  }

  function handleRemove() {
    const raw = localStorage.getItem(STORAGE_KEY);
    const items: SavedBird[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.filter((i) => i.id !== bird.id)));
    setSaved(false);
  }

  if (saved) {
    return (
      <button
        type="button"
        onClick={handleRemove}
        className="w-full rounded-full bg-stone-200 px-5 py-3 text-sm text-stone-700 hover:bg-stone-300 transition-colors"
      >
        Entfernen
      </button>
    );
  }

  if (showInput) {
    return (
      <div className="flex flex-col gap-2">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder="Stadt eingeben (z.B. Berlin)"
          className="w-full rounded-full border border-stone-300 px-5 py-3 text-sm outline-none focus:border-stone-500"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex-1 rounded-full bg-[#1f1f1c] px-5 py-3 text-sm text-white hover:bg-stone-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Speichern..." : "Speichern"}
          </button>
          <button
            type="button"
            onClick={() => setShowInput(false)}
            className="rounded-full border border-stone-300 px-5 py-3 text-sm text-stone-500 hover:border-stone-500 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowInput(true)}
      className="w-full rounded-full bg-[#1f1f1c] px-5 py-3 text-sm text-white hover:bg-stone-700 transition-colors"
    >
      Als gesehen speichern
    </button>
  );
}
