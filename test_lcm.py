"""
LCM Luxe Python Test Suite
Validates correctness against the official Rosetta Code test vectors.
"""

import pytest
from lcm import LCM


TEST_CASES = [
    ([2, 4, 8], 8),
    ([4, 8, 12], 24),
    ([3, 4, 5, 12, 40], 120),
    ([11, 33, 90], 990),
    ([-50, 25, -45, -18, 90, 447], 67050),
    ([0, 5, 10], 0),
    ([7], 7),
]


@pytest.mark.parametrize("values, expected", TEST_CASES)
def test_lcm(values, expected):
    assert LCM(values) == expected
