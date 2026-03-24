import Link from "next/link";
import type { Bird } from "@/lib/types";

type BirdCardProps = {
  bird: Bird;
  region?: string;
  placeId?: string;
};

export default function BirdCard({
  bird,
  region,
  placeId,
}: BirdCardProps) {
  const params = new URLSearchParams({
    name: bird.name,
    scientific: bird.scientific,
    image: bird.image || "",
    wikipedia: bird.wikipedia || "",
    region: region || "Deutschland",
    placeId: placeId || "",
  });

  return (
    <Link href={`/bird/${bird.id}?${params.toString()}`}>
      <article className="overflow-hidden rounded-3xl border border-stone-200 bg-white transition-shadow hover:shadow-md">
        <div className="aspect-4/3 bg-stone-100">
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
          <p className="text-xl italic text-stone-900">{bird.name}</p>
          <p className="mt-1 text-sm text-stone-500">{bird.scientific}</p>
        </div>
      </article>
    </Link>
  );
}
