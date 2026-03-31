"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "birdcollect:sightings";

type SavedBird = {
  id: string; name: string; scientific: string;
  image: string | null; lat?: number; lng?: number; city?: string;
};
type LocalBird = {
  id: string; name: string; scientific: string; image: string | null;
};
type Props = { birdId?: string };

export default function CollectionMap({ birdId }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const clickMarkerRef = useRef<any>(null);
  const [sightings, setSightings] = useState<SavedBird[]>([]);
  const [mounted, setMounted] = useState(false);
  const [localBirds, setLocalBirds] = useState<LocalBird[]>([]);
  const [loading, setLoading] = useState(false);
  const [clickedPlace, setClickedPlace] = useState<string | null>(null);
  const [obsCount, setObsCount] = useState<number | null>(null);
  const isDistributionMode = !!birdId;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data: SavedBird[] = raw ? JSON.parse(raw) : [];
      setSightings(data.filter(s => s.lat && s.lng));
    } catch {}
    setMounted(true);
  }, []);

  async function fetchBirdsAt(lat: number, lng: number) {
    setLoading(true);
    setLocalBirds([]);
    try {
      const res = await fetch(
        `https://api.inaturalist.org/v1/observations?taxon_id=3&lat=${lat}&lng=${lng}&radius=30&per_page=12&order=votes&locale=de&geo=true&quality_grade=research`
      );
      const data = await res.json();
      const seen = new Set<string>();
      setLocalBirds((data.results || [])
        .filter((o: any) => o.taxon)
        .map((o: any) => ({
          id: String(o.taxon.id),
          name: o.taxon.preferred_common_name || o.taxon.name,
          scientific: o.taxon.name,
          image: o.taxon.default_photo?.medium_url || null,
        }))
        .filter((b: LocalBird) => {
          if (seen.has(b.id)) return false;
          seen.add(b.id);
          return true;
        }));
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    if (!mounted || !mapRef.current) return;
    let map: any;
    let cancelled = false;

    import("leaflet").then(L => {
      if (cancelled || !mapRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      map = L.map(mapRef.current!).setView([51.5, 10.5], 6);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      }).addTo(map);

      if (isDistributionMode && birdId) {
        setLoading(true);
        fetch(
          `https://api.inaturalist.org/v1/observations?taxon_id=${birdId}&place_id=97394&per_page=200&geo=true&quality_grade=research&include_descendants=true`
        )
          .then(r => r.json())
          .then(data => {
            if (cancelled) return;
            const results = data.results || [];
            setObsCount(results.length);
            results
              .filter((o: any) => o.geojson?.coordinates?.length === 2)
              .forEach((o: any) => {
                L.circleMarker(
                  [o.geojson.coordinates[1], o.geojson.coordinates[0]],
                  { radius: 8, color: "#2d6a4f", fillColor: "#52b788", fillOpacity: 0.7, weight: 1 }
                ).addTo(map).bindTooltip(o.place_guess || "");
              });
          })
          .finally(() => setLoading(false));
      } else {
        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng;
          if (clickMarkerRef.current) clickMarkerRef.current.remove();
          const outer = L.circleMarker([lat, lng], {
            radius: 18, color: "#1f1f1c", fillColor: "#1f1f1c", fillOpacity: 0.1, weight: 1.5,
          }).addTo(map);
          const inner = L.circleMarker([lat, lng], {
            radius: 5, color: "#1f1f1c", fillColor: "#1f1f1c", fillOpacity: 0.8, weight: 0,
          }).addTo(map);
          clickMarkerRef.current = { remove: () => { outer.remove(); inner.remove(); } };
          setClickedPlace(`${lat.toFixed(2)}°N ${lng.toFixed(2)}°E`);
          fetchBirdsAt(lat, lng);
        });

        sightings.forEach(s => {
          if (!s.lat || !s.lng) return;
          L.marker([s.lat, s.lng]).addTo(map).bindPopup(
            `<strong>${s.name}</strong>${s.city ? `<br/><span style="color:#888">${s.city}</span>` : ""}`
          );
        });
      }
    });

    return () => { cancelled = true; map?.remove(); };
  }, [mounted, birdId]);

  if (!mounted) return null;

  return (
    <div className={isDistributionMode ? "block" : "grid gap-6 lg:grid-cols-[1fr_340px]"}>
      <div className="flex flex-col gap-2">
        {isDistributionMode && obsCount !== null && (
          <p className="text-xs text-stone-400">{obsCount} Beobachtungen gefunden.</p>
        )}
        {isDistributionMode && loading && (
          <p className="text-xs text-stone-400 animate-pulse">Lade Beobachtungen...</p>
        )}
        {!isDistributionMode && (
          <p className="text-xs text-stone-400">Klicke auf die Karte um Vögel in diesem Gebiet zu sehen.</p>
        )}
        <div
          ref={mapRef}
          className="rounded-2xl overflow-hidden border border-stone-200"
          style={{ height: isDistributionMode ? 560 : 500, cursor: isDistributionMode ? "default" : "crosshair" }}
        />
      </div>

      {!isDistributionMode && (
        <div className="flex flex-col gap-4">
          {!clickedPlace && (
            <p className="text-sm text-stone-400 italic mt-8">Klicke auf die Karte um lokale Vögel zu entdecken.</p>
          )}
          {clickedPlace && (
            <p className="text-xs uppercase tracking-[0.25em] text-[#888780]">{clickedPlace}</p>
          )}
          {loading && (
            <div className="flex flex-col gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-stone-100 animate-pulse" />
              ))}
            </div>
          )}
          {!loading && localBirds.map(bird => (
            <Link
              key={bird.id}
              href={`/bird/${bird.id}?name=${encodeURIComponent(bird.name)}&scientific=${encodeURIComponent(bird.scientific)}&image=${encodeURIComponent(bird.image || "")}`}
              className="flex gap-3 rounded-xl border border-stone-200 bg-white p-3 hover:shadow-sm transition-shadow"
            >
              {bird.image ? (
                <img src={bird.image} alt={bird.name} className="h-16 w-16 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-stone-100 shrink-0 flex items-center justify-center text-2xl">🐦</div>
              )}
              <div className="flex flex-col justify-center">
                <p className="text-sm font-medium italic">{bird.name}</p>
                <p className="text-xs text-stone-400">{bird.scientific}</p>
              </div>
            </Link>
          ))}
          {!loading && clickedPlace && localBirds.length === 0 && (
            <p className="text-sm text-stone-400 italic">Keine Beobachtungen in diesem Gebiet.</p>
          )}
        </div>
      )}
    </div>
  );
}
