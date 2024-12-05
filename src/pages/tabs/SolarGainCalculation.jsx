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

// Define the angle pbytwo in radians
const pbytwo = 0.785;

// Precompute sine values
const sin_pbytwo = Math.sin(pbytwo);
const sin_pbytwo_sq = Math.pow(sin_pbytwo, 2);
const sin_pbytwo_cub = Math.pow(sin_pbytwo, 3);

// Function to calculate A, B, C for a given set of k-values
const calculateABC = (k) => {
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

  // Calculate ABC values
  const ABC_table = useMemo(() => {
    return Object.keys(Orientation_k_values).map((orientation) => {
      const kValues = Orientation_k_values[orientation];
      const { A, B, C } = calculateABC(kValues);
      return {
        Orientation: orientation,
        A: A,
        B: B,
        C: C,
      };
    });
  }, []);

  // Calculate Phi values for the selected city
  const phiValues = useMemo(() => {
    const City_phi = {};

    if (!selectedCity) return City_phi;

    const latitude = City_latitude[selectedCity];
    City_phi[selectedCity] = {};

    for (const month in Solar_declination) {
      const declination = Solar_declination[month];
      const phi_degrees = latitude - declination;
      const phi_radians = degreesToRadians(phi_degrees);
      City_phi[selectedCity][month] = phi_radians;
    }

    return City_phi;
  }, [selectedCity]);

  // Calculate Rhnic values for the selected city
  const rhnicValues = useMemo(() => {
    const rhnic = {};

    if (!selectedCity) return rhnic;

    rhnic[selectedCity] = {};

    ABC_table.forEach(({ Orientation, A, B, C }) => {
      rhnic[selectedCity][Orientation] = {};

      for (const month in phiValues[selectedCity]) {
        const phi = phiValues[selectedCity][month];
        const cos_phi = Math.cos(phi);
        const rhnicCalc = A * Math.pow(cos_phi, 2) + B * cos_phi + C;
        rhnic[selectedCity][Orientation][month] = rhnicCalc;
      }
    });

    return rhnic;
  }, [ABC_table, phiValues, selectedCity]);

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

      {/* Phi Values Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Phi Values (in radians) for {selectedCity}
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
                Phi (radians)
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
                  {phiValues[selectedCity][month].toFixed(5)}
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
    </Box>
  );
};

export default SolarGainCalculation;
