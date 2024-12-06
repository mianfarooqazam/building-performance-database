// SolarGainCalculation.js
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

// Function to calculate A, B, C for a given set of k-values
const calculateABC = (k, sin_pbytwo, sin_pbytwo_sq, sin_pbytwo_cub) => {
  const A = k.k1 * sin_pbytwo_cub + k.k2 * sin_pbytwo_sq + k.k3 * sin_pbytwo;
  const B = k.k4 * sin_pbytwo_cub + k.k5 * sin_pbytwo_sq + k.k6 * sin_pbytwo;
  const C =
    k.k7 * sin_pbytwo_cub + k.k8 * sin_pbytwo_sq + k.k9 * sin_pbytwo + 1;
  return { A, B, C };
};

// Function to convert degrees to radians
const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

const SolarGainCalculation = () => {
  const selectedCity = useBuildingInformationStore(
    (state) => state.selectedCity
  );

  // Define the angle pbytwo in radians and precompute sine values
  const pbytwo = 0.785398;
  const sin_pbytwo = Math.sin(pbytwo);
  const sin_pbytwo_sq = Math.pow(sin_pbytwo, 2);
  const sin_pbytwo_cub = Math.pow(sin_pbytwo, 3);

  // Calculate ABC values
  const ABC_table = useMemo(() => {
    return Object.keys(Orientation_k_values).map((orientation) => {
      const kValues = Orientation_k_values[orientation];
      const { A, B, C } = calculateABC(
        kValues,
        sin_pbytwo,
        sin_pbytwo_sq,
        sin_pbytwo_cub
      );
      return {
        Orientation: orientation,
        A: A,
        B: B,
        C: C,
      };
    });
  }, [sin_pbytwo, sin_pbytwo_sq, sin_pbytwo_cub]);

  // Calculate Phi value for the selected city (fixed)
  const phiValue = useMemo(() => {
    if (!selectedCity) return null;
    const latitude = City_latitude[selectedCity];
    return degreesToRadians(latitude);
  }, [selectedCity]);

  // Calculate Solar Irradiance values for the selected city
  const solarIrradianceValues = useMemo(() => {
    const solarIrradiance = {};

    if (!selectedCity || phiValue === null) return solarIrradiance;

    solarIrradiance[selectedCity] = {};

    for (const month in Solar_declination) {
      solarIrradiance[selectedCity][month] =
        phiValue - Solar_declination[month];
    }

    return solarIrradiance;
  }, [selectedCity, phiValue]);

  // Calculate Rhnic values for the selected city
  const rhnicValues = useMemo(() => {
    const rhnic = {};

    if (!selectedCity || !solarIrradianceValues[selectedCity]) return rhnic;

    rhnic[selectedCity] = {};

    ABC_table.forEach(({ Orientation, A, B, C }) => {
      rhnic[selectedCity][Orientation] = {};

      for (const month in Solar_declination) {
        const solarIrradiance = solarIrradianceValues[selectedCity][month];
        const cosSolarIrradiance = Math.cos(solarIrradiance);
        const rhnicCalc =
          A * Math.pow(cosSolarIrradiance, 2) +
          B * cosSolarIrradiance +
          C;
        rhnic[selectedCity][Orientation][month] = rhnicCalc;
      }
    });

    return rhnic;
  }, [ABC_table, solarIrradianceValues, selectedCity]);

  // Calculate Sorient values for the selected city
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

  if (!selectedCity) {
    return (
      <Typography variant="h6" align="center">
        Please select a city from Building Information.
      </Typography>
    );
  }

  const months = Object.keys(City_solar_irradiance[selectedCity]);

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
                <TableCell align="right">{row.A.toFixed(5)}</TableCell>
                <TableCell align="right">{row.B.toFixed(5)}</TableCell>
                <TableCell align="right">{row.C.toFixed(5)}</TableCell>
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
                {phiValue.toFixed(5)}
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
                    {rhnicValues[selectedCity][orientation][month].toFixed(
                      8
                    )}
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
                    {sorientValues[selectedCity][orientation][month].toFixed(
                      5
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SolarGainCalculation;
