/**
 * Generates a unique ID using timestamp and random characters.
 * @returns A unique string identifier
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Formats a number to two decimal places.
 * @param value - The number to format
 * @returns Formatted string with two decimal places
 */
export function formatAtom(value: number): string {
  return value.toFixed(2)
}

/**
 * Calculates the percentage of a value relative to a total.
 * Returns 0 if total is 0 to avoid division by zero.
 * @param value - The part value
 * @param total - The total value
 * @returns Percentage as a number between 0 and 100
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

/**
 * Seeded pseudo-random number generator for deterministic NPC behaviour.
 * Uses a simple hash-based approach seeded from the proposal ID.
 * @param seed - The seed string
 * @returns A function that returns deterministic pseudo-random numbers between 0 and 1
 */
export function seededRandom(seed: string): () => number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }

  return () => {
    hash = (hash * 16807) % 2147483647
    if (hash < 0) hash += 2147483647
    return (hash - 1) / 2147483646
  }
}

/**
 * Delays execution for the specified number of milliseconds.
 * @param ms - Milliseconds to wait
 * @returns A promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Clamps a number between a minimum and maximum value.
 * @param value - The value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns The clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
