function LCM(A) {
 if (A.some(x => x === 0)) return 0;
 
 const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
 const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
 
 return A.reduce((acc, val) => lcm(acc, val));
}
