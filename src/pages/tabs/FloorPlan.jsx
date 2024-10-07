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

import useFloorPlanStore from '../../store/useFloorPlanStore';

function FloorPlan() {
  const {
    buildingOrientation,
    numberOfFloors,
    showWindowInputs,
    windowOrientation,
    wallLengths,
    wallHeight,
    totalFloorArea,
    windowArea,
    setBuildingOrientation,
    setNumberOfFloors,
    setShowWindowInputs,
    setWindowOrientation,
    setWallLengths,
    setWallHeight,
    setTotalFloorArea,
    setWindowArea,
  } = useFloorPlanStore();

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
      const directions = orientation.split("-");
      walls.push(`${directions[0]} Wall Length (ft)`);
      walls.push(`${directions[1]} Wall Length (ft)`);
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

  return (
    <Box p={3} display="flex" flexDirection="column" gap={2}>
      <h1>Wall dimensions</h1>
      <Box display="flex" gap={2}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Building Orientation</InputLabel>
          <Select
            label="Building Orientation"
            value={buildingOrientation}
            onChange={(e) => setBuildingOrientation(e.target.value)}
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
          <Box display="flex" gap={2}>
            <TextField
              label="Total Floor Area (ft²)"
              variant="outlined"
              fullWidth
              value={totalFloorArea}
              onChange={(e) => setTotalFloorArea(e.target.value)}
            />
          </Box>
        </>
      )}

      <h1>Window dimensions</h1>
      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          onClick={() => setShowWindowInputs(true)}
        >
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
