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

  // Data for the table
  const calculationData = [
    { label: 'Fabric Heat Loss (Roof)', value: `${fabricHeatLossFromRoof.toFixed(2)} W` },
    { label: 'Heat Capacity', value: `${heatCapacity.toFixed(2)} J/K` },
    { label: 'Thermal Mass Parameter', value: `${thermalMassParameter.toFixed(2)} J/K/m²` },
    { label: 'Thermal Bridges', value: `${thermalBridges.toFixed(2)} W` },
    { label: 'Total Fabric Heat Loss', value: `${totalFabricHeatLossTotal.toFixed(2)} W` },
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
      ventHeatLoss: ventHeatLoss.toFixed(2),
    };
  });

  // Data for Ventilation Heat Loss Table
  const ventilationHeatLossCalculationData = ventilationHeatLossData.map((row) => ({
    label: `Ventilation Heat Loss (${row.month})`,
    value: `${row.ventHeatLoss} W`,
  }));

  return (
    <Box sx={{ backgroundColor: 'lightblue', padding: '20px' }}>
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

      {/* Ventilation Heat Loss Table */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Ventilation Heat Loss (Monthly) {ventilationType ? `(${ventilationType})` : ''}
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table aria-label="ventilation heat loss">
          <TableHead>
            <TableRow>
              <TableCell><strong>Month</strong></TableCell>
              <TableCell><strong>Ventilation Heat Loss (W)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventilationHeatLossCalculationData.map((row) => (
              <TableRow key={row.label}>
                <TableCell>{row.label.replace('Ventilation Heat Loss (', '').replace(')', '')}</TableCell>
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HlpCalculation;
