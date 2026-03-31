"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const SidebarMap = dynamic(() => import("@/components/ui/SidebarMap"), { ssr: false });

function navClass(active: boolean) {
  return active
    ? "rounded-lg bg-stone-100 px-3 py-2 text-sm font-medium text-[#1f1f1c]"
    : "rounded-lg px-3 py-2 text-sm text-stone-500 hover:bg-stone-50 transition-colors";
}

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-stone-200 bg-white px-5 py-8 sticky top-0 h-screen overflow-y-auto flex flex-col">
      <p className="mb-8 text-xs uppercase tracking-[0.25em] text-[#888780]">BirdCollect</p>

      <nav className="flex flex-col gap-1 mb-8">
        <Link href="/explore" className={navClass(pathname.startsWith("/explore") || pathname.startsWith("/bird"))}>
          Explore
        </Link>
        <Link href="/collection" className={navClass(pathname.startsWith("/collection"))}>
          Meine Sammlung
        </Link>
        <Link href="/map" className={navClass(pathname.startsWith("/map"))}>
          Karte
        </Link>
      </nav>

      <div className="mb-6">
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#888780]">Meine Sichtungen</p>
        <SidebarMap />
      </div>
    </aside>
  );
}
