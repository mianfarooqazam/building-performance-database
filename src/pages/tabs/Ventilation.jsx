// Ventilation.jsx
import { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

import {
  calculateM3PerHr,
  calculateACH,
  calculateAdditionalInfiltration,
  constructionTypeValue,
  lobbyTypeValue,
  calculateWindowInfiltration,
  calculateInfiltrationRate,
  calculateShelterFactor,
  calculateWindFactor,
  calculateAdjustedInfiltrationRate,
} from "../../calculations/VentilationCal/VentilationCalculation.js";

import useFloorPlanStore from "../../store/useFloorPlanStore.js";
import useBuildingInformationStore from "../../store/useBuildingInformationStore";

// Import wind data JSON files
import IslamabadWind from "../../utils/wind/IslamabadWind.json";
import KarachiWind from "../../utils/wind/KarachiWind.json";
import LahoreWind from "../../utils/wind/LahoreWind.json";
import MultanWind from "../../utils/wind/MultanWind.json";
import PeshawarWind from "../../utils/wind/PeshawarWind.json";

function Ventilation() {
  // State variables
  const [numberOfFans, setNumberOfFans] = useState("");
  const [constructionType, setConstructionType] = useState("");
  const [lobbyType, setLobbyType] = useState("");
  const [percentageDraughtProofed, setPercentageDraughtProofed] = useState("");

  // Get dwellingVolume, numberOfFloors, and sidesConnected from the store
  const { dwellingVolume, numberOfFloors, sidesConnected } =
    useFloorPlanStore();

  // Get selectedCity from the building information store
  const { selectedCity } = useBuildingInformationStore();

  // Mapping of cities to wind data
  const windData = {
    Islamabad: IslamabadWind,
    Karachi: KarachiWind,
    Lahore: LahoreWind,
    Multan: MultanWind,
    Peshawar: PeshawarWind,
  };

  // Retrieve wind data for the selected city
  const cityWindData = selectedCity ? windData[selectedCity] : null;

  // Calculations
  let m3PerHr = null;
  let ACH = null;
  let additionalInfiltration = null;
  let constructionValue = null;
  let lobbyValue = null;
  let windowInfiltration = null;
  let infiltrationRate = null;
  let dwellingVolumeM3 = null;
  let shelterFactor = null;
  let infiltrationRateWithShelterFactor = null;
  let windFactor = null;
  let adjustedInfiltrationRate = null;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  try {
    // Convert dwelling volume from ft³ to m³
    if (dwellingVolume) {
      dwellingVolumeM3 = dwellingVolume * 0.0283168;
    }

    if (numberOfFans !== "" && parseFloat(numberOfFans) >= 2) {
      m3PerHr = calculateM3PerHr(parseFloat(numberOfFans));

      if (dwellingVolumeM3 && dwellingVolumeM3 !== 0) {
        ACH = calculateACH(m3PerHr, dwellingVolumeM3);
      }
    }

    if (numberOfFloors) {
      additionalInfiltration = calculateAdditionalInfiltration(
        parseFloat(numberOfFloors)
      );
    }

    if (constructionType) {
      constructionValue = constructionTypeValue(constructionType);
    }

    if (lobbyType) {
      lobbyValue = lobbyTypeValue(lobbyType);
    }

    if (percentageDraughtProofed !== "") {
      windowInfiltration = calculateWindowInfiltration(
        parseFloat(percentageDraughtProofed)
      );
    }

    if (
      ACH !== null &&
      additionalInfiltration !== null &&
      constructionValue !== null &&
      lobbyValue !== null &&
      windowInfiltration !== null
    ) {
      infiltrationRate = calculateInfiltrationRate(
        ACH,
        additionalInfiltration,
        constructionValue,
        lobbyValue,
        windowInfiltration
      );
    }

    // Calculate Shelter Factor
    if (sidesConnected !== null && sidesConnected !== undefined) {
      shelterFactor = calculateShelterFactor(sidesConnected);
    }

    // Calculate Infiltration Rate Incorporating Shelter Factor
    if (infiltrationRate !== null && shelterFactor !== null) {
      infiltrationRateWithShelterFactor = infiltrationRate * shelterFactor;
    }

    // Calculate Wind Factor
    if (cityWindData) {
      // Extract wind data values in the order of months
      const windDataArray = months.map((month) => cityWindData[month]);

      windFactor = calculateWindFactor(windDataArray);
    }

    // Calculate Adjusted Infiltration Rate
    if (windFactor && infiltrationRateWithShelterFactor !== null) {
      adjustedInfiltrationRate = calculateAdjustedInfiltrationRate(
        windFactor,
        infiltrationRateWithShelterFactor
      );
    }
  } catch (error) {
    console.error(error.message);
  }

  return (
    <Box p={3}>
      {/* Inputs Side by Side */}
      <Grid container spacing={2}>
        {/* Number of Intermittent Fans Input */}
        <Grid item xs={6}>
          <TextField
            label="Number of Intermittent Fans"
            variant="outlined"
            fullWidth
            value={numberOfFans}
            onChange={(e) => setNumberOfFans(e.target.value)}
            type="number"
            inputProps={{ min: 2 }}
            error={numberOfFans !== "" && parseFloat(numberOfFans) < 2}
            helperText={
              numberOfFans !== "" && parseFloat(numberOfFans) < 2
                ? "Minimum number of intermittent fans required are 2"
                : ""
            }
          />
        </Grid>

        {/* Construction Type Input */}
        <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Construction Type</InputLabel>
            <Select
              label="Construction Type"
              value={constructionType}
              onChange={(e) => setConstructionType(e.target.value)}
            >
              <MenuItem value="masonry">Masonry</MenuItem>
              <MenuItem value="steel">Steel</MenuItem>
              <MenuItem value="timber">Timber</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Lobby Type Input */}
        <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Lobby Type</InputLabel>
            <Select
              label="Lobby Type"
              value={lobbyType}
              onChange={(e) => setLobbyType(e.target.value)}
            >
              <MenuItem value="No draught">No Draught</MenuItem>
              <MenuItem value="Draught">Draught</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Percentage of Windows/Doors Draught Proofed */}
        <Grid item xs={6}>
          <TextField
            label="Percentage of Windows/Doors Draught Proofed (%)"
            variant="outlined"
            fullWidth
            value={percentageDraughtProofed}
            onChange={(e) => setPercentageDraughtProofed(e.target.value)}
            type="number"
            inputProps={{ min: 0, max: 100 }}
          />
        </Grid>
      </Grid>

      {/* Blue Background Values Below Inputs */}
      <Box mt={4}>
        {/* Display Ventilation Rate (m³/hr) */}
        {m3PerHr !== null && (
          <Box
            p={2}
            mt={2}
            bgcolor="lightblue"
            borderRadius={2}
            fontWeight="bold"
            textAlign="center"
          >
            Ventilation Rate (m³/hr): {m3PerHr}
          </Box>
        )}

        {/* Display Dwelling Volume in m³ */}
        {dwellingVolumeM3 !== null && (
          <Box
            p={2}
            mt={2}
            bgcolor="lightblue"
            borderRadius={2}
            fontWeight="bold"
            textAlign="center"
          >
            Dwelling Volume (m³): {dwellingVolumeM3.toFixed(2)}
          </Box>
        )}

        {/* Display ACH */}
        {ACH !== null && (
          <Box
            p={2}
            mt={2}
            bgcolor="lightblue"
            borderRadius={2}
            fontWeight="bold"
            textAlign="center"
          >
            ACH: {ACH.toFixed(4)}
          </Box>
        )}

        {/* Display Additional Infiltration */}
        {additionalInfiltration !== null && (
          <Box
            p={2}
            mt={2}
            bgcolor="lightblue"
            borderRadius={2}
            fontWeight="bold"
            textAlign="center"
          >
            Additional Infiltration: {additionalInfiltration.toFixed(4)}
          </Box>
        )}

        {/* Display Window Infiltration */}
        {windowInfiltration !== null && (
          <Box
            p={2}
            mt={2}
            bgcolor="lightblue"
            borderRadius={2}
            fontWeight="bold"
            textAlign="center"
          >
            Window Infiltration: {windowInfiltration.toFixed(4)}
          </Box>
        )}

        {/* Display Infiltration Rate */}
        {infiltrationRate !== null && (
          <Box
            p={2}
            mt={2}
            bgcolor="lightblue"
            borderRadius={2}
            fontWeight="bold"
            textAlign="center"
          >
            Infiltration Rate: {infiltrationRate.toFixed(4)}
          </Box>
        )}

        {/* Display Shelter Factor */}
        {shelterFactor !== null && (
          <Box
            p={2}
            mt={2}
            bgcolor="lightblue"
            borderRadius={2}
            fontWeight="bold"
            textAlign="center"
          >
            Shelter Factor: {shelterFactor.toFixed(2)}
          </Box>
        )}

        {/* Display Infiltration Rate Incorporating Shelter Factor */}
        {infiltrationRateWithShelterFactor !== null && (
          <Box
            p={2}
            mt={2}
            bgcolor="lightblue"
            borderRadius={2}
            fontWeight="bold"
            textAlign="center"
          >
            Infiltration Rate Incorporating Shelter Factor:{" "}
            {infiltrationRateWithShelterFactor.toFixed(4)}
          </Box>
        )}
      </Box>

      {/* Display Wind Data and Calculations */}
      {cityWindData && (
  <Box mt={4}>
    <Typography variant="h6" gutterBottom textAlign="center" fontWeight="bold">
      Wind Data and Calculations
    </Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead style={{ backgroundColor: "#add8e6" }}> {/* Light blue background */}
          <TableRow>
            <TableCell align="center" style={{ fontWeight: "bold" }}>Month</TableCell>
            <TableCell align="center" style={{ fontWeight: "bold" }}>Selected City Wind Data</TableCell>
            <TableCell align="center" style={{ fontWeight: "bold" }}>Wind Factor</TableCell>
            <TableCell align="center" style={{ fontWeight: "bold" }}>Adjusted Infiltration Rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {months.map((month, index) => {
            const windValue = cityWindData[month];
            const windFactorValue = windFactor ? windFactor[index] : null;
            const adjustedInfiltrationValue = adjustedInfiltrationRate
              ? adjustedInfiltrationRate[index]
              : null;

            return (
              <TableRow key={month}>
                <TableCell align="center">{month}</TableCell>
                <TableCell align="center">{windValue !== undefined ? windValue : "-"}</TableCell>
                <TableCell align="center">
                  {windFactorValue !== null ? windFactorValue.toFixed(2) : "-"}
                </TableCell>
                <TableCell align="center">
                  {adjustedInfiltrationValue !== null
                    ? adjustedInfiltrationValue.toFixed(2)
                    : "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
)}

    </Box>
  );
}

export default Ventilation;
