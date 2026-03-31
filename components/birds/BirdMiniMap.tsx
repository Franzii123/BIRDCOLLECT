"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

type Props = { taxonId: string; name: string };

export default function BirdMiniMap({ taxonId, name }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    let map: any;
    let cancelled = false;

    import("leaflet").then(L => {
      if (cancelled || !mapRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      map = L.map(mapRef.current!, {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
      }).setView([51.5, 10.5], 5);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: "",
      }).addTo(map);

      fetch(
        `https://api.inaturalist.org/v1/observations?taxon_id=${taxonId}&place_id=97394&per_page=50&geo=true&quality_grade=research`
      )
        .then(r => r.json())
        .then(data => {
          if (cancelled) return;
          (data.results || [])
            .filter((o: any) => o.geojson?.coordinates?.length === 2)
            .forEach((o: any) => {
              L.circleMarker(
                [o.geojson.coordinates[1], o.geojson.coordinates[0]],
                { radius: 6, color: "#2d6a4f", fillColor: "#52b788", fillOpacity: 0.75, weight: 1 }
              ).addTo(map);
            });
        });
    });

    return () => { cancelled = true; map?.remove(); };
  }, [taxonId]);

  return (
    <div className="rounded-xl overflow-hidden border border-stone-200">
      <div ref={mapRef} style={{ height: 160 }} />
      <Link
        href={`/map?bird=${taxonId}&name=${encodeURIComponent(name)}`}
        className="block text-center py-2 text-xs text-stone-500 hover:text-stone-800 bg-white border-t border-stone-100 transition-colors"
      >
        Vollbild anzeigen
      </Link>
    </div>
  );
}
