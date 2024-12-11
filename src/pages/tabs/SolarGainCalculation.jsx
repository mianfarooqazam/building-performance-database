import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import {
  Orientation_k_values,
  Solar_declination,
  City_latitude,
  City_solar_irradiance,
} from "../../utils/solargain/CitiesValues.js";
import useBuildingInformationStore from "../../store/useBuildingInformationStore";
import useWindowFabricDetailsStore from "../../store/useWindowFabricDetailsStore";
import useFloorPlanStore from "../../store/useFloorPlanStore";

const winterMonths = ["January", "February", "March", "October", "November", "December"];

const calculateABC = (k, sin_pbytwo, sin_pbytwo_sq, sin_pbytwo_cub) => {
  const A = k.k1 * sin_pbytwo_cub + k.k2 * sin_pbytwo_sq + k.k3 * sin_pbytwo;
  const B = k.k4 * sin_pbytwo_cub + k.k5 * sin_pbytwo_sq + k.k6 * sin_pbytwo;
  const C = k.k7 * sin_pbytwo_cub + k.k8 * sin_pbytwo_sq + k.k9 * sin_pbytwo + 1;
  return { A, B, C };
};

const SolarGainCalculation = () => {
  const selectedCity = useBuildingInformationStore((state) => state.selectedCity);

  const { selectedWindowType, selectedFrameType, selectedShadingCover } =
    useWindowFabricDetailsStore();

  const { windows: floorPlanWindows } = useFloorPlanStore();

  const pbytwo = 0.785398163; // pi/4
  const sin_pbytwo = Math.sin(pbytwo);
  const sin_pbytwo_sq = Math.pow(sin_pbytwo, 2);
  const sin_pbytwo_cub = Math.pow(sin_pbytwo, 3);

  // 1. Wrap daysInMonth in useMemo to stabilize its reference
  const daysInMonth = useMemo(() => ({
    January: 31,
    February: 28,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31,
  }), []);

  // 2. Retrieve EL (Total Wattage) from useFloorPlanStore
  const totalWattage = useFloorPlanStore((state) => Number(state.totalWattage) || 0);

  // 3. Retrieve numberOfOccupants from useFloorPlanStore
  const numberOfOccupants = useFloorPlanStore((state) => Number(state.numberOfOccupants) || 0);

  // 4. Calculate Metabolic and Cooking Gains
  const metabolicW = useMemo(() => 20 * numberOfOccupants, [numberOfOccupants]);
  const cookingW = useMemo(() => 35 + 7 * numberOfOccupants, [numberOfOccupants]);

  // Calculate ABC values for each orientation
  const ABC_table = useMemo(() => {
    return Object.keys(Orientation_k_values).map((orientation) => {
      const kValues = Orientation_k_values[orientation];
      const { A, B, C } = calculateABC(kValues, sin_pbytwo, sin_pbytwo_sq, sin_pbytwo_cub);
      return {
        Orientation: orientation,
        A: A,
        B: B,
        C: C,
      };
    });
  }, [sin_pbytwo, sin_pbytwo_sq, sin_pbytwo_cub]);

  // Get Phi value based on selected city
  const phiValue = useMemo(() => {
    if (!selectedCity) return null;
    const latitude = City_latitude[selectedCity];
    return latitude;
  }, [selectedCity]);

  // Calculate Solar Irradiance Values
  const solarIrradianceValues = useMemo(() => {
    const solarIrradiance = {};
    if (!selectedCity || phiValue === null) return solarIrradiance;

    solarIrradiance[selectedCity] = {};
    for (const month in Solar_declination) {
      solarIrradiance[selectedCity][month] = phiValue - Solar_declination[month];
    }
    return solarIrradiance;
  }, [selectedCity, phiValue]);

  // Calculate Rhnic Values
  const rhnicValues = useMemo(() => {
    const rhnic = {};
    if (!selectedCity || !solarIrradianceValues[selectedCity]) return rhnic;

    rhnic[selectedCity] = {};
    ABC_table.forEach(({ Orientation, A, B, C }) => {
      rhnic[selectedCity][Orientation] = {};
      for (const month in Solar_declination) {
        const solarIrradiance = solarIrradianceValues[selectedCity][month];
        const cosSolarIrradiance = Math.cos(solarIrradiance);
        const rhnicCalc = A * Math.pow(cosSolarIrradiance, 2) + B * cosSolarIrradiance + C;
        rhnic[selectedCity][Orientation][month] = rhnicCalc;
      }
    });
    return rhnic;
  }, [ABC_table, solarIrradianceValues, selectedCity]);

  // Calculate Sorient Values
  const sorientValues = useMemo(() => {
    const sorient = {};
    if (!selectedCity) return sorient;

    sorient[selectedCity] = {};
    ABC_table.forEach(({ Orientation }) => {
      sorient[selectedCity][Orientation] = {};
      for (const month in City_solar_irradiance[selectedCity]) {
        const irradiance = City_solar_irradiance[selectedCity][month];
        const rhnic = rhnicValues[selectedCity][Orientation][month];
        const sorientCalc = irradiance * rhnic;
        sorient[selectedCity][Orientation][month] = sorientCalc;
      }
    });
    return sorient;
  }, [ABC_table, rhnicValues, selectedCity]);

  // Calculate Solar Gain Values
  const solarGainValues = useMemo(() => {
    const solarGain = {};
    if (!selectedCity || !sorientValues[selectedCity]) return solarGain;

    solarGain[selectedCity] = {};

    ABC_table.forEach(({ Orientation }) => {
      // Find the corresponding window for this orientation
      const windowData = floorPlanWindows.find((w) => w.orientation === Orientation);
      if (!windowData) {
        // If no window for this orientation, skip this orientation entirely
        return;
      }

      const windowAreaInMeters = windowData.areaInMeters || 0;

      solarGain[selectedCity][Orientation] = {};
      for (const month in sorientValues[selectedCity][Orientation]) {
        const sorient = sorientValues[selectedCity][Orientation][month];

        const isWinter = winterMonths.includes(month);
        const shadingValue = selectedShadingCover
          ? isWinter
            ? selectedShadingCover.values.winter
            : selectedShadingCover.values.summer
          : 1.0;

        const shgc = selectedWindowType ? selectedWindowType.shgc : 0.75;
        const frameFactor = selectedFrameType ? selectedFrameType.frame_factor : 0.80;

        // Use window area in meters instead of 1.67
        const factor = windowAreaInMeters * shadingValue * shgc * frameFactor * 0.9;

        solarGain[selectedCity][Orientation][month] = factor * sorient;
      }
    });

    return solarGain;
  }, [
    ABC_table,
    sorientValues,
    selectedCity,
    selectedWindowType,
    selectedFrameType,
    selectedShadingCover,
    floorPlanWindows,
  ]);

  // Get list of months
  const months = useMemo(() => {
    if (!selectedCity) return [];
    return Object.keys(City_solar_irradiance[selectedCity]);
  }, [selectedCity]);

  // Filter orientations to only those that have windows (so we only display those orientations)
  const orientationsWithWindows = useMemo(() => {
    if (!selectedCity) return [];
    return Object.keys(solarGainValues[selectedCity] || {});
  }, [solarGainValues, selectedCity]);

  // Calculate totals across orientations for each month
  const monthlyTotals = useMemo(() => {
    const totals = {};
    months.forEach((month) => {
      totals[month] = orientationsWithWindows.reduce((acc, orientation) => {
        return acc + (solarGainValues[selectedCity][orientation][month] || 0);
      }, 0);
    });
    return totals;
  }, [months, orientationsWithWindows, solarGainValues, selectedCity]);

  // Calculate E(kWh) for each month
  const E_kWh_values = useMemo(() => {
    const E_kWh = {};
    if (!selectedCity) return E_kWh;

    E_kWh[selectedCity] = {};
    months.forEach((month, index) => {
      const EL = totalWattage; 
      const monthIndex = index + 1; 
      const angle = (6.28 * (monthIndex - 0.2)) ; 
      const radian = (angle * ( 3.14/180)); 
      const divideby12 = (radian) / 12; 
      const cosValue = Math.cos(divideby12);

      const nm = daysInMonth[month] || 30;
      const E = (EL * (1 + 0.5 * cosValue) * nm) / 365;
      E_kWh[selectedCity][month] = E;
    });
    return E_kWh;
  }, [months, totalWattage, selectedCity, daysInMonth]);

  // 3. Calculate Lighting Gains for each month
  const lightingGains = useMemo(() => {
    const lg = {};
    if (!selectedCity) return lg;

    lg[selectedCity] = {};
    months.forEach((month) => {
      const E_kWh = E_kWh_values[selectedCity][month] || 0;
      const nm = daysInMonth[month] || 30;
      const lightingGain = (E_kWh * 0.85 * 1000) / (24 * nm);
      lg[selectedCity][month] = lightingGain;
    });
    return lg;
  }, [months, E_kWh_values, selectedCity, daysInMonth]);

  // 4. Calculate Total Internal Gains for each month
  const totalInternalGains = useMemo(() => {
    const totals = {};
    if (!selectedCity) return totals;

    months.forEach((month) => {
      const lighting = lightingGains[selectedCity][month] || 0;
      totals[month] = lighting + metabolicW + cookingW;
    });
    return totals;
  }, [months, lightingGains, selectedCity, metabolicW, cookingW]);

  // 5. Calculate Total Gain (Watt) for each month
  const totalGainWatt = useMemo(() => {
    const totals = {};
    months.forEach((month) => {
      const internalGain = totalInternalGains[month] || 0;
      const solarGain = monthlyTotals[month] || 0;
      totals[month] = internalGain + solarGain;
    });
    return totals;
  }, [months, totalInternalGains, monthlyTotals]);

  if (!selectedCity) {
    return (
      <Typography variant="h6" align="center">
        Please select a city from Building Information.
      </Typography>
    );
  }

  return (
    <Box>
      {/* ABC Values Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          ABC Values
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }}
              >
                Orientation
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }}
                align="right"
              >
                A
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }}
                align="right"
              >
                B
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }}
                align="right"
              >
                C
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ABC_table.map((row) => (
              <TableRow key={row.Orientation}>
                <TableCell component="th" scope="row">
                  {row.Orientation}
                </TableCell>
                <TableCell align="right">{row.A.toFixed(2)}</TableCell>
                <TableCell align="right">{row.B.toFixed(2)}</TableCell>
                <TableCell align="right">{row.C.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phi Value Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Phi Value (in radians) for {selectedCity}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }}
              >
                Phi (radians)
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }}
              >
                {phiValue !== null ? phiValue.toFixed(5) : "N/A"}
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      {/* Solar Irradiance Values Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Solar Irradiance for {selectedCity}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }}
              >
                Month
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }}
              >
                Solar Irradiance (radians)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {months.map((month) => (
              <TableRow key={month}>
                <TableCell component="th" scope="row">
                  {month}
                </TableCell>
                <TableCell align="right">
                  {solarIrradianceValues[selectedCity][month].toFixed(5)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Rhnic Values Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Rhnic Values for {selectedCity}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }}
              >
                Orientation
              </TableCell>
              {months.map((month) => (
                <TableCell
                  key={month}
                  align="right"
                  sx={{
                    backgroundColor: "lightblue",
                    fontWeight: "bold",
                  }}
                >
                  {month}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(rhnicValues[selectedCity]).map((orientation) => (
              <TableRow key={orientation}>
                <TableCell component="th" scope="row">
                  {orientation}
                </TableCell>
                {months.map((month) => (
                  <TableCell key={month} align="right">
                    {rhnicValues[selectedCity][orientation][month].toFixed(8)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Sorient Values Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Sorient Values for {selectedCity}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }}
              >
                Orientation
              </TableCell>
              {months.map((month) => (
                <TableCell
                  key={month}
                  align="right"
                  sx={{
                    backgroundColor: "lightblue",
                    fontWeight: "bold",
                  }}
                >
                  {month}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(sorientValues[selectedCity]).map((orientation) => (
              <TableRow key={orientation}>
                <TableCell component="th" scope="row">
                  {orientation}
                </TableCell>
                {months.map((month) => (
                  <TableCell key={month} align="right">
                    {sorientValues[selectedCity][orientation][month].toFixed(5)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Solar Gain Table (Only orientations with windows) */}
      {orientationsWithWindows.length > 0 && (
        <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Solar Gain (Watts) for {selectedCity} (Only Orientations with Windows)
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: "lightblue",
                    fontWeight: "bold",
                  }}
                >
                  Orientation
                </TableCell>
                {months.map((month) => (
                  <TableCell
                    key={month}
                    align="right"
                    sx={{
                      backgroundColor: "lightblue",
                      fontWeight: "bold",
                    }}
                  >
                    {month}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {orientationsWithWindows.map((orientation) => {
                const solarGainData = solarGainValues[selectedCity][orientation];
                return (
                  <TableRow key={orientation}>
                    <TableCell component="th" scope="row">
                      {orientation}
                    </TableCell>
                    {months.map((month) => (
                      <TableCell key={month} align="right">
                        {solarGainData[month].toFixed(5)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {/* Total Row */}
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                  Solar Gain (Watt)
                </TableCell>
                {months.map((month) => (
                  <TableCell key={month} align="right" sx={{ fontWeight: "bold" }}>
                    {monthlyTotals[month].toFixed(5)}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* New Table: Total Gains (Watt) with Lighting gains, Metabolic, Cooking, Total Internal Gain, and Total Gain */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Total Gains (Watt) for {selectedCity}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }}
              >
                Month
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }}
              >
                E(kWh)
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }}
              >
                Lighting Gains (W)
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }}
              >
                Metabolic (W)
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }}
              >
                Cooking (W)
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }}
              >
                Total Internal Gain (W)
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }}
              >
                Total Gain (Watt)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {months.map((month) => (
              <TableRow key={month}>
                <TableCell component="th" scope="row">
                  {month}
                </TableCell>
                <TableCell align="right">
                  {E_kWh_values[selectedCity][month]
                    ? E_kWh_values[selectedCity][month].toFixed(5)
                    : "0.00000"}
                </TableCell>
                <TableCell align="right">
                  {lightingGains[selectedCity][month]
                    ? lightingGains[selectedCity][month].toFixed(2)
                    : "0.00"}
                </TableCell>
                <TableCell align="right">
                  {metabolicW.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {cookingW.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {totalInternalGains[month]
                    ? totalInternalGains[month].toFixed(2)
                    : "0.00"}
                </TableCell>
                <TableCell align="right">
                  {totalGainWatt[month]
                    ? totalGainWatt[month].toFixed(2)
                    : "0.00"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SolarGainCalculation;
