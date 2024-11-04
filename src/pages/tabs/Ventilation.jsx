import { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
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
} from "../../calculations/VentilationCal/VentilationCalculation.js";

import useFloorPlanStore from "../../store/useFloorPlanStore.js";

function Ventilation() {
  // State variables
  const [numberOfFans, setNumberOfFans] = useState("");
  const [constructionType, setConstructionType] = useState("");
  const [lobbyType, setLobbyType] = useState("");
  const [percentageDraughtProofed, setPercentageDraughtProofed] = useState("");

  // Get dwellingVolume, numberOfFloors, and sidesConnected from the store
  const { dwellingVolume, numberOfFloors, sidesConnected } =
    useFloorPlanStore();

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

    // Calculate Shelter Factor
    if (sidesConnected !== null && sidesConnected !== undefined) {
      shelterFactor = calculateShelterFactor(sidesConnected);
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
            Dwelling Volume (m³): {dwellingVolumeM3}
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
            ACH: {ACH}
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
            Additional Infiltration: {additionalInfiltration}
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
            Window Infiltration: {windowInfiltration}
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
      </Box>
    </Box>
  );
}

export default Ventilation;
