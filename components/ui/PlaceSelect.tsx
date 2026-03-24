"use client";

type CityOption = {
  label: string;
  placeId: string;
};

type Props = {
  defaultValue: string;
  cities: CityOption[];
  query?: string;
  tags?: string;
};

export default function PlaceSelect({
  defaultValue,
  cities,
  query,
  tags,
}: Props) {
  return (
    <form>
      <input type="hidden" name="q" value={query || ""} />
      <input type="hidden" name="tags" value={tags || ""} />
      <select
        name="place"
        defaultValue={defaultValue}
        onChange={(e) => e.currentTarget.form?.submit()}
        className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700 outline-none focus:border-stone-400"
      >
        {cities.map((city) => (
          <option key={city.placeId} value={city.placeId}>
            {city.label}
          </option>
        ))}
      </select>
    </form>
  );
}
