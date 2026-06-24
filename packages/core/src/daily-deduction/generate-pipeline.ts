import { generatePuzzleWithGemini, validatePuzzleWithGemini, type GeminiGenerateConfig } from "./gemini-generate";
import type { GeneratedPuzzle } from "./puzzle-types";
import { validateGeneratedPuzzle } from "./validate-puzzle";

export const MAX_GENERATION_RETRIES = 3;

export type GeneratePipelineDeps = {
  gemini: GeminiGenerateConfig;
  savePuzzle: (date: string, puzzle: GeneratedPuzzle) => Promise<void>;
};

export const runGeneratePipeline = async (
  deps: GeneratePipelineDeps,
  puzzleDate: string,
): Promise<GeneratedPuzzle> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_GENERATION_RETRIES; attempt += 1) {
    try {
      const raw = await generatePuzzleWithGemini(deps.gemini, puzzleDate);
      const puzzle = validateGeneratedPuzzle(raw);

      const aiCheck = await validatePuzzleWithGemini(deps.gemini, puzzle);
      if (!aiCheck.valid) {
        throw new Error(aiCheck.reason ?? "gemini_validation_failed");
      }

      await deps.savePuzzle(puzzleDate, puzzle);
      return puzzle;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("generate_failed");
    }
  }

  throw lastError ?? new Error("generate_failed");
};
