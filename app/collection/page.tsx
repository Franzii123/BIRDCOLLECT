"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { SavedBird } from "@/lib/types";
import AppSidebar from "@/components/ui/AppSidebar";

const STORAGE_KEY = "birdcollect:sightings";

export default function CollectionPage() {
  const [birds, setBirds] = useState<SavedBird[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const items: SavedBird[] = raw ? JSON.parse(raw) : [];
    setBirds(items);
  }, []);

  const grouped = useMemo(() => {
    return birds.reduce<Record<string, SavedBird[]>>((acc, bird) => {
      const region = bird.region || "Unbekannt";
      if (!acc[region]) acc[region] = [];
      acc[region].push(bird);
      return acc;
    }, {});
  }, [birds]);

  const regionNames = Object.keys(grouped).sort();
  const lastSeenLabel = birds.length ? birds[0].name : "Noch keine Einträge";

  return (
    <div className="flex min-h-screen bg-[#F9F8F4] text-[#1f1f1c]">
      <AppSidebar
        regionLabel="Gespeicherte Sichtungen"
        lastSeenLabel={lastSeenLabel}
      />

      <main className="flex-1 px-10 py-10">
        <a
          href="/explore"
          className="mb-6 inline-flex items-center text-sm text-stone-500 transition-colors hover:text-stone-800"
        >
          ← Zurück zu Explore
        </a>

        <div className="mb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#888780]">
            Sammlung
          </p>
          <h1 className="mb-3 text-4xl italic">Deine Vogelsammlung</h1>
        </div>

        {!birds.length ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-8">
            <p className="text-lg italic text-[#1f1f1c]">
              Noch keine Vögel gespeichert
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {regionNames.map((region) => (
              <section key={region}>
                <h2 className="mb-4 text-2xl italic">{region}</h2>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {grouped[region]
                    .sort(
                      (a, b) =>
                        new Date(b.savedAt).getTime() -
                        new Date(a.savedAt).getTime()
                    )
                    .map((bird) => {
                      const params = new URLSearchParams({
                        name: bird.name,
                        scientific: bird.scientific,
                        image: bird.image || "",
                        wikipedia: bird.wikipedia || "",
                        region: bird.region || "",
                        placeId: bird.placeId || "",
                      });

                      return (
                        <Link
                          key={`${bird.id}-${bird.savedAt}`}
                          href={`/bird/${bird.id}?${params.toString()}`}
                          className="overflow-hidden rounded-3xl border border-stone-200 bg-white transition-shadow hover:shadow-md"
                        >
                          <div className="aspect-[4/3] bg-stone-100">
                            {bird.image ? (
                              <img
                                src={bird.image}
                                alt={bird.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-4xl">
                                🐦
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <p className="text-xl italic text-stone-900">
                              {bird.name}
                            </p>
                            <p className="mt-1 text-sm text-stone-500">
                              {bird.scientific}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
