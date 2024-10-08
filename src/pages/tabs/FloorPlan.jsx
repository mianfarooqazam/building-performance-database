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
  OrientationSingleDoor,
  OrientationDoubleDoor,
  Floors,
} from "../../utils/BuildingInformationData";
import useFloorPlanStore from "../../store/useFloorPlanStore";
import { useState, useEffect } from "react";
import {
  calculateArea,
  calculateDwellingVolume,
  getWallInputs,
} from "../../calculations/FloorPlanCal/FloorPlanCalculation";

function FloorPlan() {
  const {
    buildingOrientation,
    numberOfFloors,
    wallLengths,
    wallHeight,
    setBuildingOrientation,
    setNumberOfFloors,
    setWallLengths,
    setWallHeight,
  } = useFloorPlanStore();

  const [calculatedArea, setCalculatedArea] = useState(0);
  const [dwellingVolume, setDwellingVolume] = useState(0);

  const [windows, setWindows] = useState([]);
  const [newWindowOrientation, setNewWindowOrientation] = useState("");
  const [newWindowArea, setNewWindowArea] = useState("");

  const [doors, setDoors] = useState([]);
  const [newDoorOrientation, setNewDoorOrientation] = useState("");
  const [newDoorArea, setNewDoorArea] = useState("");

  function getWindowOrientations() {
    if (OrientationSingleWindow.includes(buildingOrientation)) {
      return OrientationSingleWindow;
    } else if (OrientationDoubleWindow.includes(buildingOrientation)) {
      return OrientationDoubleWindow;
    } else {
      return [];
    }
  }

  function getDoorOrientations() {
    if (OrientationSingleDoor.includes(buildingOrientation)) {
      return OrientationSingleDoor;
    } else if (OrientationDoubleDoor.includes(buildingOrientation)) {
      return OrientationDoubleDoor;
    } else {
      return [];
    }
  }

  useEffect(() => {
    const wallLabels = getWallInputs(
      buildingOrientation,
      OrientationSingleWindow,
      OrientationDoubleWindow
    );
    const area = calculateArea(wallLengths, wallLabels);
    setCalculatedArea(area);

    const volume = calculateDwellingVolume(area, wallHeight);
    setDwellingVolume(volume);
  }, [wallLengths, buildingOrientation, wallHeight]);

  const handleAddWindow = () => {
    if (windows.length < 4 && newWindowOrientation && newWindowArea) {
      setWindows([
        ...windows,
        {
          orientation: newWindowOrientation,
          area: parseFloat(newWindowArea),
        },
      ]);
      setNewWindowOrientation("");
      setNewWindowArea("");
    }
  };

  const handleRemoveWindow = (index) => {
    setWindows(windows.filter((_, i) => i !== index));
  };

  const handleAddDoor = () => {
    if (doors.length < 4 && newDoorOrientation && newDoorArea) {
      setDoors([
        ...doors,
        {
          orientation: newDoorOrientation,
          area: parseFloat(newDoorArea),
        },
      ]);
      setNewDoorOrientation("");
      setNewDoorArea("");
    }
  };

  const handleRemoveDoor = (index) => {
    setDoors(doors.filter((_, i) => i !== index));
  };

  return (
    <Box p={3} display="flex" flexDirection="column" gap={2} overflow="hidden">
      <h1 className="font-semibold text-2xl">Wall Dimensions</h1>
      <Box display="flex" flexWrap="wrap" gap={2}>
        <FormControl fullWidth variant="outlined" sx={{ flex: 1 }}>
          <InputLabel>Building Orientation</InputLabel>
          <Select
            label="Building Orientation"
            value={buildingOrientation}
            onChange={(e) => {
              setBuildingOrientation(e.target.value);
              setWallLengths({}); 
              setWindows([]);     
              setDoors([]);      
            }}
          >
            {Orientation.map((direction) => (
              <MenuItem key={direction} value={direction}>
                {direction}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" sx={{ flex: 1 }}>
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
          <Box display="flex" flexWrap="wrap" gap={2}>
            {getWallInputs(
              buildingOrientation,
              OrientationSingleWindow,
              OrientationDoubleWindow
            ).map((label) => (
              <TextField
                key={label}
                label={label}
                variant="outlined"
                fullWidth
                sx={{ flex: 1 }}
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
          <Box display="flex" flexWrap="wrap" gap={2}>
            <TextField
              label="Wall Height (ft)"
              variant="outlined"
              fullWidth
              sx={{ flex: 1 }}
              value={wallHeight}
              onChange={(e) => setWallHeight(e.target.value)}
            />
          </Box>
          <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
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
            <Box
              p={2}
              width="100%"
              textAlign="center"
              bgcolor="lightblue"
              borderRadius={2}
              fontWeight="bold"
            >
              Dwelling Volume: {dwellingVolume.toFixed(2)} ft³
            </Box>
          </Box>
        </>
      )}

      <h1 className="font-semibold text-2xl">Window Dimensions</h1>

      {windows.length < 4 && (
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
          <FormControl fullWidth variant="outlined" sx={{ flex: 1 }}>
            <InputLabel>Orientation</InputLabel>
            <Select
              label="Orientation"
              value={newWindowOrientation}
              onChange={(e) => setNewWindowOrientation(e.target.value)}
              displayEmpty
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
            sx={{ flex: 1 }}
            value={newWindowArea}
            onChange={(e) => setNewWindowArea(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddWindow}>
            Add
          </Button>
        </Box>
      )}
      {windows.length >= 4 && (
        <Box>
          <p>Maximum of 4 windows can be added.</p>
        </Box>
      )}

      {/* Display the added windows */}
      {windows.length > 0 && (
        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          {windows.map((window, index) => (
            <Box
              key={index}
              p={2}
              width="100%"
              textAlign="center"
              bgcolor="lightblue"
              borderRadius={2}
              fontWeight="bold"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                Window {index + 1}: Orientation - {window.orientation}, Area -{" "}
                {window.area} ft²
              </Box>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemoveWindow(index)}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Box>
      )}

      <h1 className="font-semibold text-2xl">Door Dimensions</h1>

      {doors.length < 4 && (
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
          <FormControl fullWidth variant="outlined" sx={{ flex: 1 }}>
            <InputLabel>Orientation</InputLabel>
            <Select
              label="Orientation"
              value={newDoorOrientation}
              onChange={(e) => setNewDoorOrientation(e.target.value)}
              displayEmpty
            >
              {getDoorOrientations().map((direction) => (
                <MenuItem key={direction} value={direction}>
                  {direction}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Door Area (ft²)"
            variant="outlined"
            fullWidth
            sx={{ flex: 1 }}
            value={newDoorArea}
            onChange={(e) => setNewDoorArea(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddDoor}>
            Add
          </Button>
        </Box>
      )}
      {doors.length >= 4 && (
        <Box>
          <p>Maximum of 4 doors can be added.</p>
        </Box>
      )}

      {/* Display the added doors */}
      {doors.length > 0 && (
        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          {doors.map((door, index) => (
            <Box
              key={index}
              p={2}
              width="100%"
              textAlign="center"
              bgcolor="lightblue"
              borderRadius={2}
              fontWeight="bold"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                Door {index + 1}: Orientation - {door.orientation}, Area -{" "}
                {door.area} ft²
              </Box>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemoveDoor(index)}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default FloorPlan;
