import type { GeneratedStory } from "@1-blue/core/sseoltalk";
import { VALIDATION_PROMPT } from "@1-blue/core/sseoltalk";

const extractJson = (text: string): string => {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return text.slice(start, end + 1);
  }
  return text.trim();
};

export type GeminiConfig = {
  apiKey: string;
  model: string;
};

export const generateStoryWithGemini = async (
  config: GeminiConfig,
  systemPrompt: string,
  userPrompt: string,
): Promise<unknown> => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.9,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`gemini_generate_failed: ${response.status} ${body.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("gemini_empty_response");
  }

  return JSON.parse(extractJson(text));
};

export const validateStoryWithGemini = async (
  config: GeminiConfig,
  story: GeneratedStory,
): Promise<unknown> => {
  const prompt = VALIDATION_PROMPT.replace("{storyJson}", JSON.stringify(story, null, 2));
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`gemini_validate_failed: ${response.status} ${body.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("gemini_empty_response");
  }

  return JSON.parse(extractJson(text));
};
