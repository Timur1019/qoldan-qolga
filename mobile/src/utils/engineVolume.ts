/** Объём двигателя в литрах. Если передали см³ (>= 50), переводим в литры. */
export function normalizeEngineVolume(raw: number | null | undefined): number | undefined {
  if (raw == null || Number.isNaN(raw)) return undefined;
  if (raw >= 50) return Math.round((raw / 1000) * 100) / 100;
  return Math.round(raw * 100) / 100;
}
