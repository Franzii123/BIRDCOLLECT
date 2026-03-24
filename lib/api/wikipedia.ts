const WIKI_BASE = "https://de.wikipedia.org/api/rest_v1/page/summary/";

export async function getWikipediaSummary(title?: string) {
  if (!title) return null;

  try {
    const res = await fetch(
      WIKI_BASE + encodeURIComponent(title),
      { next: { revalidate: 60 * 60 } } // caching (1h)
    );

    if (!res.ok) return null;

    const data = await res.json();

    return {
      extract: data.extract || null,
      url: data.content_urls?.desktop?.page || null,
    };
  } catch {
    return null;
  }
}
