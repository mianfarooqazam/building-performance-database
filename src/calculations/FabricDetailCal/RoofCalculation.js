// RoofCalculation.js

export function calculateRValue(thicknessInches, kValue) {
    // Convert thickness from inches to meters
    const thicknessMeters = thicknessInches * 0.0254;
  
    // Calculate R-value
    const rValue = thicknessMeters / kValue;
  
    
    return rValue;



  }
  

  