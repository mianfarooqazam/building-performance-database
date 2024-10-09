// RoofCalculation.js

export function calculateRValue(thicknessInches, kValue) {
    // Convert thickness from inches to meters
    const thicknessMeters = thicknessInches * 0.0254;
  
    // Calculate R-value
    const rValue = thicknessMeters / kValue;
  
    return rValue;
  }
  
  export function calculateRTotal(rValues, hi = 0.4, ho = 0.09) {
    // Sum the R-values
    const sumRValues = rValues.reduce((sum, rValue) => sum + rValue, 0);
  
    // Add hi and ho
    const rTotal = sumRValues + parseFloat(hi) + parseFloat(ho);
  
    return rTotal;
  }
  
  export function calculateUValue(rTotal) {
    // Calculate U-value
    const uValue = 1 / rTotal;
    return uValue;
  }
  