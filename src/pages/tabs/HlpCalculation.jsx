import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import useFloorPlanStore from '../../store/useFloorPlanStore';
import useWallFabricDetailsStore from '../../store/useWallFabricDetailsStore';
import useRoofFabricDetailsStore from '../../store/useRoofFabricDetailsStore';

const HlpCalculation = () => {
  const ft2ToM2 = 0.092903;

  // Extract data from Floor Plan Store
  const netWallAreaFt2 = useFloorPlanStore((state) => state.netWallArea);
  const totalFloorAreaFt2 = useFloorPlanStore((state) => state.totalFloorArea);
  const totalAreaFt2 = useFloorPlanStore((state) => state.totalArea);

  // Convert to m²
  const netWallAreaM2 = parseFloat(netWallAreaFt2) * ft2ToM2 || 0;
  const totalFloorAreaM2 = parseFloat(totalFloorAreaFt2) * ft2ToM2 || 0;
  const totalAreaM2 = parseFloat(totalAreaFt2) * ft2ToM2 || 0;

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
    { label: 'Fabric Heat Loss (Roof)', value: `${fabricHeatLossFromRoof.toFixed(2)} ` },
    { label: 'Heat Capacity', value: `${heatCapacity.toFixed(2)} ` },
    { label: 'Thermal Mass Parameter', value: `${thermalMassParameter.toFixed(2)} ` },
    { label: 'Thermal Bridges', value: `${thermalBridges.toFixed(2)} ` },
    { label: 'Total Fabric Heat Loss', value: `${totalFabricHeatLossTotal.toFixed(2)} ` },
  ];

  return (
    <Box sx={{ backgroundColor: 'lightblue', padding: '20px' }}>
     
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
    </Box>
  );
};

export default HlpCalculation;
