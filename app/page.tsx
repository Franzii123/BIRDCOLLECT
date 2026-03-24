export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F9F8F4] text-[#1f1f1c] px-6 py-10">
      <div className="max-w-md mx-auto pt-20">
        
        <p className="text-xs uppercase tracking-[0.25em] text-[#888780] mb-4">
          feldvogel
        </p>

        <h1 className="text-5xl italic leading-tight mb-4">
          Birds you find, keep.
        </h1>

        <p className="text-base text-[#888780] leading-7 mb-10">
          Discover birds around you, save the ones you’ve seen,
          and build your own quiet little collection.
        </p>

        <div className="flex flex-col gap-3">
          <button className="rounded-full bg-[#3B6D11] text-white px-5 py-3">
            Explore birds
          </button>

          <button className="rounded-full border border-[#C0DD97] px-5 py-3 text-[#3B6D11]">
            Choose city
          </button>
        </div>

      </div>
    </main>
  );
}