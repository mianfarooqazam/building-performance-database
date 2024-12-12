import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import useFloorPlanStore from '../../store/useFloorPlanStore';
import useWallFabricDetailsStore from '../../store/useWallFabricDetailsStore';
import useRoofFabricDetailsStore from '../../store/useRoofFabricDetailsStore';
import useVentilationStore from '../../store/useVentilationStore'; // Import the ventilation store

const HlpCalculation = () => {
  const ft2ToM2 = 0.092903;
  const ft3ToM3 = 0.0283168;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Extract data from Floor Plan Store
  const netWallAreaFt2 = parseFloat(useFloorPlanStore((state) => state.netWallArea)) || 0;
  const totalFloorAreaFt2 = parseFloat(useFloorPlanStore((state) => state.totalFloorArea)) || 0;
  const totalAreaFt2 = parseFloat(useFloorPlanStore((state) => state.totalArea)) || 0;
  const dwellingVolume = parseFloat(useFloorPlanStore((state) => state.dwellingVolume)) || 0;

  // Convert to m² and m³
  const netWallAreaM2 = netWallAreaFt2 * ft2ToM2;
  const totalFloorAreaM2 = totalFloorAreaFt2 * ft2ToM2;
  const totalAreaM2 = totalAreaFt2 * ft2ToM2;
  const dwellingVolumeM3 = dwellingVolume * ft3ToM3;

  // Extract data from Wall Fabric Details Store
  const kappaValueWall = parseFloat(useWallFabricDetailsStore((state) => state.kappaValue)) || 0;

  // Extract data from Roof Fabric Details Store
  const kappaValueRoof = parseFloat(useRoofFabricDetailsStore((state) => state.kappaValue)) || 0;
  const fabricHeatLossFromRoof = parseFloat(useRoofFabricDetailsStore((state) => state.totalFabricHeatLoss)) || 0;

  // Calculate Heat Capacity
  const heatCapacity =
    (netWallAreaM2 * kappaValueWall) + (totalFloorAreaM2 * kappaValueRoof);

  // Calculate Thermal Mass Parameter
  const thermalMassParameter =
    totalFloorAreaM2 !== 0 ? (heatCapacity / totalFloorAreaM2) : 0;

  // Calculate Thermal Bridges
  const thermalBridges = 0.2 * totalAreaM2;

  // Calculate Total Fabric Heat Loss
  const totalFabricHeatLossTotal =
    fabricHeatLossFromRoof + thermalBridges;

  // Data for the Fabric & Thermal table
  const calculationData = [
    { label: 'Fabric Heat Loss (Roof)', value: `${fabricHeatLossFromRoof.toFixed(2)} ` },
    { label: 'Heat Capacity', value: `${heatCapacity.toFixed(2)} ` },
    { label: 'Thermal Mass Parameter', value: `${thermalMassParameter.toFixed(2)} ` },
    { label: 'Thermal Bridges', value: `${thermalBridges.toFixed(2)} ` },
    { label: 'Total Fabric Heat Loss', value: `${totalFabricHeatLossTotal.toFixed(2)} ` },
  ];

  // Ventilation Heat Loss Calculations
  const finalInfiltrationRateArray = useVentilationStore((state) => state.finalInfiltrationRateArray);
  const ventilationType = useVentilationStore((state) => state.ventilationType);

  // Ensure that finalInfiltrationRateArray has 12 elements
  const infiltrationRates = Array.isArray(finalInfiltrationRateArray) ? finalInfiltrationRateArray : Array(12).fill(0);

  // Calculate Ventilation Heat Loss for Each Month
  const ventilationHeatLossData = months.map((month, index) => {
    const infiltrationRate = parseFloat(infiltrationRates[index]) || 0;
    const ventHeatLoss = 0.33 * dwellingVolumeM3 * infiltrationRate; // Heat Loss in Watts
    return {
      month,
      ventHeatLoss: ventHeatLoss,
    };
  });

  // Calculate Heat Transfer Coefficient (Monthly)
  // Heat Transfer Coefficient = Total Fabric Heat Loss + Ventilation Heat Loss (each month)
  const heatTransferCoefficientData = ventilationHeatLossData.map((row) => {
    const heatTransferCoefficient = totalFabricHeatLossTotal + row.ventHeatLoss;
    return {
      month: row.month,
      heatTransferCoefficient: heatTransferCoefficient,
      ventHeatLoss: row.ventHeatLoss,
    };
  });

  // Calculate Heat Loss Parameter (Monthly)
  const heatLossParameterData = heatTransferCoefficientData.map((row) => {
    const heatLossParameter = totalFloorAreaM2 !== 0 ? (row.heatTransferCoefficient / totalFloorAreaM2) : 0;
    return {
      month: row.month,
      ventHeatLoss: row.ventHeatLoss,
      heatTransferCoefficient: row.heatTransferCoefficient,
      heatLossParameter: heatLossParameter,
    };
  });

  // Calculate Averages
  const averageHeatTransferCoefficient = heatTransferCoefficientData.reduce((acc, curr) => acc + curr.heatTransferCoefficient, 0) / months.length;
  const averageHeatLossParameter = heatLossParameterData.reduce((acc, curr) => acc + curr.heatLossParameter, 0) / months.length;

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        HLP Calculations
      </Typography>
      
      {/* Fabric and Thermal Calculations Table */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table aria-label="calculation results">
          <TableHead>
            <TableRow>
              <TableCell><strong>Parameter</strong></TableCell>
              <TableCell><strong>Value</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calculationData.map((row) => (
              <TableRow key={row.label}>
                <TableCell>{row.label}</TableCell>
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Combined Ventilation Heat Loss, Heat Transfer Coefficient, and Heat Loss Parameter Table */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Monthly {ventilationType ? `(${ventilationType})` : ''}
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table aria-label="combined table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Month</strong></TableCell>
              <TableCell><strong>Ventilation Heat Loss </strong></TableCell>
              <TableCell><strong>Heat Transfer Coefficient </strong></TableCell>
              <TableCell><strong>Heat Loss Parameter </strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {heatLossParameterData.map((row) => (
              <TableRow key={row.month}>
                <TableCell>{row.month}</TableCell>
                <TableCell>{row.ventHeatLoss.toFixed(2)}</TableCell>
                <TableCell>{row.heatTransferCoefficient.toFixed(2)}</TableCell>
                <TableCell>{row.heatLossParameter.toFixed(4)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Averages Table */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Averages
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2, maxWidth: 600 }}>
        <Table aria-label="averages table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Parameter</strong></TableCell>
              <TableCell><strong>Average Value</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Average Heat Transfer Coefficient </TableCell>
              <TableCell>{averageHeatTransferCoefficient.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Average Heat Loss Parameter</TableCell>
              <TableCell>{averageHeatLossParameter.toFixed(4)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HlpCalculation;
