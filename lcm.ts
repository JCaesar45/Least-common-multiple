/**
 * LCM Luxe TypeScript Runtime
 * Strongly-typed, immutable-input LCM computation suitable for Node.js
 * and browser bundles compiled with tsc, esbuild, or Vite.
 */

export function LCM(A: ReadonlyArray<number>): number {
  if (A.some((x: number) => x === 0)) {
    return 0;
  }

  const gcd = (a: number, b: number): number =>
    b === 0 ? a : gcd(b, a % b);

  const lcm = (a: number, b: number): number =>
    Math.abs(a * b) / gcd(a, b);

  return A.reduce((acc, val) => lcm(acc, val), 1);
}

// Sanity check when executed directly with ts-node or Deno.
if (import.meta.main) {
  const sample = [-50, 25, -45, -18, 90, 447];
  console.log(`LCM(${sample.join(", ")}) = ${LCM(sample)}`);
}
