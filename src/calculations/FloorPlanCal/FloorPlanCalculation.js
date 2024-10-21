export function getWallInputs(orientation, OrientationSingleWindow, OrientationDoubleWindow) {
  let walls = [];
  if (!orientation) return walls;

  if (OrientationSingleWindow.includes(orientation)) {
    walls.push(`${orientation} Wall Length (ft)`);
    if (orientation === "North" || orientation === "South") {
      walls.push(`East Wall Length (ft)`);
    } else if (orientation === "East" || orientation === "West") {
      walls.push(`North Wall Length (ft)`);
    }
  } else if (OrientationDoubleWindow.includes(orientation)) {
    let wallsToShow = [];

    switch (orientation) {
      case "North-East":
        wallsToShow = ["North-East", "South-East"];
        break;
      case "North-West":
        wallsToShow = ["North-West", "South-West"];
        break;
      case "South-East":
        wallsToShow = ["South-East", "North-East"];
        break;
      case "South-West":
        wallsToShow = ["South-West", "North-West"];
        break;
      default:
        wallsToShow = [];
    }

    walls = wallsToShow.map((dir) => `${dir} Wall Length (ft)`);
  }
  return walls;
}

export function calculateArea(wallLengths, wallLabels) {
  if (wallLabels.length === 2) {
    const length1 = parseFloat(wallLengths[wallLabels[0]]) || 0;
    const length2 = parseFloat(wallLengths[wallLabels[1]]) || 0;
    return length1 * length2;
  }
  return 0;
}

export function calculateDwellingVolume(area, wallHeight, numberOfFloors) {
  const height = parseFloat(wallHeight) || 0;
  const floors = parseInt(numberOfFloors) || 1;
  return area * height * floors;
}
