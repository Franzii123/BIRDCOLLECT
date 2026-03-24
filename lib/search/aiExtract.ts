// lib/search/aiExtract.ts
// Requires: OPENAI_API_KEY in env

export async function extractFiltersFromText(description: string): Promise<Filters> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Extract bird attributes from a German or English description. 
Return ONLY valid JSON with keys: size (small|medium|large|null), colors (array of: red,blue,yellow,green,brown,black,white,orange,gray), habitats (array of: city,water,forest,park).
Example: {"size":"small","colors":["brown"],"habitats":["water"]}`
        },
        { role: 'user', content: description }
      ],
      max_tokens: 150,
    }),
  });
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}