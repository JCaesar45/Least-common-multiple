# LCM Luxe Platform

A production-grade, multi-runtime engine for computing the **least common multiple** of an integer array. The project ships as a luxurious, high-converting marketing site paired with idiomatic backend implementations in JavaScript, TypeScript, Python, and Java.

---

## What it does

Given any array of integers, `LCM(A)` returns the smallest positive integer that is divisible by every element. If any element is zero, the result is zero by convention.

```
lcm(m, n) = |m × n| / gcd(m, n)
```

Pairwise reduction over the array is associative, so a left-fold preserves correctness for arbitrary-length inputs (Rosen, 2019).

---

## Repository layout

| File | Purpose |
|------|---------|
| `index.html` | Single-page luxury marketing site |
| `styles.css` | Advanced CSS architecture with design tokens, grain overlay, and responsive layout |
| `app.js` | All front-end JavaScript: calculator, runtime tabs, syntax highlighting, canvas constellation, scroll reveals |
| `server.py` | FastAPI microservice exposing `/lcm`, `/lcm/async`, and `/health` |
| `lcm.py` | Pure Python LCM implementation using `math.gcd` and `functools.reduce` |
| `lcm.ts` | TypeScript implementation with `ReadonlyArray<number>` typing |
| `LcmEngine.java` | Java implementation using `BigInteger` for overflow-safe computation |
| `test_lcm.py` | Pytest suite covering Rosetta Code test vectors and edge cases |
| `package.json` | Node project metadata and convenience scripts |
| `requirements.txt` | Python dependencies |

---

## Running it

### Front end

```bash
npm run serve
# or
python3 -m http.server 3000
```

Open `http://localhost:3000`.

### Back end

```bash
pip install -r requirements.txt
python3 server.py
```

Then POST to `http://localhost:8080/lcm`:

```bash
curl -X POST http://localhost:8080/lcm \
  -H "Content-Type: application/json" \
  -d '{"values": [3, 4, 5, 12, 40]}'
```

### Tests

```bash
pytest test_lcm.py
```

### TypeScript

```bash
npx tsc lcm.ts
node lcm.js
```

### Java

```bash
javac LcmEngine.java
java LcmEngine
```

---

## Implementation notes

- **GCD**: Euclidean algorithm, `O(log min(m, n))` time complexity (Knuth, 1997).
- **LCM**: Derived from the identity `lcm(m, n) = |m × n| / gcd(m, n)`.
- **Zero handling**: Short-circuit to `0` to avoid division by zero and match the mathematical convention.
- **Java**: `BigInteger` prevents overflow when intermediate products exceed primitive long range.
- **Front end**: All HTML, CSS, and JavaScript are intentionally separate but cohesive files for maintainability; the browser receives a single unified experience.

---

## Test coverage

| Input | Expected |
|-------|----------|
| `[2, 4, 8]` | `8` |
| `[4, 8, 12]` | `24` |
| `[3, 4, 5, 12, 40]` | `120` |
| `[11, 33, 90]` | `990` |
| `[-50, 25, -45, -18, 90, 447]` | `67050` |
| `[0, 5, 10]` | `0` |
| `[7]` | `7` |

---

## References

Knuth, D. E. (1997). *The art of computer programming: Volume 1, fundamental algorithms* (3rd ed.). Addison-Wesley.

Rosen, K. H. (2019). *Discrete mathematics and its applications* (8th ed.). McGraw-Hill.

---

Built by LCM Luxe. Algorithmic elegance, distilled.
