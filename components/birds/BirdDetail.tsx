"use client";
import type { Bird } from "@/lib/types";
import SeenButton from "@/components/ui/SeenButton";
import dynamic from "next/dynamic";

const BirdSound = dynamic(() => import("@/components/birds/BirdSound"), { ssr: false });
const BirdMiniMap = dynamic(() => import("@/components/birds/BirdMiniMap"), { ssr: false });

type Props = {
  bird: Bird;
  summary?: string | null;
  wikiUrl?: string | null;
};

function extractFunFact(text?: string | null) {
  if (!text) return null;
  const sentences = text.split(". ");
  if (sentences.length < 2) return null;
  return sentences[1];
}

export default function BirdDetail({ bird, summary, wikiUrl }: Props) {
  const funFact = extractFunFact(summary);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
          <div className="aspect-[4/3] bg-stone-100">
            {bird.image ? (
              <img src={bird.image} alt={bird.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl">🐦</div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-white p-6">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#888780]">Steckbrief</p>
            <h1 className="mb-2 text-4xl italic">{bird.name}</h1>
            <p className="mb-4 text-lg text-stone-500">{bird.scientific}</p>

            {summary ? (
              <p className="mb-4 text-sm text-stone-700 leading-6">{summary}</p>
            ) : (
              <p className="mb-4 text-sm italic text-stone-400">Keine Beschreibung verfügbar.</p>
            )}

            {funFact && (
              <div className="mb-4 rounded-xl bg-stone-100 p-4 text-sm">
                <p className="mb-1 text-xs uppercase tracking-widest text-stone-500">Interessant</p>
                <p>{funFact}</p>
              </div>
            )}

            {wikiUrl && (
              <a href={wikiUrl} target="_blank" rel="noreferrer" className="text-sm underline underline-offset-4">
                Wikipedia öffnen
              </a>
            )}
          </div>
          <SeenButton bird={bird} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#888780]">Verbreitung</p>
          <BirdMiniMap taxonId={bird.id} name={bird.name} />
        </div>
        <div>
          <BirdSound scientificName={bird.scientific} />
        </div>
      </div>
    </div>
  );
}
