import { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import useBuildingInformationStore from "../../store/useBuildingInformationStore";

// Import temperature data
import IslamabadTemperature from "../../utils/temperature/IslamabadTemperature.json";
import MultanTemperature from "../../utils/temperature/MultanTemperature.json";
import KarachiTemperature from "../../utils/temperature/KarachiTemperature.json";
import LahoreTemperature from "../../utils/temperature/LahoreTemperature.json";
import PeshawarTemperature from "../../utils/temperature/PeshawarTemperature.json";

const monthFactors = {
  1: 924.36,
  2: 925.43,
  3: 925.05,
  4: 925.09,
  5: 927.15,
  6: 925.43,
  7: 926.15,
  8: 923.95,
  9: 922.95,
  10: 924.36,
  11: 925.13,
  12: 924.0,
};

const gammaCoolValues = {
  1: 424.4,
  2: 470.24,
  3: 556.5,
  4: 658.07,
  5: 676.12,
  6: 709.76,
  7: 635.17,
  8: 588.43,
  9: 536.17,
  10: 492.28,
  11: 441.31,
  12: 398.67,
};

const gammaHeatValues = {
  1: 564.84,
  2: 595.77,
  3: 653.95,
  4: 797.17,
  5: 811.38,
  6: 837.87,
  7: 779.13,
  8: 742.32,
  9: 701.15,
  10: 610.58,
  11: 576.23,
  12: 547.5,
};

const aValues = {
  1: 2.17486,
  2: 2.17342,
  3: 2.17394,
  4: 2.17388,
  5: 2.17111,
  6: 2.17342,
  7: 2.17246,
  8: 2.17542,
  9: 2.17677,
  10: 2.17486,
  11: 2.17383,
  12: 2.17481,
};

// Utility function to get temperature data based on city name
const getTemperatureData = (city) => {
  switch (city) {
    case "Islamabad":
      return IslamabadTemperature;
    case "Multan":
      return MultanTemperature;
    case "Karachi":
      return KarachiTemperature;
    case "Lahore":
      return LahoreTemperature;
    case "Peshawar":
      return PeshawarTemperature;
    default:
      return [];
  }
};

const SheetCalculation = () => {
  const selectedCity = useBuildingInformationStore(
    (state) => state.selectedCity
  );
  const [calculationResults, setCalculationResults] = useState([]);

  useEffect(() => {
    if (selectedCity) {
      const cityData = getTemperatureData(selectedCity);
      const results = cityData.map((entry) => {
        const factor = monthFactors[entry.MO];
        const gammaCool = gammaCoolValues[entry.MO];
        const gammaHeat = gammaHeatValues[entry.MO];
        const a = aValues[entry.MO];

        const calculation = (24 - entry.T2M) * factor;

        // Calculate y values
        const yCooling = gammaCool / calculation;
        const yHeating = gammaHeat / calculation;

        // Calculate n-cooling
        let nCooling;
        if (yCooling > 0 && yCooling !== 1) {
          nCooling =
            (1 - Math.pow(yCooling, -a)) / (1 - Math.pow(yCooling, -(a + 1)));
        } else if (yCooling === 1) {
          nCooling = a / (a + 1);
        } else {
          nCooling = 1;
        }

        // Calculate n-heating
        let nHeating;
        if (yHeating > 0 && yHeating !== 1) {
          nHeating =
            (1 - Math.pow(yHeating, a)) / (1 - Math.pow(yHeating, a + 1));
        } else if (yHeating === 1) {
          nHeating = a / (a + 1);
        } else {
          nHeating = 1;
        }

        // Calculate cooling nxlm
        const coolingNxlm = nCooling * calculation;

        // Calculate heating nxgm
        const heatingNxgm = gammaHeat * nHeating;

        // Calculation: heatingLoad
        const heatingLoad = calculation - heatingNxgm;

        // Calculation: coolingLoad
        const coolingLoad = gammaCool - coolingNxlm;

        return {
          MO: entry.MO,
          DY: entry.DY,
          HR: entry.HR,
          T2M: entry.T2M,
          Calculation: parseFloat(calculation.toFixed(2)),
          "Gamma-cool": parseFloat(yCooling.toFixed(5)),
          "Gamma-heat": parseFloat(yHeating.toFixed(5)),
          "n-cooling": parseFloat(nCooling.toFixed(5)),
          "n-heating": parseFloat(nHeating.toFixed(5)),
          "cooling nxlm": parseFloat(coolingNxlm.toFixed(5)),
          "heating nxgm": parseFloat(heatingNxgm.toFixed(5)),
          "heating load": parseFloat(heatingLoad.toFixed(5)),
          "cooling load": parseFloat(coolingLoad.toFixed(5)),
        };
      });

      setCalculationResults(results);
    } else {
      setCalculationResults([]);
    }
  }, [selectedCity]);

  // Split the results into first 10 and last 2
  const first10 = calculationResults.slice(0, 10);
  const last2 = calculationResults.slice(-2);

  return (
    <Box p={3}>
      {selectedCity ? (
        <>
          <Typography variant="h5" gutterBottom>
            Calculations for {selectedCity}
          </Typography>
          <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>MO</TableCell>
                  <TableCell>DY</TableCell>
                  <TableCell>HR</TableCell>
                  <TableCell>T2M</TableCell>
                  <TableCell>Calculation</TableCell>
                  <TableCell>Gamma-cool</TableCell>
                  <TableCell>Gamma-heat</TableCell>
                  <TableCell>n-cooling</TableCell>
                  <TableCell>n-heating</TableCell>
                  <TableCell>Cooling nxlm</TableCell>
                  <TableCell>Heating nxgm</TableCell>
                  <TableCell>Heating Load</TableCell>
                  <TableCell>Cooling Load</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {first10.map((row, index) => (
                  <TableRow key={`first-${index}`}>
                    <TableCell>{row.MO}</TableCell>
                    <TableCell>{row.DY}</TableCell>
                    <TableCell>{row.HR}</TableCell>
                    <TableCell>{row.T2M}</TableCell>
                    <TableCell>{row.Calculation}</TableCell>
                    <TableCell>{row["Gamma-cool"]}</TableCell>
                    <TableCell>{row["Gamma-heat"]}</TableCell>
                    <TableCell>{row["n-cooling"]}</TableCell>
                    <TableCell>{row["n-heating"]}</TableCell>
                    <TableCell>{row["cooling nxlm"]}</TableCell>
                    <TableCell>{row["heating nxgm"]}</TableCell>
                    <TableCell>{row["heating load"]}</TableCell>
                    <TableCell>{row["cooling load"]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>MO</TableCell>
                  <TableCell>DY</TableCell>
                  <TableCell>HR</TableCell>
                  <TableCell>T2M</TableCell>
                  <TableCell>Calculation</TableCell>
                  <TableCell>Gamma-cool</TableCell>
                  <TableCell>Gamma-heat</TableCell>
                  <TableCell>n-cooling</TableCell>
                  <TableCell>n-heating</TableCell>
                  <TableCell>Cooling nxlm</TableCell>
                  <TableCell>Heating nxgm</TableCell>
                  <TableCell>Heating Load</TableCell>
                  <TableCell>Cooling Load</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {last2.map((row, index) => (
                  <TableRow key={`last-${index}`}>
                    <TableCell>{row.MO}</TableCell>
                    <TableCell>{row.DY}</TableCell>
                    <TableCell>{row.HR}</TableCell>
                    <TableCell>{row.T2M}</TableCell>
                    <TableCell>{row.Calculation}</TableCell>
                    <TableCell>{row["Gamma-cool"]}</TableCell>
                    <TableCell>{row["Gamma-heat"]}</TableCell>
                    <TableCell>{row["n-cooling"]}</TableCell>
                    <TableCell>{row["n-heating"]}</TableCell>
                    <TableCell>{row["cooling nxlm"]}</TableCell>
                    <TableCell>{row["heating nxgm"]}</TableCell>
                    <TableCell>{row["heating load"]}</TableCell>
                    <TableCell>{row["cooling load"]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography variant="h6">
          Please select a city to view calculations.
        </Typography>
      )}
    </Box>
  );
};

export default SheetCalculation;
