"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { smartSearch, smartSearchFromImage } from "@/app/actions/search";

const TAGS = [
  "klein", "groß", "braun", "schwarz", "rot", "blau",
  "Singvogel", "Wasservogel", "Greifvogel", "gestreift", "Zugvogel",
];

type Props = {
  currentQuery?: string;
  currentTags?: string;
  placeId?: string;
};

async function resizeImage(file: File, maxWidth = 800): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      URL.revokeObjectURL(url);
      resolve({ base64: dataUrl.split(",")[1], mimeType: "image/jpeg" });
    };
    img.src = url;
  });
}

export default function SearchBar({ currentQuery, currentTags, placeId }: Props) {
  const router = useRouter();
  const [text, setText] = useState(currentQuery || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    currentTags ? currentTags.split(",").filter(Boolean) : []
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleSearch() {
    startTransition(async () => {
      const birdQuery = await smartSearch(text, selectedTags);
      const params = new URLSearchParams();
      if (birdQuery) params.set("q", birdQuery);
      if (placeId) params.set("place", placeId);
      router.push(`/explore?${params.toString()}`);
    });
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    startTransition(async () => {
      const { base64, mimeType } = await resizeImage(file);
      const birdQuery = await smartSearchFromImage(base64, mimeType);
      const params = new URLSearchParams();
      if (birdQuery) params.set("q", birdQuery);
      if (placeId) params.set("place", placeId);
      router.push(`/explore?${params.toString()}`);
    });
  }

  return (
    <div className="mb-8">
      <div className="mb-4 flex gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="z.B. kleiner brauner Vogel mit roter Brust..."
          disabled={isPending}
          className="w-full rounded-full border border-stone-300 bg-white px-5 py-3 text-sm outline-none transition-colors focus:border-stone-500 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isPending}
          className="shrink-0 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm text-stone-600 transition-colors hover:border-stone-500 disabled:opacity-50"
        >
          {isPending ? "..." : "Foto"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageUpload}
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isPending}
          className="shrink-0 rounded-full bg-[#1f1f1c] px-6 py-3 text-sm text-white transition-colors hover:bg-stone-700 disabled:opacity-50"
        >
          {isPending ? "Suche..." : "Suchen"}
        </button>
      </div>

      {preview && (
        <div className="mb-4 flex items-center gap-3">
          <img src={preview} alt="Vorschau" className="h-16 w-16 rounded-lg object-cover border border-stone-200" />
          <button
            type="button"
            onClick={() => { setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
            className="text-xs text-stone-400 hover:text-stone-600"
          >
            Entfernen
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button
            type="button"
            key={tag}
            onClick={() => toggleTag(tag)}
            disabled={isPending}
            className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
              selectedTags.includes(tag)
                ? "border-[#1f1f1c] bg-[#1f1f1c] text-white"
                : "border-stone-300 bg-white text-stone-500 hover:border-stone-500"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
