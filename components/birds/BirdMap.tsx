"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then(m => m.CircleMarker), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then(m => m.Tooltip), { ssr: false });

type Obs = { lat: number; lng: number; place: string };

export default function BirdMap({ taxonId }: { taxonId: string }) {
  const [obs, setObs] = useState<Obs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("leaflet/dist/leaflet.css");
    fetch(
      `https://api.inaturalist.org/v1/observations?taxon_id=${taxonId}&place_id=97394&per_page=100&geo=true&locale=de`
    )
      .then(r => r.json())
      .then(data => {
        const points = (data.results || [])
          .filter((o: any) => o.geojson?.coordinates?.length === 2)
          .map((o: any) => ({
            lat: o.geojson.coordinates[1],
            lng: o.geojson.coordinates[0],
            place: o.place_guess || "Deutschland",
          }));
        setObs(points);
      })
      .finally(() => setLoading(false));
  }, [taxonId]);

  if (loading) return (
    <div className="flex h-[280px] items-center justify-center rounded-xl border border-stone-200 bg-stone-50">
      <p className="text-xs text-stone-400">Lade Verbreitung...</p>
    </div>
  );

  if (obs.length === 0) return (
    <div className="flex h-[280px] items-center justify-center rounded-xl border border-stone-200 bg-stone-50">
      <p className="text-xs text-stone-400 italic">Keine Beobachtungsdaten für diese Art verfügbar.</p>
    </div>
  );

  return (
    <div className="rounded-xl overflow-hidden border border-stone-200" style={{ height: 280 }}>
      <MapContainer center={[51.5, 10.5]} zoom={5} style={{ height: "100%", width: "100%" }} zoomControl={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {obs.map((o, i) => (
          <CircleMarker
            key={i}
            center={[o.lat, o.lng]}
            radius={7}
            pathOptions={{ color: "#1f1f1c", fillColor: "#1f1f1c", fillOpacity: 0.35, weight: 1 }}
          >
            <Tooltip>{o.place}</Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
