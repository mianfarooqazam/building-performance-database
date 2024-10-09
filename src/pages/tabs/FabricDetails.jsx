import { useState } from 'react';
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
} from "@mui/material";

import {
  OuterLayer,
  CoreLayer,
  InsulationLayer,
  InnerLayer,
} from '../../utils/RoofLayerData.js';

import { calculateRValue } from '../../calculations/FabricDetailCal/RoofCalculation.js'; 

function FabricDetails() {
  // State variables for each layer's material and thickness
  const [outerLayerMaterial, setOuterLayerMaterial] = useState(null);
  const [outerLayerThickness, setOuterLayerThickness] = useState('');
  const [coreLayerMaterial, setCoreLayerMaterial] = useState(null);
  const [coreLayerThickness, setCoreLayerThickness] = useState('');
  const [insulationLayerMaterial, setInsulationLayerMaterial] = useState(null);
  const [insulationLayerThickness, setInsulationLayerThickness] = useState('');
  const [innerLayerMaterial, setInnerLayerMaterial] = useState(null);
  const [innerLayerThickness, setInnerLayerThickness] = useState('');

  // Collect layers that have both material and thickness specified
  const layers = [];

  if (outerLayerMaterial && outerLayerThickness) {
    const rValue = calculateRValue(parseFloat(outerLayerThickness), outerLayerMaterial.k_value);
    layers.push({
      type: 'Outer Layer',
      material: outerLayerMaterial.name,
      thickness: parseFloat(outerLayerThickness),
      rValue: rValue.toFixed(4),
    });
  }

  if (coreLayerMaterial && coreLayerThickness) {
    const rValue = calculateRValue(parseFloat(coreLayerThickness), coreLayerMaterial.k_value);
    layers.push({
      type: 'Core Layer',
      material: coreLayerMaterial.name,
      thickness: parseFloat(coreLayerThickness),
      rValue: rValue.toFixed(4),
    });
  }

  if (insulationLayerMaterial && insulationLayerThickness) {
    const rValue = calculateRValue(parseFloat(insulationLayerThickness), insulationLayerMaterial.k_value);
    layers.push({
      type: 'Insulation Layer',
      material: insulationLayerMaterial.name,
      thickness: parseFloat(insulationLayerThickness),
      rValue: rValue.toFixed(4),
    });
  }

  if (innerLayerMaterial && innerLayerThickness) {
    const rValue = calculateRValue(parseFloat(innerLayerThickness), innerLayerMaterial.k_value);
    layers.push({
      type: 'Inner Layer',
      material: innerLayerMaterial.name,
      thickness: parseFloat(innerLayerThickness),
      rValue: rValue.toFixed(4),
    });
  }

  return (
    <Box p={3} display="flex" flexDirection="column" gap={2}>
      <h1 className="font-semibold text-2xl">Roof Details</h1>

      {/* Outer Layer Inputs */}
      <Box display="flex" gap={2} alignItems="center">
        <FormControl fullWidth variant="outlined">
          <InputLabel>Outer Layer</InputLabel>
          <Select
            label="Outer Layer"
            value={outerLayerMaterial ? outerLayerMaterial.name : ''}
            onChange={(e) => {
              const selectedMaterial = OuterLayer.find(material => material.name === e.target.value);
              setOuterLayerMaterial(selectedMaterial);
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
          label="Thickness (inches)"
          variant="outlined"
          fullWidth
          value={outerLayerThickness}
          onChange={(e) => setOuterLayerThickness(e.target.value)}
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
              const selectedMaterial = CoreLayer.find(material => material.name === e.target.value);
              setCoreLayerMaterial(selectedMaterial);
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
          label="Thickness (inches)"
          variant="outlined"
          fullWidth
          value={coreLayerThickness}
          onChange={(e) => setCoreLayerThickness(e.target.value)}
        />
      </Box>

      {/* Insulation Layer Inputs */}
      <Box display="flex" gap={2} alignItems="center">
        <FormControl fullWidth variant="outlined">
          <InputLabel>Insulation Layer</InputLabel>
          <Select
            label="Insulation Layer"
            value={insulationLayerMaterial ? insulationLayerMaterial.name : ''}
            onChange={(e) => {
              const selectedMaterial = InsulationLayer.find(material => material.name === e.target.value);
              setInsulationLayerMaterial(selectedMaterial);
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
          label="Thickness (inches)"
          variant="outlined"
          fullWidth
          value={insulationLayerThickness}
          onChange={(e) => setInsulationLayerThickness(e.target.value)}
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
              const selectedMaterial = InnerLayer.find(material => material.name === e.target.value);
              setInnerLayerMaterial(selectedMaterial);
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
          label="Thickness (inches)"
          variant="outlined"
          fullWidth
          value={innerLayerThickness}
          onChange={(e) => setInnerLayerThickness(e.target.value)}
        />
      </Box>

      {/* Divider */}
      {/* <Divider sx={{ my: 3 }} /> */}

      {/* Display the layers in a table */}
      {layers.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'lightblue', textAlign: 'center', fontWeight:"bold" }}>Serial Number</TableCell>
              <TableCell sx={{ backgroundColor: 'lightblue', textAlign: 'center', fontWeight:"bold" }}>Layer Type</TableCell>
              <TableCell sx={{ backgroundColor: 'lightblue', textAlign: 'center', fontWeight:"bold" }}>Material Selected</TableCell>
              <TableCell sx={{ backgroundColor: 'lightblue', textAlign: 'center', fontWeight:"bold" }}>Thickness (inches)</TableCell>
              <TableCell sx={{ backgroundColor: 'lightblue', textAlign: 'center' , fontWeight:"bold"}}>R-Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {layers.map((layer, index) => (
              <TableRow key={index}>
                <TableCell sx={{ textAlign: 'center' }}>{index + 1}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{layer.type}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{layer.material}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{layer.thickness}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{layer.rValue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}

export default FabricDetails;
