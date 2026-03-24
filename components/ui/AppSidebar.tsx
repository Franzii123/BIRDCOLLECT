"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function navClass(active: boolean) {
  return active
    ? "rounded-lg bg-stone-100 px-3 py-2 text-sm font-medium text-[#1f1f1c]"
    : "rounded-lg px-3 py-2 text-sm text-stone-500 hover:bg-stone-50";
}

export default function AppSidebar() {
  const pathname = usePathname();

  const isExplore = pathname.startsWith("/explore") || pathname.startsWith("/bird");
  const isCollection = pathname.startsWith("/collection");

  return (
    <aside className="w-60 shrink-0 border-r border-stone-200 bg-white px-5 py-8 sticky top-0 h-screen overflow-y-auto flex flex-col">
      <p className="mb-8 text-xs uppercase tracking-[0.25em] text-[#888780]">
        BirdCollect
      </p>

      <nav className="flex flex-col gap-1">
        <Link href="/explore" className={navClass(isExplore)}>
          Explore
        </Link>
        <Link href="/collection" className={navClass(isCollection)}>
          Meine Sammlung
        </Link>
      </nav>

      <div className="mt-8">
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#888780]">
          Zuletzt gesehen
        </p>
        <p className="text-sm text-stone-400 italic">
          Noch keine Einträge
        </p>
      </div>
    </aside>
  );
}
