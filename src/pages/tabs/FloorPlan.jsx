import {
  Box,
  MenuItem,
  TextField,
  Select,
  Button,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  Orientation,
  OrientationSingleWindow,
  OrientationDoubleWindow,
  Floors,
} from "../../utils/BuildingInformationData";
import useFloorPlanStore from "../../store/useFloorPlanStore";
import { useState, useEffect } from "react";

function FloorPlan() {
  const {
    buildingOrientation,
    numberOfFloors,
    showWindowInputs,
    windowOrientation,
    wallLengths,
    wallHeight,
    windowArea,
    setBuildingOrientation,
    setNumberOfFloors,
    setShowWindowInputs,
    setWindowOrientation,
    setWallLengths,
    setWallHeight,
    setWindowArea,
  } = useFloorPlanStore();

  const [calculatedArea, setCalculatedArea] = useState(0);

  function getWallInputs(orientation) {
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
      // Adjusted logic for double orientations
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

  function getWindowOrientations() {
    if (OrientationSingleWindow.includes(buildingOrientation)) {
      return OrientationSingleWindow;
    } else if (OrientationDoubleWindow.includes(buildingOrientation)) {
      return OrientationDoubleWindow;
    } else {
      return [];
    }
  }

  useEffect(() => {
    // Calculate the area based on available wall lengths
    const wallLabels = getWallInputs(buildingOrientation);
    if (wallLabels.length === 2) {
      const length1 = parseFloat(wallLengths[wallLabels[0]]) || 0;
      const length2 = parseFloat(wallLengths[wallLabels[1]]) || 0;
      setCalculatedArea(length1 * length2);
    } else {
      setCalculatedArea(0);
    }
  }, [wallLengths, buildingOrientation]);

  return (
    <Box p={3} display="flex" flexDirection="column" gap={2}>
      <h1 className="font-semibold text-2xl">Wall dimensions</h1>
      <Box display="flex" gap={2}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Building Orientation</InputLabel>
          <Select
            label="Building Orientation"
            value={buildingOrientation}
            onChange={(e) => {
              setBuildingOrientation(e.target.value);
              setWallLengths({}); // Reset wall lengths when orientation changes
            }}
          >
            {Orientation.map((direction) => (
              <MenuItem key={direction} value={direction}>
                {direction}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined">
          <InputLabel>No. of Floors</InputLabel>
          <Select
            label="No. of Floors"
            value={numberOfFloors}
            onChange={(e) => setNumberOfFloors(e.target.value)}
          >
            {Floors.map((floor) => (
              <MenuItem key={floor} value={floor}>
                {floor}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {buildingOrientation && (
        <>
          <Box display="flex" gap={2}>
            {getWallInputs(buildingOrientation).map((label) => (
              <TextField
                key={label}
                label={label}
                variant="outlined"
                fullWidth
                value={wallLengths[label] || ""}
                onChange={(e) =>
                  setWallLengths({
                    ...wallLengths,
                    [label]: e.target.value,
                  })
                }
              />
            ))}
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              label="Wall Height (ft)"
              variant="outlined"
              fullWidth
              value={wallHeight}
              onChange={(e) => setWallHeight(e.target.value)}
            />
          </Box>
          <Box display="flex" gap={2} alignItems="center">
            <Box
              p={2}
              width="100%"
              textAlign="center"
              bgcolor="lightblue"
              borderRadius={2}
              fontWeight="bold"
            >
              Calculated Floor Area: {calculatedArea.toFixed(2)} ft²
            </Box>
          </Box>
        </>
      )}

      <h1 className="font-semibold text-2xl">Window dimensions</h1>
      <Box display="flex" gap={2}>
        <Button variant="contained" onClick={() => setShowWindowInputs(true)}>
          Add
        </Button>
      </Box>

      {showWindowInputs && (
        <Box display="flex" gap={2}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Orientation</InputLabel>
            <Select
              label="Orientation"
              value={windowOrientation}
              onChange={(e) => setWindowOrientation(e.target.value)}
            >
              {getWindowOrientations().map((direction) => (
                <MenuItem key={direction} value={direction}>
                  {direction}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Window Area (ft²)"
            variant="outlined"
            fullWidth
            value={windowArea}
            onChange={(e) => setWindowArea(e.target.value)}
          />
        </Box>
      )}
    </Box>
  );
}

export default FloorPlan;
