
import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from '@mui/material';

import { DoorType } from '../../../utils/DoorLayerData.js';

import {
  calculateRValue,
  calculateRTotal,
  calculateUValue,
} from '../../../calculations/FabricDetailCal/DoorCalculation.js';

import useDoorFabricDetailsStore from '../../../store/useDoorFabricDetailsStore.js';
import useFloorPlanStore from '../../../store/useFloorPlanStore.js';

function DoorFabricDetails() {
  const {
    doorMaterial,
    setDoorMaterial,
    doorThickness,
    setDoorThickness,
    uValue,
    setUValue,
  } = useDoorFabricDetailsStore();

  const { totalDoorArea } = useFloorPlanStore();

  // Default values for hi and ho
  const hi = 2.5;
  const ho = 11.54;

  // Memoized layers and rValues
  const { layers, rValues } = useMemo(() => {
    const layersArray = [];
    const rValuesArray = [];

    // Helper function to process the door layer
    const processDoorLayer = (material, thickness) => {
      if (material && thickness !== '') {
        const thicknessValue = parseFloat(thickness);
        const kValue = material.k_value;
        const rValue = calculateRValue(thicknessValue, kValue);
        layersArray.push({
          material: material.name,
          thickness: thicknessValue,
          kValue: kValue,
          rValue: rValue.toFixed(4),
        });
        rValuesArray.push(parseFloat(rValue.toFixed(4)));
      }
    };

    // Process the door layer
    processDoorLayer(doorMaterial, doorThickness);

    return { layers: layersArray, rValues: rValuesArray };
  }, [doorMaterial, doorThickness]);

  // State variables for rTotal, calculationError, and UA
  const [rTotal, setRTotal] = useState(null);
  const [calculationError, setCalculationError] = useState(null);
  const [uaValue, setUaValue] = useState(null);

  // Calculate rTotal and U-value if there are layers
  useEffect(() => {
    if (layers.length > 0) {
      try {
        const totalRValue = calculateRTotal(rValues, hi, ho).toFixed(4);
        const calculatedUValue = calculateUValue(totalRValue).toFixed(3);
        setRTotal(totalRValue);
        setCalculationError(null);

        // Set uValue in the store
        setUValue(calculatedUValue);

        // Convert totalDoorArea from ft² to m²
        const areaInFt2 = parseFloat(totalDoorArea) || 0;
        const areaInM2 = areaInFt2 * 0.092903; // 1 ft² = 0.092903 m²

        // Calculate UA
        const ua = (calculatedUValue * areaInM2).toFixed(3);
        setUaValue(ua);
      } catch (error) {
        setCalculationError(error.message);
        setRTotal(null);
        setUValue(null); // Clear uValue in the store on error
        setUaValue(null);
      }
    } else {
      setRTotal(null);
      setCalculationError(null);
      setUValue(null); // Clear uValue in the store when no layers
      setUaValue(null);
    }
  }, [layers, rValues, hi, ho, setUValue, totalDoorArea]);

  return (
    <Box p={3} display="flex" flexDirection="row" gap={2}>
      {/* Inputs Section */}
      <Box width="80%" display="flex" flexDirection="column" gap={2}>
        {/* Door Type Input */}
        <Box display="flex" gap={2} alignItems="center">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Door Type</InputLabel>
            <Select
              label="Door Type"
              value={doorMaterial ? doorMaterial.name : ''}
              onChange={(e) => {
                const selectedMaterial = DoorType.find(
                  (material) => material.name === e.target.value
                );
                setDoorMaterial(selectedMaterial);
                if (selectedMaterial && selectedMaterial.name === 'None') {
                  setDoorThickness('0');
                } else {
                  setDoorThickness('');
                }
              }}
            >
              {DoorType.map((material) => (
                <MenuItem key={material.name} value={material.name}>
                  {material.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Door Thickness (inches)"
            variant="outlined"
            fullWidth
            value={doorThickness}
            onChange={(e) => setDoorThickness(e.target.value)}
            disabled={doorMaterial && doorMaterial.name === 'None'}
          />
        </Box>

        {/* Calculation Error Display */}
        {calculationError && (
          <Box
            p={2}
            mt={2}
            bgcolor="lightcoral"
            borderRadius={2}
            fontWeight="bold"
            textAlign="center"
          >
            Error: {calculationError}
          </Box>
        )}

        {/* Display the layers in a table */}
        {layers.length > 0 && (
          <Table sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: 'lightblue',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  Serial Number
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: 'lightblue',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  Material Selected
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: 'lightblue',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  Thickness (inches)
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: 'lightblue',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  K-Value
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: 'lightblue',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  R-Value
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {layers.map((layer, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: 'center' }}>{index + 1}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {layer.material}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {layer.thickness}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {layer.kValue}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {layer.rValue}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      {/* Divider */}
      <Divider orientation="vertical" flexItem />

      {/* Calculations Section */}
      <Box width="20%" display="flex" flexDirection="column" gap={2}>
        {/* R-Total Display */}
        {rTotal && !calculationError && (
          <Box
            p={2}
            mt={2}
            bgcolor="lightblue"
            borderRadius={2}
            fontWeight="bold"
            textAlign="center"
          >
           R-Value: {rTotal}
          </Box>
        )}

        {/* U-Value Display */}
        {uValue && !calculationError && (
          <Box
            p={2}
            mt={2}
            bgcolor="lightblue"
            borderRadius={2}
            fontWeight="bold"
            textAlign="center"
          >
            U-Value: {uValue}
          </Box>
        )}

        {/* UA Display */}
        {uaValue && !calculationError && (
          <Box
            p={2}
            mt={2}
            bgcolor="lightgreen"
            borderRadius={2}
            fontWeight="bold"
            textAlign="center"
          >
            UA: {uaValue} 
            {/* [{(parseFloat(totalDoorArea) * 0.092903).toFixed(2)} m²] */}
          </Box>
        )}

        {/* Door Area Display */}
        <Box
          p={2}
          mt={2}
          bgcolor="lightblue"
          borderRadius={2}
          fontWeight="bold"
          textAlign="center"
        >
       Door Area: {(parseFloat(totalDoorArea) * 0.092903).toFixed(2) || 'N/A'}
        </Box>
      </Box>
    </Box>
  );
}

export default DoorFabricDetails;
