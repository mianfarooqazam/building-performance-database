// for calculated floor area
export function calculateFloorArea(wallLengths, buildingOrientation, getWallInputs) {
    if (!buildingOrientation) return 0;
  
    const wallLabels = getWallInputs(buildingOrientation);
    
    if (wallLabels.length === 2) {
      const length1 = parseFloat(wallLengths[wallLabels[0]]) || 0;
      const length2 = parseFloat(wallLengths[wallLabels[1]]) || 0;
      return length1 * length2;
    }
    
    return 0;
  }
  