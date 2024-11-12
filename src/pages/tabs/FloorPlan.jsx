// File: FloorPlan.jsx

import {
  Box,
  MenuItem,
  TextField,
  Select,
  Button,
  InputLabel,
  FormControl,
  Typography,
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
  calculateTotalWallArea,
  calculateTotalWindowArea,
  calculateTotalDoorArea,
  calculateNetWallArea,
  calculateTotalArea,
} from "../../calculations/FloorPlanCal/FloorPlanCalculation";
import PropTypes from "prop-types";

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
    dwellingVolume,
    setDwellingVolume,
    sidesConnected,
    setSidesConnected,
    totalWallArea,
    setTotalWallArea,
    totalWindowArea,
    setTotalWindowArea,
    totalDoorArea,
    setTotalDoorArea,
    netWallArea,
    setNetWallArea,
    totalArea,
    setTotalArea,
    windows,
    setWindows,
    doors,
    setDoors,
    totalFloorArea,
    setTotalFloorArea,
  } = useFloorPlanStore();

  const [newWindowOrientation, setNewWindowOrientation] = useState("");
  const [newWindowArea, setNewWindowArea] = useState("");

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

  const convertSqFtToSqM = (areaInSqFt) => areaInSqFt * 0.092903;
  const convertCubicFtToCubicM = (volumeInCubicFt) =>
    volumeInCubicFt * 0.0283168;

  useEffect(() => {
    const wallLabels = getWallInputs(
      buildingOrientation,
      OrientationSingleWindow,
      OrientationDoubleWindow
    );

    const area = calculateArea(wallLengths, wallLabels) || 0;
    setTotalFloorArea(area);

    const volume =
      calculateDwellingVolume(area, wallHeight, numberOfFloors) || 0;
    setDwellingVolume(volume);

    const totalWallAreaValue =
      calculateTotalWallArea(wallLengths, wallLabels, wallHeight) || 0;
    setTotalWallArea(totalWallAreaValue);

    const totalWindowAreaValue = calculateTotalWindowArea(windows) || 0;
    setTotalWindowArea(totalWindowAreaValue);

    const totalDoorAreaValue = calculateTotalDoorArea(doors) || 0;
    setTotalDoorArea(totalDoorAreaValue);

    const netWallAreaValue =
      calculateNetWallArea(
        totalWallAreaValue,
        totalWindowAreaValue,
        totalDoorAreaValue
      ) || 0;
    setNetWallArea(netWallAreaValue);

    const totalAreaValue =
      calculateTotalArea(
        area,
        netWallAreaValue, // Updated to use netWallAreaValue
        totalWindowAreaValue,
        totalDoorAreaValue
      ) || 0;
    setTotalArea(totalAreaValue);
  }, [
    wallLengths,
    buildingOrientation,
    wallHeight,
    numberOfFloors,
    windows,
    doors,
    setTotalFloorArea,
    setDwellingVolume,
    setTotalWallArea,
    setTotalWindowArea,
    setTotalDoorArea,
    setNetWallArea,
    setTotalArea,
  ]);

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

  function DisplayArea({ label, areaInSqFt }) {
    const areaInSqM = convertSqFtToSqM(areaInSqFt);
    return (
      <Box mb={2}>
        <Typography
          variant="h6"
          sx={{
            backgroundColor: "lightblue",
            padding: "8px",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
          }}
        >
          {typeof areaInSqFt === "number" && !isNaN(areaInSqFt)
            ? `${areaInSqFt.toFixed(2)} ft² [${areaInSqM.toFixed(2)} m²]`
            : "N/A"}
        </Typography>
      </Box>
    );
  }

  function DisplayVolume({ label, volumeInCubicFt }) {
    const volumeInCubicM = convertCubicFtToCubicM(volumeInCubicFt);
    return (
      <Box mb={2}>
        <Typography
          variant="h6"
          sx={{
            backgroundColor: "lightblue",
            padding: "8px",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
          }}
        >
          {typeof volumeInCubicFt === "number" && !isNaN(volumeInCubicFt)
            ? `${volumeInCubicFt.toFixed(2)} ft³ [${volumeInCubicM.toFixed(
                2
              )} m³]`
            : "N/A"}
        </Typography>
      </Box>
    );
  }

  DisplayArea.propTypes = {
    label: PropTypes.string.isRequired,
    areaInSqFt: PropTypes.number.isRequired,
  };

  DisplayVolume.propTypes = {
    label: PropTypes.string.isRequired,
    volumeInCubicFt: PropTypes.number.isRequired,
  };

  return (
    <Box p={3} display="flex" gap={2} overflow="hidden">
      {/* Left side - 70% width */}
      <Box display="flex" flexDirection="column" gap={2} width="70%">
        {/* Input Fields */}
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
              onChange={(e) => setNumberOfFloors(parseInt(e.target.value))}
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
                      [label]: parseFloat(e.target.value) || "",
                    })
                  }
                  type="number"
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
                onChange={(e) =>
                  setWallHeight(parseFloat(e.target.value) || "")
                }
                type="number"
              />
              <FormControl fullWidth variant="outlined" sx={{ flex: 1 }}>
                <InputLabel>
                  No. of Sides Connected to Other Building
                </InputLabel>
                <Select
                  label="No. of Sides Connected to Other Building"
                  value={sidesConnected}
                  onChange={(e) =>
                    setSidesConnected(parseInt(e.target.value))
                  }
                >
                  {[0, 1, 2, 3].map((side) => (
                    <MenuItem key={side} value={side}>
                      {side}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              type="number"
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
              type="number"
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

      {/* Right side - 30% width */}
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        width="30%"
        borderLeft="1px solid grey"
        pl={2}
      >
        <h1
          className="font-semibold text-2xl text-center"
          style={{
            padding: "8px",
            borderRadius: "4px",
          }}
        >
          Calculated Values
        </h1>
        <DisplayArea label="Roof Area" areaInSqFt={totalFloorArea} />
        <DisplayArea label="Floor Area" areaInSqFt={totalFloorArea} />
        <DisplayArea label="Wall Area" areaInSqFt={totalWallArea} />
        <DisplayArea label="Door Area" areaInSqFt={totalDoorArea} />
        <DisplayArea label="Window Area" areaInSqFt={totalWindowArea} />
        <DisplayArea label="Net Wall Area" areaInSqFt={netWallArea} />
        <DisplayArea label="Total Area (Σ)" areaInSqFt={totalArea} />
        <DisplayVolume
          label="Dwelling Volume"
          volumeInCubicFt={dwellingVolume}
        />
      </Box>
    </Box>
  );
}

export default FloorPlan;
