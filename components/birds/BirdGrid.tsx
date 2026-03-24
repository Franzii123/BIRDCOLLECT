import type { Bird } from "@/lib/types";
import BirdCard from "./BirdCard";

type BirdGridProps = {
  birds: Bird[];
  region?: string;
  placeId?: string;
};

export default function BirdGrid({
  birds,
  region,
  placeId,
}: BirdGridProps) {
  if (!birds.length) {
    return (
      <div className="rounded-3xl border border-stone-200 bg-white p-6 text-stone-500">
        Keine Vögel gefunden.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {birds.map((bird) => (
        <BirdCard
          key={bird.id}
          bird={bird}
          region={region}
          placeId={placeId}
        />
      ))}
    </div>
  );
}
