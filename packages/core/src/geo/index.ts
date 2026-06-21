import { z } from "zod";

export const coordinateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type Coordinate = z.infer<typeof coordinateSchema>;

export const parseCoordinateInput = (input: string): Coordinate | null => {
  const trimmed = input.trim();
  const parts = trimmed.split(/[,\s]+/).filter(Boolean);

  if (parts.length !== 2) return null;

  const lat = Number(parts[0]);
  const lng = Number(parts[1]);

  const result = coordinateSchema.safeParse({ latitude: lat, longitude: lng });
  return result.success ? result.data : null;
};

export const formatCoordinate = (coord: Coordinate): string => {
  return `${coord.latitude.toFixed(6)}, ${coord.longitude.toFixed(6)}`;
};

export const geocodeAddressMock = async (address: string): Promise<Coordinate | null> => {
  const normalized = address.trim().toLowerCase();
  if (!normalized) return null;

  // Mock geocoder for template/demo — replace with real API in production apps
  const mockMap: Record<string, Coordinate> = {
    서울시청: { latitude: 37.5665851, longitude: 126.9782038 },
    "seoul city hall": { latitude: 37.5665851, longitude: 126.9782038 },
  };

  return mockMap[normalized] ?? null;
};
