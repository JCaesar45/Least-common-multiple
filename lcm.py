"""
LCM Luxe Python Runtime
Idiomatic, type-hinted implementation using math.gcd and functools.reduce.
"""

from math import gcd
from functools import reduce


def _pair_lcm(a: int, b: int) -> int:
    """Compute the least common multiple of two integers."""
    return abs(a * b) // gcd(a, b)


def LCM(values: list[int]) -> int:
    """
    Compute the least common multiple of an integer array.

    Parameters
    ----------
    values: list[int]
        A non-empty list of integers.

    Returns
    -------
    int
        The least common multiple. Returns 0 if any input is 0.
    """
    if any(x == 0 for x in values):
        return 0
    return reduce(_pair_lcm, values)


if __name__ == "__main__":
    sample = [-50, 25, -45, -18, 90, 447]
    print(f"LCM({sample}) = {LCM(sample)}")
