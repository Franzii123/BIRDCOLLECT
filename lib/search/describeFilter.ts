// lib/search/describeFilter.ts
type BirdAttributes = {
  size: 'small' | 'medium' | 'large';
  colors: string[];
  habitats: string[];
};

const BIRD_ATTRIBUTES: Record<string, BirdAttributes> = {
  '13632': { size: 'small', colors: ['red', 'brown'], habitats: ['forest', 'park'] },
  '12716': { size: 'small', colors: ['blue', 'yellow'], habitats: ['city', 'park'] },
  '13957': { size: 'medium', colors: ['blue', 'orange'], habitats: ['water'] },
};

interface Filters {
  size?: 'small' | 'medium' | 'large';
  colors?: string[];
  habitats?: string[];
}

export function scoreByDescription(filters: Filters): string[] {
  return Object.entries(BIRD_ATTRIBUTES)
    .map(([id, attrs]) => {
      let score = 0;
      if (filters.size && attrs.size === filters.size) score += 3;
      if (filters.colors) score += filters.colors.filter(c => attrs.colors.includes(c)).length * 2;
      if (filters.habitats) score += filters.habitats.filter(h => attrs.habitats.includes(h)).length * 2;
      return { id, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(x => x.id);
}
