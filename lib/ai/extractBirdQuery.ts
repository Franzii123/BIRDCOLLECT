export async function extractBirdQuery(description: string): Promise<string> {
  if (!description.trim()) return "";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 50,
      messages: [
        {
          role: "user",
          content: `Du bist ein Vogelexperte. Der Nutzer beschreibt einen Vogel auf Deutsch.
Antworte NUR mit dem wahrscheinlichsten deutschen Vogelnamen (1-3 Wörter, kein Satz, keine Erklärung).
Beschreibung: "${description}"`,
        },
      ],
    }),
  });

  const data = await response.json();
  return data.content?.[0]?.text?.trim() || description;
}

export async function extractBirdFromImage(base64Image: string, mimeType: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 50,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType,
                data: base64Image,
              },
            },
            {
              type: "text",
              text: `Du bist ein Vogelexperte. Welcher Vogel ist auf diesem Foto?
Antworte NUR mit dem deutschen Vogelnamen (1-3 Wörter, kein Satz, keine Erklärung).
Falls kein Vogel zu sehen ist, antworte mit "Vogel".`,
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();
  return data.content?.[0]?.text?.trim() || "Vogel";
}
