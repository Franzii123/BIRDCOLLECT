"use server";
import { extractBirdQuery, extractBirdFromImage } from "@/lib/ai/extractBirdQuery";

export async function smartSearch(description: string, tags: string[]): Promise<string> {
  const combined = [description, ...tags].filter(Boolean).join(", ");
  if (!combined.trim()) return "meise";
  if (description.trim()) {
    return await extractBirdQuery(combined);
  }
  return tags.join(" ");
}

export async function smartSearchFromImage(base64Image: string, mimeType: string): Promise<string> {
  return await extractBirdFromImage(base64Image, mimeType);
}
