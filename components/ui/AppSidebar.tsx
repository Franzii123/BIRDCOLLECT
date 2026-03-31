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

function bottomNavClass(active: boolean) {
  return active
    ? "flex flex-col items-center gap-1 text-[#1f1f1c] font-medium"
    : "flex flex-col items-center gap-1 text-stone-400";
}

export default function AppSidebar() {
  const pathname = usePathname();
  const isExplore = pathname.startsWith("/explore") || pathname.startsWith("/bird");
  const isCollection = pathname.startsWith("/collection");
  const isMap = pathname.startsWith("/map");

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-60 shrink-0 border-r border-stone-200 bg-white px-5 py-8 sticky top-0 h-screen overflow-y-auto flex-col">
        <p className="mb-8 text-xs uppercase tracking-[0.25em] text-[#888780]">BirdCollect</p>

        <nav className="flex flex-col gap-1 mb-8">
          <Link href="/explore" className={navClass(isExplore)}>Explore</Link>
          <Link href="/collection" className={navClass(isCollection)}>Meine Sammlung</Link>
          <Link href="/map" className={navClass(isMap)}>Karte</Link>
        </nav>

        <div className="mb-6">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#888780]">Meine Sichtungen</p>
          <SidebarMap />
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-300 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] px-6 py-3 flex justify-around">
        <Link href="/explore" className={bottomNavClass(isExplore)}>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span className="text-xs">Explore</span>
        </Link>
        <Link href="/collection" className={bottomNavClass(isCollection)}>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <span className="text-xs">Sammlung</span>
        </Link>
        <Link href="/map" className={bottomNavClass(isMap)}>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          <span className="text-xs">Karte</span>
        </Link>
      </nav>
    </>
  );
}
