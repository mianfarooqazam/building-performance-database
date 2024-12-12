// HlpCalculation.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
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

  return (
    <Box sx={{ backgroundColor: 'lightblue', padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Fabric Heat Loss: {fabricHeatLossFromRoof.toFixed(2)} 
      </Typography>
      <Typography variant="h5" gutterBottom>
        Heat Capacity: {heatCapacity.toFixed(2)} 
      </Typography>
      <Typography variant="h5" gutterBottom>
        Thermal Mass Parameter: {thermalMassParameter.toFixed(2)}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Thermal Bridges: {thermalBridges.toFixed(2)} 
      </Typography>
      <Typography variant="h5" gutterBottom>
        Total Fabric Heat Loss: {totalFabricHeatLossTotal.toFixed(2)} 
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Store Values (Converted to m²):</Typography>
        <Typography>
          Net Wall Area: {netWallAreaFt2} ft² ({netWallAreaM2.toFixed(2)} m²)
        </Typography>
        <Typography>
          Total Floor Area: {totalFloorAreaFt2} ft² ({totalFloorAreaM2.toFixed(2)} m²)
        </Typography>
        <Typography>
          Total Area (Σ): {totalAreaFt2} ft² ({totalAreaM2.toFixed(2)} m²)
        </Typography>
        <Typography>Kappa Value (Wall): {kappaValueWall}</Typography>
        <Typography>Kappa Value (Roof): {kappaValueRoof}</Typography>
      </Box>
    </Box>
  );
};

export default HlpCalculation;
