"use client";
import { useEffect, useState } from "react";

type Recording = { file: string; rec: string; loc: string };

export default function BirdSound({ scientificName }: { scientificName: string }) {
  const [recording, setRecording] = useState<Recording | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/birdsound?name=${encodeURIComponent(scientificName)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.file) setRecording(data); })
      .finally(() => setLoading(false));
  }, [scientificName]);

  if (loading) return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
      <p className="text-xs text-stone-400">Lade Vogelruf...</p>
    </div>
  );

  if (!recording) return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
      <p className="text-xs text-stone-400 italic">Kein Vogelruf verfügbar.</p>
    </div>
  );

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#888780]">Vogelruf</p>
      <audio controls className="w-full" src={recording.file} />
      <p className="mt-2 text-xs text-stone-400">
        {recording.rec} — {recording.loc}
      </p>
    </div>
  );
}
