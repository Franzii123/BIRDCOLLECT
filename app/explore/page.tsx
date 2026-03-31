import { searchBirds, searchBirdsByLocation } from "@/lib/api/inaturalist";
import BirdGrid from "@/components/birds/BirdGrid";
import SearchBar from "@/components/search/SearchBar";
import PlaceSelect from "@/components/ui/PlaceSelect";
import AppSidebar from "@/components/ui/AppSidebar";

const CITIES: { label: string; placeId: string }[] = [
  { label: "Deutschland", placeId: "97394" },
  { label: "Berlin", placeId: "12872" },
  { label: "Potsdam", placeId: "98460" },
  { label: "Hamburg", placeId: "12874" },
  { label: "Stuttgart", placeId: "29463" },
  { label: "Leipzig", placeId: "29494" },
  { label: "Frankfurt", placeId: "98470" },
];

type Props = {
  searchParams: Promise<{ q?: string; tags?: string; place?: string; lat?: string; lng?: string }>;
};

export default async function ExplorePage({ searchParams }: Props) {
  const params = await searchParams;
  const placeId = params.place || "97394";
  const currentCity = CITIES.find((c) => c.placeId === placeId) || CITIES[0];

  let birds = [];
  let locationLabel = currentCity.label;

  // Wenn lat/lng vorhanden → lokale Suche
  if (params.lat && params.lng) {
    const lat = parseFloat(params.lat);
    const lng = parseFloat(params.lng);
    birds = await searchBirdsByLocation(lat, lng);
    locationLabel = `${lat.toFixed(2)}°N ${lng.toFixed(2)}°E`;
  } else {
    const combined = [params.q, params.tags].filter(Boolean).join(" ").trim();
    const query = combined || "meise";
    birds = await searchBirds(query, placeId);
    if (!birds.length) birds = await searchBirds("meise", placeId);
  }

  return (
    <div className="flex min-h-screen bg-[#F9F8F4] text-[#1f1f1c]">
      <AppSidebar />
      <main className="flex-1 px-10 py-10">
        <div className="mb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#888780]">
            explore — {locationLabel}
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
