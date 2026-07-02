import { runEnsureLookahead, generatePuzzleForDate } from "../src/lib/repository";

const parseDatesArg = (): string[] | null => {
  const datesIndex = process.argv.indexOf("--dates");
  if (datesIndex === -1) {
    return null;
  }
  const value = process.argv[datesIndex + 1];
  if (!value) {
    return null;
  }
  return value
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);
};

const main = async () => {
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const explicitDates = parseDatesArg();
  if (explicitDates) {
    console.log(`Generating puzzles with model: ${model}`);
    const generated: string[] = [];
    for (const date of explicitDates) {
      await generatePuzzleForDate(date);
      generated.push(date);
      console.log(`Generated: ${date}`);
    }
    console.log(JSON.stringify({ generated, skipped: [] }, null, 2));
    return;
  }

  console.log(`Generating puzzles with model: ${model}`);
  const result = await runEnsureLookahead();
  console.log(JSON.stringify(result, null, 2));
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
