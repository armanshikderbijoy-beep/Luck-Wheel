/**
 * Math utilities for wheel slice calculations and landing target angles.
 * Pointer is located at the top (12 o'clock: -Math.PI / 2).
 */

export const INDICATOR_ANGLE = -Math.PI / 2; // 12 o'clock (Top)

/**
 * Normalizes an angle in radians to [0, 2 * Math.PI).
 */
export function normalizeAngle(angle: number): number {
  const twoPi = 2 * Math.PI;
  const mod = angle % twoPi;
  return mod < 0 ? mod + twoPi : mod;
}

/**
 * Returns which slice index (0 .. count - 1) is currently under the top indicator
 * given the wheel's current rotation in radians.
 */
export function getSliceIndexAtRotation(rotation: number, count: number): number {
  if (count <= 0) return 0;
  const sliceAngle = (2 * Math.PI) / count;
  // Spot on wheel under indicator:
  const spotOnWheel = normalizeAngle(INDICATOR_ANGLE - rotation);
  const index = Math.floor(spotOnWheel / sliceAngle);
  return Math.min(Math.max(0, index), count - 1);
}

/**
 * Calculates the exact target rotation in radians to land on `winningIndex`.
 * Guaranteed to point into the winning slice (safe inside [15%, 85%] of slice width).
 */
export function calculateTargetRotation(
  currentRotation: number,
  winningIndex: number,
  count: number,
  minFullSpins: number = 5,
  maxFullSpins: number = 7
): number {
  const sliceAngle = (2 * Math.PI) / count;

  // Mid-slice offset with a subtle random variation (between 25% and 75% into slice)
  // using crypto random float
  const randArray = new Uint32Array(1);
  window.crypto.getRandomValues(randArray);
  const randFraction = 0.3 + (randArray[0] / 0xffffffff) * 0.4; // 0.3 to 0.7

  const targetSpotOnWheel = (winningIndex + randFraction) * sliceAngle;

  // We want: normalizeAngle(INDICATOR_ANGLE - targetRotation) === targetSpotOnWheel
  // targetRotation === INDICATOR_ANGLE - targetSpotOnWheel (mod 2pi)
  const idealBaseAngle = normalizeAngle(INDICATOR_ANGLE - targetSpotOnWheel);

  // Full spins:
  const spinsArray = new Uint8Array(1);
  window.crypto.getRandomValues(spinsArray);
  const extraSpins = minFullSpins + (spinsArray[0] % (maxFullSpins - minFullSpins + 1));

  // Find shortest forward rotation to idealBaseAngle
  const currentNormalized = normalizeAngle(currentRotation);
  let forwardDelta = idealBaseAngle - currentNormalized;
  if (forwardDelta <= 0) {
    forwardDelta += 2 * Math.PI;
  }

  const finalRotation = currentRotation + forwardDelta + extraSpins * 2 * Math.PI;

  return finalRotation;
}

/**
 * Deceleration easing function (ease-out cubic / quintic hybrid)
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}
