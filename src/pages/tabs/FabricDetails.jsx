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
  Divider,
} from "@mui/material";

import {
  OuterLayer,
  CoreLayer,
  InsulationLayer,
  InnerLayer,
} from '../../utils/RoofLayerData.js';

function FabricDetails() {
  // State variables for each layer's material and thickness
  const [outerLayerMaterial, setOuterLayerMaterial] = useState('');
  const [outerLayerThickness, setOuterLayerThickness] = useState('');
  const [coreLayerMaterial, setCoreLayerMaterial] = useState('');
  const [coreLayerThickness, setCoreLayerThickness] = useState('');
  const [insulationLayerMaterial, setInsulationLayerMaterial] = useState('');
  const [insulationLayerThickness, setInsulationLayerThickness] = useState('');
  const [innerLayerMaterial, setInnerLayerMaterial] = useState('');
  const [innerLayerThickness, setInnerLayerThickness] = useState('');

  // Collect layers that have both material and thickness specified
  const layers = [];

  if (outerLayerMaterial && outerLayerThickness) {
    layers.push({
      type: 'Outer Layer',
      material: outerLayerMaterial,
      thickness: parseFloat(outerLayerThickness),
    });
  }

  if (coreLayerMaterial && coreLayerThickness) {
    layers.push({
      type: 'Core Layer',
      material: coreLayerMaterial,
      thickness: parseFloat(coreLayerThickness),
    });
  }

  if (insulationLayerMaterial && insulationLayerThickness) {
    layers.push({
      type: 'Insulation Layer',
      material: insulationLayerMaterial,
      thickness: parseFloat(insulationLayerThickness),
    });
  }

  if (innerLayerMaterial && innerLayerThickness) {
    layers.push({
      type: 'Inner Layer',
      material: innerLayerMaterial,
      thickness: parseFloat(innerLayerThickness),
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
            value={outerLayerMaterial}
            onChange={(e) => setOuterLayerMaterial(e.target.value)}
          >
            {OuterLayer.map((material) => (
              <MenuItem key={material} value={material}>
                {material}
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
            value={coreLayerMaterial}
            onChange={(e) => setCoreLayerMaterial(e.target.value)}
          >
            {CoreLayer.map((material) => (
              <MenuItem key={material} value={material}>
                {material}
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
            value={insulationLayerMaterial}
            onChange={(e) => setInsulationLayerMaterial(e.target.value)}
          >
            {InsulationLayer.map((material) => (
              <MenuItem key={material} value={material}>
                {material}
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
            value={innerLayerMaterial}
            onChange={(e) => setInnerLayerMaterial(e.target.value)}
          >
            {InnerLayer.map((material) => (
              <MenuItem key={material} value={material}>
                {material}
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

      {/* Horizontal Rule */}
      <Divider sx={{ my: 3 }} />

      {/* Display the layers in a table */}
      {layers.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Serial Number</TableCell>
              <TableCell>Layer Type</TableCell>
              <TableCell>Material Selected</TableCell>
              <TableCell>Thickness (inches)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {layers.map((layer, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{layer.type}</TableCell>
                <TableCell>{layer.material}</TableCell>
                <TableCell>{layer.thickness}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}

export default FabricDetails;
