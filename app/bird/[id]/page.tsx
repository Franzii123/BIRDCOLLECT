import { getBirdById } from "@/lib/api/inaturalist";
import { getWikipediaSummary } from "@/lib/api/wikipedia";
import BirdDetail from "@/components/birds/BirdDetail";
import AppSidebar from "@/components/ui/AppSidebar";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: {
    name?: string;
    scientific?: string;
    image?: string;
    region?: string;
    placeId?: string;
  };
};

export default async function BirdDetailPage({ params, searchParams }: Props) {
  const { id } = await params;

  let bird = await getBirdById(id);

  if (!bird) {
    bird = {
      id,
      name: searchParams?.name || "Unbekannter Vogel",
      scientific: searchParams?.scientific || "",
      image: searchParams?.image || null,
      wikipedia: null,
    };
  }

  const wiki = await getWikipediaSummary(bird.name);

  return (
    <div className="flex min-h-screen bg-[#F9F8F4] text-[#1f1f1c]">
      <AppSidebar regionLabel={searchParams?.region || "Deutschland"} />

      <main className="flex-1 px-10 py-10">
        <a
          href="/explore"
          className="mb-6 inline-block text-sm text-stone-500 hover:text-black"
        >
          ← Zurück zu Explore
        </a>

        <div className="mb-6">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#888780]">
            explore / details
          </p>
        </div>

        <BirdDetail
          bird={bird}
          summary={wiki?.extract}
          wikiUrl={wiki?.url || bird.wikipedia}
        />
      </main>
    </div>
  );
}
