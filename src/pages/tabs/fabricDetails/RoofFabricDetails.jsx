import{ useState, useEffect, useMemo } from 'react';
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

import {
  OuterLayer,
  CoreLayer,
  InsulationLayer,
  InnerLayer,
} from '../../../utils/RoofLayerData.js';

import {
  calculateRValue,
  calculateRTotal,
  calculateUValue,
} from '../../../calculations/FabricDetailCal/RoofCalculation.js';

import useRoofFabricDetailsStore from '../../../store/useRoofFabricDetailsStore.js';
import useFloorPlanStore from '../../../store/useFloorPlanStore.js';

function RoofFabricDetails() {
  const {
    outerLayerMaterial,
    setOuterLayerMaterial,
    outerLayerThickness,
    setOuterLayerThickness,
    coreLayerMaterial,
    setCoreLayerMaterial,
    coreLayerThickness,
    setCoreLayerThickness,
    insulationLayerMaterial,
    setInsulationLayerMaterial,
    insulationLayerThickness,
    setInsulationLayerThickness,
    innerLayerMaterial,
    setInnerLayerMaterial,
    innerLayerThickness,
    setInnerLayerThickness,
    uValue,
    setUValue,
  } = useRoofFabricDetailsStore();

  const { totalFloorArea } = useFloorPlanStore();

  // Default values for hi and ho.
  const hi = 2.5;
  const ho = 11.54;

  // Memoized layers and rValues
  const { layers, rValues } = useMemo(() => {
    const layersArray = [];
    const rValuesArray = [];

    // Helper function to process each layer
    const processLayer = (layerMaterial, layerThickness, layerType) => {
      if (layerMaterial && layerThickness !== '') {
        const thickness = parseFloat(layerThickness);
        const kValue = layerMaterial.k_value;
        const rValue = calculateRValue(thickness, kValue);
        layersArray.push({
          type: layerType,
          material: layerMaterial.name,
          thickness: thickness,
          rValue: rValue.toFixed(4),
        });
        rValuesArray.push(parseFloat(rValue.toFixed(4)));
      }
    };

    // Process each layer
    processLayer(outerLayerMaterial, outerLayerThickness, 'Outer Layer');
    processLayer(coreLayerMaterial, coreLayerThickness, 'Core Layer');
    processLayer(
      insulationLayerMaterial,
      insulationLayerThickness,
      'Insulation Layer'
    );
    processLayer(innerLayerMaterial, innerLayerThickness, 'Inner Layer');

    return { layers: layersArray, rValues: rValuesArray };
  }, [
    outerLayerMaterial,
    outerLayerThickness,
    coreLayerMaterial,
    coreLayerThickness,
    insulationLayerMaterial,
    insulationLayerThickness,
    innerLayerMaterial,
    innerLayerThickness,
  ]);

  // State variables for rTotal, calculationError, and UA
  const [rTotal, setRTotal] = useState(null);
  const [calculationError, setCalculationError] = useState(null);
  const [uaValue, setUaValue] = useState(null);

  // useEffect to calculate rTotal and uValue when layers change
  useEffect(() => {
    if (layers.length > 0) {
      try {
        const totalRValue = calculateRTotal(rValues, hi, ho).toFixed(4);
        const calculatedUValue = calculateUValue(totalRValue).toFixed(3);
        setRTotal(totalRValue);
        setCalculationError(null);

        // Set uValue in the store
        setUValue(calculatedUValue);

        // Convert totalFloorArea from ft² to m²
        const areaInFt2 = parseFloat(totalFloorArea) || 0;
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
  }, [layers, rValues, hi, ho, setUValue, totalFloorArea]);

  return (
    <Box p={3} display="flex" flexDirection="row" gap={2}>
      {/* Inputs Section */}
      <Box width="80%" display="flex" flexDirection="column" gap={2}>
        {/* Outer Layer Inputs */}
        <Box display="flex" gap={2} alignItems="center">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Outer Layer</InputLabel>
            <Select
              label="Outer Layer"
              value={outerLayerMaterial ? outerLayerMaterial.name : ''}
              onChange={(e) => {
                const selectedMaterial = OuterLayer.find(
                  (material) => material.name === e.target.value
                );
                setOuterLayerMaterial(selectedMaterial);
                if (selectedMaterial && selectedMaterial.name === 'None') {
                  setOuterLayerThickness('0');
                } else {
                  setOuterLayerThickness('');
                }
              }}
            >
              {OuterLayer.map((material) => (
                <MenuItem key={material.name} value={material.name}>
                  {material.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Outer Layer Thickness (inches)"
            variant="outlined"
            fullWidth
            value={outerLayerThickness}
            onChange={(e) => setOuterLayerThickness(e.target.value)}
            disabled={outerLayerMaterial && outerLayerMaterial.name === 'None'}
          />
        </Box>

        {/* Core Layer Inputs */}
        <Box display="flex" gap={2} alignItems="center">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Core Layer</InputLabel>
            <Select
              label="Core Layer"
              value={coreLayerMaterial ? coreLayerMaterial.name : ''}
              onChange={(e) => {
                const selectedMaterial = CoreLayer.find(
                  (material) => material.name === e.target.value
                );
                setCoreLayerMaterial(selectedMaterial);
                if (selectedMaterial && selectedMaterial.name === 'None') {
                  setCoreLayerThickness('0');
                } else {
                  setCoreLayerThickness('');
                }
              }}
            >
              {CoreLayer.map((material) => (
                <MenuItem key={material.name} value={material.name}>
                  {material.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Core Layer Thickness (inches)"
            variant="outlined"
            fullWidth
            value={coreLayerThickness}
            onChange={(e) => setCoreLayerThickness(e.target.value)}
            disabled={coreLayerMaterial && coreLayerMaterial.name === 'None'}
          />
        </Box>

        {/* Insulation Layer Inputs */}
        <Box display="flex" gap={2} alignItems="center">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Insulation Layer</InputLabel>
            <Select
              label="Insulation Layer"
              value={
                insulationLayerMaterial ? insulationLayerMaterial.name : ''
              }
              onChange={(e) => {
                const selectedMaterial = InsulationLayer.find(
                  (material) => material.name === e.target.value
                );
                setInsulationLayerMaterial(selectedMaterial);
                if (selectedMaterial && selectedMaterial.name === 'None') {
                  setInsulationLayerThickness('0');
                } else {
                  setInsulationLayerThickness('');
                }
              }}
            >
              {InsulationLayer.map((material) => (
                <MenuItem key={material.name} value={material.name}>
                  {material.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Insulation Layer Thickness (inches)"
            variant="outlined"
            fullWidth
            value={insulationLayerThickness}
            onChange={(e) => setInsulationLayerThickness(e.target.value)}
            disabled={
              insulationLayerMaterial &&
              insulationLayerMaterial.name === 'None'
            }
          />
        </Box>

        {/* Inner Layer Inputs */}
        <Box display="flex" gap={2} alignItems="center">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Inner Layer</InputLabel>
            <Select
              label="Inner Layer"
              value={innerLayerMaterial ? innerLayerMaterial.name : ''}
              onChange={(e) => {
                const selectedMaterial = InnerLayer.find(
                  (material) => material.name === e.target.value
                );
                setInnerLayerMaterial(selectedMaterial);
                if (selectedMaterial && selectedMaterial.name === 'None') {
                  setInnerLayerThickness('0');
                } else {
                  setInnerLayerThickness('');
                }
              }}
            >
              {InnerLayer.map((material) => (
                <MenuItem key={material.name} value={material.name}>
                  {material.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Inner Layer Thickness (inches)"
            variant="outlined"
            fullWidth
            value={innerLayerThickness}
            onChange={(e) => setInnerLayerThickness(e.target.value)}
            disabled={innerLayerMaterial && innerLayerMaterial.name === 'None'}
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
                  Layer Type
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
                  R-Value
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {layers.map((layer, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: 'center' }}>{index + 1}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{layer.type}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {layer.material}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {layer.thickness}
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
        {/* rTotal Display */}
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

        {/* U-value Display */}
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
            
          </Box>
        )}

        {/* Roof Area Display */}
        <Box
          p={2}
          mt={2}
          bgcolor="lightblue"
          borderRadius={2}
          fontWeight="bold"
          textAlign="center"
        >
          Roof Area: {(parseFloat(totalFloorArea) * 0.092903).toFixed(2) || 'N/A'} m²
        </Box>
      </Box>
    </Box>
  );
}

export default RoofFabricDetails;
