import AppSidebar from "@/components/ui/AppSidebar";
import CollectionMap from "@/components/ui/CollectionMap";

type Props = {
  searchParams: Promise<{ bird?: string; name?: string }>;
};

export default async function MapPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen bg-[#F9F8F4] text-[#1f1f1c] pb-20 md:pb-0">
      <AppSidebar />
      <main className="flex-1 px-4 md:px-10 py-6 md:py-10 pb-24 md:pb-10">
        <div className="mb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#888780]">karte</p>
          <h1 className="mb-3 text-4xl italic">
            {params.name ? `Verbreitung — ${params.name}` : "Meine Sichtungen"}
          </h1>
          <p className="max-w-xl text-stone-500">
            {params.bird
              ? "Beobachtungen dieser Art in Deutschland."
              : "Alle Vögel die du gespeichert hast auf einen Blick."}
          </p>
        </div>
        <CollectionMap birdId={params.bird} />
      </main>
    </div>
  );
}
