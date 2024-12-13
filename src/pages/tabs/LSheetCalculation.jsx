import  { useEffect, useState } from "react";
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
import useFloorPlanStore from "../../store/useFloorPlanStore"; 
import useHlpStore from "../../store/useHlpStore";
import useSolarGainStore from "../../store/useSolarGainStore";

// Import temperature data
import IslamabadTemperature from "../../utils/temperature/IslamabadTemperature.json";
import MultanTemperature from "../../utils/temperature/MultanTemperature.json";
import KarachiTemperature from "../../utils/temperature/KarachiTemperature.json";
import LahoreTemperature from "../../utils/temperature/LahoreTemperature.json";
import PeshawarTemperature from "../../utils/temperature/PeshawarTemperature.json";

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
  const setTemperatureStr = useFloorPlanStore((state) => state.setTemperature);
  const setTemperature = parseFloat(setTemperatureStr) || 24; 
  const selectedCity = useBuildingInformationStore((state) => state.selectedCity);
  const [calculationResults, setCalculationResults] = useState([]);

  const heatTransferCoefficient = useHlpStore((state) => state.heatTransferCoefficient);

  // Retrieve solarGainWatt and totalGainWatt from Solar Gain Store
  const solarGainWatt = useSolarGainStore((state) => state.solarGainWatt);
  const totalGainWatt = useSolarGainStore((state) => state.totalGainWatt);

  useEffect(() => {
    if (
      selectedCity &&
      heatTransferCoefficient &&
      heatTransferCoefficient.length === 12 &&
      solarGainWatt.length === 12 &&
      totalGainWatt.length === 12
    ) {
      const cityData = getTemperatureData(selectedCity);
      const results = cityData.map((entry) => {
        const month = entry.MO;
        const factor = heatTransferCoefficient[month - 1]; 

        // Now gammaCool is taken from solarGainWatt array
        const gammaCool = solarGainWatt[month - 1];

        // gammaHeat is taken from totalGainWatt array
        const gammaHeat = totalGainWatt[month - 1];

        const a = aValues[month];

        // Calculate using heatTransferCoefficient
        const calculation = (setTemperature - entry.T2M) * factor;

        const safeCalculation = calculation !== 0 ? calculation : 1;

        const yCooling = gammaCool / safeCalculation;
        const yHeating = gammaHeat / safeCalculation;

        let nCooling;
        if (yCooling > 0 && yCooling !== 1) {
          nCooling =
            (1 - Math.pow(yCooling, -a)) /
            (1 - Math.pow(yCooling, -(a + 1)));
        } else if (yCooling === 1) {
          nCooling = a / (a + 1);
        } else {
          nCooling = 1;
        }

        let nHeating;
        if (yHeating > 0 && yHeating !== 1) {
          nHeating =
            (1 - Math.pow(yHeating, a)) /
            (1 - Math.pow(yHeating, a + 1));
        } else if (yHeating === 1) {
          nHeating = a / (a + 1);
        } else {
          nHeating = 1;
        }

        const coolingNxlm = nCooling * calculation;
        const heatingNxgm = gammaHeat * nHeating;

        const heatingLoad = calculation - heatingNxgm;
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
  }, [selectedCity, setTemperature, heatTransferCoefficient, solarGainWatt, totalGainWatt]);

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
