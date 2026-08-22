import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;

/**
 * LCM Luxe Java Runtime
 * Computes the least common multiple of an arbitrary list of integers using
 * BigInteger arithmetic to eliminate overflow and sign ambiguity.
 */
public class LcmEngine {

  /**
   * Euclidean algorithm for greatest common divisor.
   */
  public static BigInteger gcd(BigInteger a, BigInteger b) {
    return b.equals(BigInteger.ZERO) ? a : gcd(b, a.mod(b));
  }

  /**
   * LCM identity: |a * b| / gcd(a, b).
   */
  public static BigInteger lcm(BigInteger a, BigInteger b) {
    return a.multiply(b).abs().divide(gcd(a, b));
  }

  /**
   * Fold LCM across the supplied integers. Returns zero if any input is zero.
   */
  public static BigInteger LCM(List<Integer> numbers) {
    if (numbers == null || numbers.isEmpty()) {
      throw new IllegalArgumentException("Input list must not be null or empty.");
    }
    if (numbers.stream().anyMatch(n -> n == 0)) {
      return BigInteger.ZERO;
    }
    return numbers.stream()
        .map(BigInteger::valueOf)
        .reduce(BigInteger.ONE, LcmEngine::lcm);
  }

  public static void main(String[] args) {
    List<Integer> sample = Arrays.asList(-50, 25, -45, -18, 90, 447);
    System.out.println("LCM(" + sample + ") = " + LCM(sample));
  }
}
