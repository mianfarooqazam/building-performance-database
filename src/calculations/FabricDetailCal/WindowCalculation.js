
export function calculateEffectiveUValue(uValue) {
    if (uValue === 0) {
      throw new Error("U-value cannot be zero.");
    }
    const effectiveUValue = 1 / ((1 / uValue) + 0.04);
    return effectiveUValue;
  }
  