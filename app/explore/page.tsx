import { searchBirds } from "@/lib/api/inaturalist";
import BirdGrid from "@/components/birds/BirdGrid";
import SearchBar from "@/components/search/SearchBar";
import PlaceSelect from "@/components/ui/PlaceSelect";
import AppSidebar from "@/components/ui/AppSidebar";

const CITIES: { label: string; placeId: string }[] = [
  { label: "Deutschland", placeId: "97394" },
  { label: "Berlin", placeId: "58003" },
  { label: "München", placeId: "58004" },
  { label: "Hamburg", placeId: "58005" },
  { label: "Köln", placeId: "58006" },
  { label: "Frankfurt", placeId: "58007" },
  { label: "Stuttgart", placeId: "58008" },
  { label: "Leipzig", placeId: "58009" },
  { label: "Dresden", placeId: "58010" },
];

type Props = {
  searchParams: Promise<{ q?: string; tags?: string; place?: string }>;
};

export default async function ExplorePage({ searchParams }: Props) {
  const params = await searchParams;

  const placeId = params.place || "97394";

  // tags und q kombinieren für die API
  const combined = [params.q, params.tags].filter(Boolean).join(" ").trim();
  const query = combined || "meise";

  let birds = await searchBirds(query, placeId);
  if (!birds.length) birds = await searchBirds("meise", placeId);

  const currentCity = CITIES.find((c) => c.placeId === placeId) || CITIES[0];

  return (
    <div className="flex min-h-screen bg-[#F9F8F4] text-[#1f1f1c]">
      <AppSidebar regionLabel={currentCity.label} />

      <main className="flex-1 px-10 py-10">
        <div className="mb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#888780]">
            explore — {currentCity.label}
          </p>
          <h1 className="mb-3 text-4xl italic">Vögel in deiner Umgebung</h1>
          <p className="max-w-xl text-stone-500">
            Beschreibe, was du siehst, oder wähle passende Tags.
          </p>
        </div>

        <div className="mb-8">
          <div className="mb-4 max-w-[260px]">
            <PlaceSelect
              defaultValue={placeId}
              cities={CITIES}
              query={params.q}
              tags={params.tags}
            />
          </div>

          <SearchBar
            currentQuery={params.q}
            currentTags={params.tags}
            placeId={placeId}
          />
        </div>

        <BirdGrid birds={birds} region={currentCity.label} placeId={placeId} />
      </main>
    </div>
  );
}
