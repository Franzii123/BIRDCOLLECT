const BASE = "https://api.inaturalist.org/v1";

const cache = new Map<string, { data: any; ts: number }>();
const TTL = 1000 * 60 * 60; // 1 hour cache

async function fetchCached(url: string) {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.ts < TTL) return hit.data;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  const data = await res.json();

  cache.set(url, { data, ts: Date.now() });
  return data;
}

export async function searchBirds(query: string, placeId = "97394") {
  const safeQuery = query.trim() || "meise";

  const url =
    `${BASE}/taxa?q=${encodeURIComponent(safeQuery)}` +
    `&iconic_taxa=Aves` +
    `&place_id=${placeId}` +
    `&per_page=24` +
    `&locale=de`;

  const data = await fetchCached(url);
  return (data.results || []).map(mapTaxon);
}

export async function getBirdById(id: string) {
  const url = `${BASE}/taxa/${id}?locale=de`;
  const data = await fetchCached(url);

  const taxon =
    data?.results?.[0] ||
    data;

  if (!taxon || !taxon.id) {
    return {
      id,
      name: "Unbekannter Vogel",
      scientific: "Keine Daten gefunden",
      image: null,
      wikipedia: null,
    };
  }

  return mapTaxon(taxon);
}

export async function getBirdsNearCity(cityLat: number, cityLng: number) {
  const url =
    `${BASE}/observations?taxon_id=3` +
    `&lat=${cityLat}` +
    `&lng=${cityLng}` +
    `&radius=50` +
    `&per_page=30` +
    `&order=votes` +
    `&locale=de`;

  const data = await fetchCached(url);
  return (data.results || []).map((o: any) => mapObservation(o));
}

function mapTaxon(t: any) {
  return {
    id: String(t.id),
    name: t.preferred_common_name || t.name || "Unbekannter Vogel",
    scientific: t.name || "Keine Daten gefunden",
    image: t.default_photo?.medium_url || null,
    wikipedia: t.wikipedia_url || null,
  };
}

function mapObservation(o: any) {
  return {
    id: String(o.taxon?.id),
    name: o.taxon?.preferred_common_name || o.taxon?.name || "Unbekannter Vogel",
    scientific: o.taxon?.name || "Keine Daten gefunden",
    image: o.taxon?.default_photo?.medium_url || null,
    wikipedia: o.taxon?.wikipedia_url || null,
  };
}

export async function searchBirdsByLocation(lat: number, lng: number) {
  const url =
    `${BASE}/observations?taxon_id=3` +
    `&lat=${lat}&lng=${lng}&radius=30` +
    `&per_page=24&order=votes&locale=de` +
    `&quality_grade=research`;
  const data = await fetchCached(url);
  return (data.results || [])
    .filter((o: any) => o.taxon)
    .map((o: any) => mapObservation(o))
    .filter((b: any, i: number, arr: any[]) =>
      arr.findIndex(x => x.id === b.id) === i
    );
}
