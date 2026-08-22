"""
LCM Luxe Backend API
A FastAPI microservice exposing the least-common-multiple algorithm
with synchronous and async endpoints, request validation, and structured
error responses. Ready for containerization and horizontal scaling.
"""

from __future__ import annotations

import asyncio
from functools import reduce
from math import gcd
from typing import List

from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field, field_validator

app = FastAPI(
    title="LCM Luxe API",
    description="Production-grade LCM computation over integer arrays.",
    version="1.0.0",
)


class LCMRequest(BaseModel):
    values: List[int] = Field(
        ...,
        min_length=1,
        description="A non-empty list of integers.",
    )

    @field_validator("values")
    @classmethod
    def check_finite_integers(cls, values: List[int]) -> List[int]:
        if not all(isinstance(v, int) for v in values):
            raise ValueError("All values must be integers.")
        return values


class LCMResponse(BaseModel):
    input: List[int]
    lcm: int
    algorithm: str = "euclidean_fold"


def _pair_lcm(a: int, b: int) -> int:
    """Pairwise LCM using the GCD identity."""
    return abs(a * b) // gcd(a, b)


def compute_lcm(values: List[int]) -> int:
    """Compute LCM over an arbitrary-length integer array."""
    if any(v == 0 for v in values):
        return 0
    return reduce(_pair_lcm, values)


@app.get("/health", status_code=status.HTTP_200_OK)
def health_check() -> dict:
    return {"status": "healthy", "service": "lcm-luxe"}


@app.post("/lcm", response_model=LCMResponse)
def lcm_endpoint(request: LCMRequest) -> LCMResponse:
    try:
        result = compute_lcm(request.values)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Computation failed: {exc}",
        ) from exc
    return LCMResponse(input=request.values, lcm=result)


@app.post("/lcm/async", response_model=LCMResponse)
async def lcm_async_endpoint(request: LCMRequest) -> LCMResponse:
    """Async variant suitable for I/O-bound gateways or event loops."""
    loop = asyncio.get_running_loop()
    try:
        result = await loop.run_in_executor(None, compute_lcm, request.values)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Computation failed: {exc}",
        ) from exc
    return LCMResponse(input=request.values, lcm=result)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server:app", host="0.0.0.0", port=8080, reload=False)
