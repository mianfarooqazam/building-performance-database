// AnnualEnergyDemand.js
import React from 'react';
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
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';
import useAppliancesLoadStore from '../../store/useAppliancesLoadStore.js';
import useLSheetStore from '../../store/useLSheetStore.js';

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

function AnnualEnergyDemand() {
  const { appliances, eui } = useAppliancesLoadStore();
  const { monthlyCoolingLoads, monthlyHeatingLoads } = useLSheetStore();

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

  // Define heating and cooling months
  const heatingMonths = ['January', 'February', 'March', 'October', 'November', 'December'];
  const coolingMonths = ['April', 'May', 'June', 'July', 'August', 'September'];

  // Prepare data for Bar Chart
  const barData = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Heating Load (kWh)',
        data: months.map(month => {
          const load = monthlyHeatingLoads.find(item => item.month === month);
          return heatingMonths.includes(month) && load ? load.totalHeatingLoad : 0;
        }),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Monthly Cooling Load (kWh)',
        data: months.map(month => {
          const load = monthlyCoolingLoads.find(item => item.month === month);
          return coolingMonths.includes(month) && load ? load.totalCoolingLoad : 0;
        }),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Energy Load (kWh)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
  };

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
      
      {/* Bar Chart Section */}
      <Box mt={4}>
        <Typography variant="h6" align="center" gutterBottom>
          Monthly Heating and Cooling Loads
        </Typography>
        <Bar data={barData} options={barOptions} />
      </Box>
    </Box>
  );
}

export default AnnualEnergyDemand;
