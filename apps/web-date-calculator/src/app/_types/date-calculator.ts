export type DateCalculatorTab = "days-between" | "date-offset";

export type DateOffsetDirection = "after" | "before";

export const DATE_OFFSET_PRESETS = [7, 30, 100, 365] as const;

export type DateOffsetPreset = (typeof DATE_OFFSET_PRESETS)[number];
