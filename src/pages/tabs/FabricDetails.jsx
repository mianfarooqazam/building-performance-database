// FabricDetails.js

import { useState } from "react";
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
  Tooltip,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import {
  OuterLayer,
  CoreLayer,
  InsulationLayer,
  InnerLayer,
} from "../../utils/RoofLayerData.js";

import {
  calculateRValue,
  calculateRTotal,
  calculateUValue,
} from "../../calculations/FabricDetailCal/RoofCalculation.js";

function FabricDetails() {
  // State variables for each layer's material and thickness
  const [outerLayerMaterial, setOuterLayerMaterial] = useState(null);
  const [outerLayerThickness, setOuterLayerThickness] = useState("");
  const [coreLayerMaterial, setCoreLayerMaterial] = useState(null);
  const [coreLayerThickness, setCoreLayerThickness] = useState("");
  const [insulationLayerMaterial, setInsulationLayerMaterial] = useState(null);
  const [insulationLayerThickness, setInsulationLayerThickness] = useState("");
  const [innerLayerMaterial, setInnerLayerMaterial] = useState(null);
  const [innerLayerThickness, setInnerLayerThickness] = useState("");

  // State variables for hi and ho
  const [hi, setHi] = useState(2.5);
  const [ho, setHo] = useState(11.54);

  // Collect layers that have both material and thickness specified
  const layers = [];
  const rValues = [];

  if (outerLayerMaterial && outerLayerThickness) {
    const rValue = calculateRValue(
      parseFloat(outerLayerThickness),
      outerLayerMaterial.k_value
    );
    layers.push({
      type: "Outer Layer",
      material: outerLayerMaterial.name,
      thickness: parseFloat(outerLayerThickness),
      rValue: rValue.toFixed(4),
    });
    rValues.push(parseFloat(rValue.toFixed(4)));
  }

  if (coreLayerMaterial && coreLayerThickness) {
    const rValue = calculateRValue(
      parseFloat(coreLayerThickness),
      coreLayerMaterial.k_value
    );
    layers.push({
      type: "Core Layer",
      material: coreLayerMaterial.name,
      thickness: parseFloat(coreLayerThickness),
      rValue: rValue.toFixed(4),
    });
    rValues.push(parseFloat(rValue.toFixed(4)));
  }

  if (insulationLayerMaterial && insulationLayerThickness) {
    const rValue = calculateRValue(
      parseFloat(insulationLayerThickness),
      insulationLayerMaterial.k_value
    );
    layers.push({
      type: "Insulation Layer",
      material: insulationLayerMaterial.name,
      thickness: parseFloat(insulationLayerThickness),
      rValue: rValue.toFixed(4),
    });
    rValues.push(parseFloat(rValue.toFixed(4)));
  }

  if (innerLayerMaterial && innerLayerThickness) {
    const rValue = calculateRValue(
      parseFloat(innerLayerThickness),
      innerLayerMaterial.k_value
    );
    layers.push({
      type: "Inner Layer",
      material: innerLayerMaterial.name,
      thickness: parseFloat(innerLayerThickness),
      rValue: rValue.toFixed(4),
    });
    rValues.push(parseFloat(rValue.toFixed(4)));
  }

  // Calculate rTotal and U-value if there are layers
  let rTotal = null;
  let uValue = null;

  if (layers.length > 0) {
    rTotal = calculateRTotal(rValues, hi, ho).toFixed(4);
    uValue = calculateUValue(rTotal).toFixed(4);
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
            value={outerLayerMaterial ? outerLayerMaterial.name : ""}
            onChange={(e) => {
              const selectedMaterial = OuterLayer.find(
                (material) => material.name === e.target.value
              );
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
            value={coreLayerMaterial ? coreLayerMaterial.name : ""}
            onChange={(e) => {
              const selectedMaterial = CoreLayer.find(
                (material) => material.name === e.target.value
              );
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
            value={insulationLayerMaterial ? insulationLayerMaterial.name : ""}
            onChange={(e) => {
              const selectedMaterial = InsulationLayer.find(
                (material) => material.name === e.target.value
              );
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
            value={innerLayerMaterial ? innerLayerMaterial.name : ""}
            onChange={(e) => {
              const selectedMaterial = InnerLayer.find(
                (material) => material.name === e.target.value
              );
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

      {/* hi and ho Inputs */}
      <Box display="flex" gap={2} alignItems="center">
        <TextField
          label={
            <Box display="flex" alignItems="center">
              <span>
                h<sub>i</sub>
              </span>
              <Tooltip title="This value hi (2.5) is taken from Design Builder. You can use this or enter your own value.">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          }
          variant="outlined"
          fullWidth
          value={hi}
          onChange={(e) => setHi(e.target.value)}
        />
        <TextField
          label={
            <Box display="flex" alignItems="center">
              <span>
                h<sub>0</sub>
              </span>
              <Tooltip title="This value ho (11.54) is taken from Design Builder. You can use this or enter your own value.">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          }
          variant="outlined"
          fullWidth
          value={ho}
          onChange={(e) => setHo(e.target.value)}
        />
      </Box>
      {/* rTotal Display */}
      {layers.length > 0 && (
        <Box
          p={2}
          mt={2}
          bgcolor="lightblue"
          borderRadius={2}
          fontWeight="bold"
          textAlign="center"
        >
          Total R-Value: {rTotal}
        </Box>
      )}

      {/* U-value Display */}
      {layers.length > 0 && (
        <Box
          p={2}
          mt={2}
          bgcolor="lightblue"
          borderRadius={2}
          fontWeight="bold"
          textAlign="center"
        >
          Calculated U-Value: {uValue}
        </Box>
      )}

      {/* Display the layers in a table */}
      {layers.length > 0 && (
        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "lightblue",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Serial Number
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "lightblue",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Layer Type
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "lightblue",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Material Selected
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "lightblue",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Thickness (inches)
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "lightblue",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                R-Value
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {layers.map((layer, index) => (
              <TableRow key={index}>
                <TableCell sx={{ textAlign: "center" }}>{index + 1}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{layer.type}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {layer.material}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {layer.thickness}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {layer.rValue}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}

export default FabricDetails;
