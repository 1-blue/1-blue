import { getThemeMeta, resolveThemeForDate } from "./themes";

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

export type GeminiGenerateConfig = {
  apiKey: string;
  model: string;
};

export const generatePuzzleWithGemini = async (
  config: GeminiGenerateConfig,
  puzzleDate: string,
): Promise<unknown> => {
  const themeId = resolveThemeForDate(puzzleDate);
  const theme = getThemeMeta(themeId);
  const prompt = `당신은 한국어 추리 퍼즐 작가입니다. 지니어스/블러드 게임 스타일의 일일 추론 퍼즐 JSON을 생성하세요.

날짜: ${puzzleDate}
테마: ${theme.label} (${themeId})
테마 가이드: ${theme.promptGuide}

규칙:
- 8~10개의 단서 (clues). 그 중 1~2개는 거짓 단서(isFake: true).
- 3~5개의 객관식 문제(questions). 각 문제는 정확히 4개의 options와 correctOptionIndex(0~3).
- 단서만으로 추론 가능해야 하며, 거짓 단서는 모순되거나 함정이어야 합니다.
- 문항·선택지·해설에서 단서를 언급할 때 번호는 **1부터** (단서1, 단서01). **단서0 사용 금지**.
- memoryMinutes: 3 (암기 모드 제한 시간, 분)
- title, premise(사건 배경) 포함
- 사건 전개는 위 테마 가이드에 맞게 작성

반드시 아래 JSON 스키마만 출력 (마크다운 없이 순수 JSON):
{
  "themeId": "${themeId}",
  "title": "string",
  "premise": "string",
  "memoryMinutes": 3,
  "clues": [{ "orderIndex": 0, "text": "string", "isFake": false }],
  "questions": [{ "orderIndex": 0, "prompt": "string", "options": ["a","b","c","d"], "correctOptionIndex": 0, "explanation": "string" }]
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
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

export const validatePuzzleWithGemini = async (
  config: GeminiGenerateConfig,
  puzzle: unknown,
): Promise<{ valid: boolean; reason?: string }> => {
  const prompt = `다음 추리 퍼즐 JSON이 논리적으로 일관되고, 거짓 단서가 명확하며, 객관식 정답이 단서로부터 유도 가능한지 검증하세요.

퍼즐:
${JSON.stringify(puzzle)}

반드시 JSON만 출력:
{ "valid": true }
또는
{ "valid": false, "reason": "짧은 이유" }`;

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
    return { valid: true };
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return { valid: true };
  }

  try {
    const parsed = JSON.parse(extractJson(text)) as { valid?: boolean; reason?: string };
    return { valid: parsed.valid !== false, reason: parsed.reason };
  } catch {
    return { valid: true };
  }
};
