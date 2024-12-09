
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import useAppliancesLoadStore from '../../store/useAppliancesLoadStore.js';

function AnnualEnergyDemand() {
  const { appliances, eui } = useAppliancesLoadStore();

  // Calculate total annual energy
  const totalAnnualEnergy = appliances.reduce(
    (total, item) => total + item.annualEnergy,
    0
  );

  // Calculate monthly energy
  const monthlyEnergy = (totalAnnualEnergy / 12).toFixed(2);

  // List of months
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <Box p={3}>
      {/* Table Heading */}
      <Typography variant="h6" align="center" gutterBottom>
        Appliances Annual Energy
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {months.map((month, index) => (
                <TableCell
                  key={index}
                  sx={{
                    backgroundColor: "lightblue",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {month}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {months.map((_, index) => (
                <TableCell
                  key={index}
                  sx={{ textAlign: "center" }}
                >
                  {monthlyEnergy}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        p={2}
        mt={2}
        bgcolor="lightblue"
        borderRadius={2}
        fontWeight="bold"
        textAlign="center"
      >
        Total Annual Energy Consumption: {totalAnnualEnergy.toFixed(2)} kWh
      </Box>
      {/* Display EUI */}
      <Box
        p={2}
        mt={2}
        bgcolor="lightgreen"
        borderRadius={2}
        fontWeight="bold"
        textAlign="center"
      >
        Energy Utilization Index (EUI): {eui} kWh/m²
      </Box>
    </Box>
  );
}

export default AnnualEnergyDemand;
