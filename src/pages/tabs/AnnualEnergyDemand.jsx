import {
  Box,
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
  const { appliances } = useAppliancesLoadStore();

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
      <Box
        p={2}
        mt={2}
        borderRadius={2}
        fontWeight="bold"
        textAlign="center"
      >
       Appliances Total Annual Energy: {totalAnnualEnergy.toFixed(2)} kWh
      </Box>
      
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
    
    </Box>
  );
}

export default AnnualEnergyDemand;
