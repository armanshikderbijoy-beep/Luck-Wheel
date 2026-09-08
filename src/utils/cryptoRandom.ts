/**
 * Cryptographically secure random integer generator between 0 and maxExclusive - 1.
 * Uses window.crypto.getRandomValues with rejection sampling to eliminate modulo bias.
 */
export function getSecureRandomIndex(maxExclusive: number): number {
  if (maxExclusive <= 0) {
    throw new Error('maxExclusive must be greater than 0');
  }
  if (maxExclusive === 1) {
    return 0;
  }

  // Use rejection sampling to guarantee 100% equal probability across all items
  const range = 0xffffffff; // 2^32 - 1
  const limit = range - (range % maxExclusive);
  const buffer = new Uint32Array(1);

  let randomVal = 0;
  do {
    window.crypto.getRandomValues(buffer);
    randomVal = buffer[0];
  } while (randomVal >= limit);

  return randomVal % maxExclusive;
}
