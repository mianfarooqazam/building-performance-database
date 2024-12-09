import {
  Box,
  MenuItem,
  TextField,
  Select,
  Button,
  InputLabel,
  FormControl,
  Typography,
  Modal,
  Checkbox,
  FormGroup,
  FormControlLabel,
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

    // Lighting variables
    numberOfOccupants,
    setNumberOfOccupants,
    numberOfLights,
    setNumberOfLights,
    setLights,
    lights,
    totalWattage,
    setTotalWattage,

    // Indoor Conditions variables
    setTemperature,
    setSetTemperature,
    hoursOfOperation,
    setHoursOfOperation,

    // New action for storing individual window dimensions
    setWindowDimension,
  } = useFloorPlanStore();

  const [newWindowOrientation, setNewWindowOrientation] = useState("");
  const [newWindowArea, setNewWindowArea] = useState("");

  const [newDoorOrientation, setNewDoorOrientation] = useState("");
  const [newDoorArea, setNewDoorArea] = useState("");

  const [openLightModal, setOpenLightModal] = useState(false);
  const [lightWattages, setLightWattages] = useState([]);

  // Indoor Conditions state
  const [openHourModal, setOpenHourModal] = useState(false);
  const [selectedHours, setSelectedHours] = useState([]);

  const timeSlots = [
    "12am - 1am",
    "1am - 2am",
    "2am - 3am",
    "3am - 4am",
    "4am - 5am",
    "5am - 6am",
    "6am - 7am",
    "7am - 8am",
    "8am - 9am",
    "9am - 10am",
    "10am - 11am",
    "11am - 12pm",
    "12pm - 1pm",
    "1pm - 2pm",
    "2pm - 3pm",
    "3pm - 4pm",
    "4pm - 5pm",
    "5pm - 6pm",
    "6pm - 7pm",
    "7pm - 8pm",
    "8pm - 9pm",
    "9pm - 10pm",
    "10pm - 11pm",
    "11pm - 12am",
  ];

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
        netWallAreaValue,
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

  // Reset total wattage when number of lights changes
  useEffect(() => {
    setTotalWattage(0);
    setLights([]);
    setLightWattages(new Array(numberOfLights || 0).fill(""));
  }, [numberOfLights, setTotalWattage, setLights]);

  const handleAddWindow = () => {
    if (windows.length < 4 && newWindowOrientation && newWindowArea) {
      const windowAreaValue = parseFloat(newWindowArea);
      setWindows([
        ...windows,
        {
          orientation: newWindowOrientation,
          area: windowAreaValue,
        },
      ]);
      // Store the individual window area by orientation
      setWindowDimension(newWindowOrientation, windowAreaValue);

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

  function DisplayTotalWattage({ label, wattage }) {
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
          {typeof wattage === "number" && !isNaN(wattage) && wattage > 0
            ? `${wattage.toFixed(2)} W`
            : "N/A"}
        </Typography>
      </Box>
    );
  }

  function DisplayHours({ label, hours }) {
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
          {hours} hour(s)
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

  DisplayTotalWattage.propTypes = {
    label: PropTypes.string.isRequired,
    wattage: PropTypes.number.isRequired,
  };

  DisplayHours.propTypes = {
    label: PropTypes.string.isRequired,
    hours: PropTypes.number.isRequired,
  };

  return (
    <Box p={3} display="flex" gap={2} overflow="hidden">
      {/* Left side - 70% width */}
      <Box display="flex" flexDirection="column" gap={2} width="70%">
        {/* Input Fields */}
        <h1 className="font-semibold text-2xl text-center">Wall Dimensions</h1>
        <Box display="flex" flexWrap="wrap" gap={2}>
          <FormControl fullWidth variant="outlined" sx={{ flex: 1 }}>
            <InputLabel>Building Orientation</InputLabel>
            <Select
              label="Building Orientation"
              value={buildingOrientation || ""}
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
              value={numberOfFloors !== null ? numberOfFloors : ""}
              onChange={(e) => {
                const value = e.target.value;
                setNumberOfFloors(value === "" ? "" : parseInt(value));
              }}
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
                  value={
                    wallLengths[label] !== undefined ? wallLengths[label] : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setWallLengths({
                      ...wallLengths,
                      [label]: value === "" ? "" : parseFloat(value),
                    });
                  }}
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
                value={wallHeight !== null ? wallHeight : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setWallHeight(value === "" ? "" : parseFloat(value));
                }}
                type="number"
              />
              <FormControl fullWidth variant="outlined" sx={{ flex: 1 }}>
                <InputLabel>
                  No. of Sides Connected to Other Building
                </InputLabel>
                <Select
                  label="No. of Sides Connected to Other Building"
                  value={sidesConnected !== null ? sidesConnected : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSidesConnected(value === "" ? "" : parseInt(value));
                  }}
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

        <h1 className="font-semibold text-2xl text-center">Window Dimensions</h1>

        {windows.length < 4 && (
          <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
            <FormControl fullWidth variant="outlined" sx={{ flex: 1 }}>
              <InputLabel>Orientation</InputLabel>
              <Select
                label="Orientation"
                value={newWindowOrientation || ""}
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
              value={newWindowArea || ""}
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

        <h1 className="font-semibold text-2xl text-center">Door Dimensions</h1>

        {doors.length < 4 && (
          <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
            <FormControl fullWidth variant="outlined" sx={{ flex: 1 }}>
              <InputLabel>Orientation</InputLabel>
              <Select
                label="Orientation"
                value={newDoorOrientation || ""}
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
              value={newDoorArea || ""}
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

        {/* Occupancy Section */}
        <h1 className="font-semibold text-2xl text-center">Occupancy</h1>

        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
          <TextField
            label="Number of Occupants"
            variant="outlined"
            fullWidth
            sx={{ flex: 1 }}
            value={numberOfOccupants !== null ? numberOfOccupants : ""}
            onChange={(e) => {
              const value = e.target.value;
              setNumberOfOccupants(value === "" ? "" : parseInt(value));
            }}
            type="number"
          />
        </Box>

        {/* Lighting Section */}
        <h1 className="font-semibold text-2xl text-center">Lighting</h1>

        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
          <TextField
            label="Number of Lights"
            variant="outlined"
            fullWidth
            sx={{ flex: 1 }}
            value={numberOfLights !== null ? numberOfLights : ""}
            onChange={(e) => {
              const value = e.target.value;
              const newNumberOfLights = value === "" ? "" : parseInt(value);
              setNumberOfLights(newNumberOfLights);
              // Reset total wattage and lights array
              setTotalWattage(0);
              setLights([]);
              setLightWattages(new Array(newNumberOfLights || 0).fill(""));
            }}
            type="number"
          />
          <Button
            variant="contained"
            onClick={() => {
              // Initialize lightWattages array
              setLightWattages(new Array(numberOfLights || 0).fill(""));
              setOpenLightModal(true);
            }}
            disabled={!numberOfLights || numberOfLights <= 0}
          >
            Add
          </Button>
        </Box>

        {/* Display the added lights */}
        {lights.length > 0 && (
          <Box mt={2} display="flex" flexDirection="column" gap={2}>
            {lights.map((light, index) => (
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
                  Light {index + 1}: {light.wattage} W
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    const updatedLights = lights.filter((_, i) => i !== index);
                    setLights(updatedLights);
                    const updatedTotalWattage = updatedLights.reduce(
                      (total, light) => total + light.wattage,
                      0
                    );
                    setTotalWattage(updatedTotalWattage);
                  }}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Box>
        )}

        {/* Lighting Modal */}
        <Modal open={openLightModal} onClose={() => setOpenLightModal(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: 500,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" component="h2">
              Enter Wattage for Each Light
            </Typography>
            <Box mt={2} display="flex" flexDirection="column" gap={2}>
              {lightWattages.map((wattage, index) => (
                <TextField
                  key={index}
                  label={`Light ${index + 1} Wattage (W)`}
                  variant="outlined"
                  fullWidth
                  value={wattage || ""}
                  onChange={(e) => {
                    const newWattages = [...lightWattages];
                    newWattages[index] = e.target.value;
                    setLightWattages(newWattages);
                  }}
                  type="number"
                />
              ))}
            </Box>

            <Button
              variant="contained"
              onClick={() => {
                // Update the lights array in the store
                const newLights = lightWattages.map((wattage) => ({
                  wattage: parseFloat(wattage) || 0,
                }));
                setLights(newLights);
                // Calculate total wattage
                const totalWattageValue = newLights.reduce(
                  (total, light) => total + light.wattage,
                  0
                );
                setTotalWattage(totalWattageValue);
                setOpenLightModal(false);
              }}
              sx={{ mt: 2 }}
            >
              Save
            </Button>
          </Box>
        </Modal>

        {/* Indoor Conditions Section */}
        <h1 className="font-semibold text-2xl text-center">Indoor Conditions</h1>

        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
          <TextField
            label="Set Temperature (°C)"
            variant="outlined"
            fullWidth
            sx={{ flex: 1 }}
            value={setTemperature !== null ? setTemperature : ""}
            onChange={(e) => {
              const value = e.target.value;
              setSetTemperature(value === "" ? "" : parseFloat(value));
            }}
            type="number"
          />
          <Button
            variant="contained"
            onClick={() => {
              setSelectedHours(
                Array.isArray(hoursOfOperation) ? hoursOfOperation : []
              );
              setOpenHourModal(true);
            }}
          >
            Hours of Operation
          </Button>
        </Box>

        <Modal open={openHourModal} onClose={() => setOpenHourModal(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: 500,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" component="h2">
              Select Hours of Operation
            </Typography>
            <FormGroup>
              {timeSlots.map((slot, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={
                        Array.isArray(selectedHours)
                          ? selectedHours.includes(slot)
                          : false
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedHours(
                            Array.isArray(selectedHours)
                              ? [...selectedHours, slot]
                              : [slot]
                          );
                        } else {
                          setSelectedHours(
                            Array.isArray(selectedHours)
                              ? selectedHours.filter((s) => s !== slot)
                              : []
                          );
                        }
                      }}
                    />
                  }
                  label={slot}
                />
              ))}
            </FormGroup>
            <Button
              variant="contained"
              onClick={() => {
                // Update the hoursOfOperation in the store
                setHoursOfOperation(selectedHours);
                setOpenHourModal(false);
              }}
              sx={{ mt: 2 }}
            >
              Save
            </Button>
          </Box>
        </Modal>
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
        <DisplayTotalWattage label="Total Wattage" wattage={totalWattage} />
        <DisplayHours
          label="Hours of Operation"
          hours={hoursOfOperation ? hoursOfOperation.length : 0}
        />
      </Box>
    </Box>
  );
}

export default FloorPlan;
