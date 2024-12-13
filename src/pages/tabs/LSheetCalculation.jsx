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
import useFloorPlanStore from "../../store/useFloorPlanStore";
import useHlpStore from "../../store/useHlpStore";
import useSolarGainStore from "../../store/useSolarGainStore";

// Import the LSheetStore
import useLSheetStore from "../../store/useLSheetStore";

// Import temperature data
import IslamabadTemperature from "../../utils/temperature/IslamabadTemperature.json";
import MultanTemperature from "../../utils/temperature/MultanTemperature.json";
import KarachiTemperature from "../../utils/temperature/KarachiTemperature.json";
import LahoreTemperature from "../../utils/temperature/LahoreTemperature.json";
import PeshawarTemperature from "../../utils/temperature/PeshawarTemperature.json";

// Constants for aValues
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

// Utility function to get month name from month number
const getMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString("default", { month: "long" });
};

const SheetCalculation = () => {
  // State from stores
  const setTemperatureStr = useFloorPlanStore((state) => state.setTemperature);
  const setTemperature = parseFloat(setTemperatureStr) || 24;
  const selectedCity = useBuildingInformationStore((state) => state.selectedCity);
  const heatTransferCoefficient = useHlpStore((state) => state.heatTransferCoefficient);
  const solarGainWatt = useSolarGainStore((state) => state.solarGainWatt);
  const totalGainWatt = useSolarGainStore((state) => state.totalGainWatt);

  // Local states
  const [calculationResults, setCalculationResults] = useState([]);
  const [hasAlerted, setHasAlerted] = useState(false);

  // Define the divisor
  const DIVISOR = 3000;

  // Subscribe to the store's state for reactive updates
  const monthlyCoolingLoads = useLSheetStore((state) => state.monthlyCoolingLoads);
  const monthlyHeatingLoads = useLSheetStore((state) => state.monthlyHeatingLoads);

  // Access actions from LSheetStore
  const setMonthlyCoolingLoads = useLSheetStore((state) => state.setMonthlyCoolingLoads);
  const setMonthlyHeatingLoads = useLSheetStore((state) => state.setMonthlyHeatingLoads);
  const resetMonthlyCoolingLoads = useLSheetStore((state) => state.resetMonthlyCoolingLoads);
  const resetMonthlyHeatingLoads = useLSheetStore((state) => state.resetMonthlyHeatingLoads);

  useEffect(() => {
    if (
      selectedCity &&
      heatTransferCoefficient &&
      heatTransferCoefficient.length === 12 &&
      solarGainWatt.length === 12 &&
      totalGainWatt.length === 12
    ) {
      const cityData = getTemperatureData(selectedCity);

      // Compute calculation results for each hour
      const results = cityData.map((entry) => {
        const month = entry.MO;
        const factor = heatTransferCoefficient[month - 1];

        // gammaCool is taken from solarGainWatt array
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

      // Define the months for cooling and heating loads
      const coolingMonthsToSum = [4, 5, 6, 7, 8, 9]; // April to September
      const heatingMonthsToSum = [1, 2, 3, 10, 11, 12]; // January, February, March, October, November, December

      // Aggregate cooling loads for specified months
      const coolingSums = coolingMonthsToSum.map((month) => {
        const monthEntries = results.filter((r) => r.MO === month);
        const sum = monthEntries.reduce((acc, curr) => acc + curr["cooling load"], 0);
        const scaledSum = sum / DIVISOR; // Divide by 3000
        return {
          month: getMonthName(month),
          totalCoolingLoad: parseFloat(scaledSum.toFixed(2)),
        };
      });

      setMonthlyCoolingLoads(coolingSums);

      // Aggregate heating loads for specified months
      const heatingSums = heatingMonthsToSum.map((month) => {
        const monthEntries = results.filter((r) => r.MO === month);
        const sum = monthEntries.reduce((acc, curr) => acc + curr["heating load"], 0);
        const scaledSum = sum / DIVISOR; // Divide by 3000
        return {
          month: getMonthName(month),
          totalHeatingLoad: parseFloat(scaledSum.toFixed(2)),
        };
      });

      setMonthlyHeatingLoads(heatingSums);

      // Reset alert flag when data changes
      setHasAlerted(false);
    } else {
      setCalculationResults([]);
      setMonthlyCoolingLoads([]);
      setMonthlyHeatingLoads([]);
      // Optionally reset the store as well
      resetMonthlyCoolingLoads();
      resetMonthlyHeatingLoads();
    }
  }, [
    selectedCity,
    setTemperature,
    heatTransferCoefficient,
    solarGainWatt,
    totalGainWatt,
    setMonthlyCoolingLoads,
    setMonthlyHeatingLoads,
    resetMonthlyCoolingLoads,
    resetMonthlyHeatingLoads,
  ]);

  useEffect(() => {
    if (
      monthlyCoolingLoads.length > 0 &&
      monthlyHeatingLoads.length > 0 &&
      !hasAlerted
    ) {
      // Prepare cooling loads message
      const coolingMessage = monthlyCoolingLoads
        .map((cl) => `${cl.month}: ${cl.totalCoolingLoad}`)
        .join("\n");

      // Prepare heating loads message
      const heatingMessage = monthlyHeatingLoads
        .map((hl) => `${hl.month}: ${hl.totalHeatingLoad}`)
        .join("\n");

      // Combine both messages
      const combinedMessage = `Total Cooling Loads (April - September) divided by 3000:\n${coolingMessage}\n\nTotal Heating Loads (January, February, March, October, November, December) divided by 3000:\n${heatingMessage}`;

      // Display alert
      alert(combinedMessage);

      setHasAlerted(true);
    }
  }, [monthlyCoolingLoads, monthlyHeatingLoads, hasAlerted]);

  // Split the results into first 10 and last 2 for existing tables
  const first10 = calculationResults.slice(0, 10);
  const last2 = calculationResults.slice(-2);

  return (
    <Box p={3}>
      {selectedCity ? (
        <>
          <Typography variant="h5" gutterBottom>
            Calculations for {selectedCity}
          </Typography>

          {/* Existing Tables */}
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

          {/* New Section for Monthly Cooling Loads (April - September) */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Total Cooling Loads (April - September) divided by 3000
            </Typography>
            <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>Total Cooling Load</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthlyCoolingLoads.map((cl, index) => (
                    <TableRow key={`monthly-cooling-${index}`}>
                      <TableCell>{cl.month}</TableCell>
                      <TableCell>{cl.totalCoolingLoad.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* New Section for Monthly Heating Loads (January, February, March, October, November, December) */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Total Heating Loads (January, February, March, October, November, December) divided by 3000
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>Total Heating Load</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthlyHeatingLoads.map((hl, index) => (
                    <TableRow key={`monthly-heating-${index}`}>
                      <TableCell>{hl.month}</TableCell>
                      <TableCell>{hl.totalHeatingLoad.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
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
