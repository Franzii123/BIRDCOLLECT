"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then(m => m.Tooltip), { ssr: false });

const STORAGE_KEY = "birdcollect:sightings";

type Sighting = {
  lat?: number | null;
  lng?: number | null;
  name: string;
};

export default function SidebarMap() {
  const [sightings, setSightings] = useState<Sighting[]>([]);

  useEffect(() => {
    import("leaflet/dist/leaflet.css");
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : [];
      setSightings(data.filter((s: Sighting) => s.lat && s.lng));
    } catch {}
  }, []);

  if (sightings.length === 0) return (
    <p className="text-xs text-stone-400 italic">Noch keine Sichtungen mit Standort.</p>
  );

  return (
    <div className="rounded-xl overflow-hidden border border-stone-200" style={{ height: 160 }}>
      <MapContainer center={[51.5, 10.5]} zoom={5} style={{ height: "100%", width: "100%" }} zoomControl={false} scrollWheelZoom={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution="" />
        {sightings.map((s, i) => (
          <Marker key={i} position={[s.lat!, s.lng!]}>
            <Tooltip>{s.name}</Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
