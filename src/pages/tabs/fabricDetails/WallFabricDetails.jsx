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
} from "../../../utils/WallLayerData.js";

import {
  calculateRValue,
  calculateRTotal,
  calculateUValue,
} from "../../../calculations/FabricDetailCal/WallCalculation.js"; // Using the same calculation functions

function WallFabricDetails() {
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
  const [hi, setHi] = useState(7.69); // Typical value for walls
  const [ho, setHo] = useState(25); // Typical value for walls

  // State variables for errors
  const [hiError, setHiError] = useState("");
  const [hoError, setHoError] = useState("");

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
  let calculationError = null;

  if (layers.length > 0) {
    try {
      const hiValue = parseFloat(hi) || 1; // Default to 1 if hi is invalid
      const hoValue = parseFloat(ho) || 1; // Default to 1 if ho is invalid

      rTotal = calculateRTotal(rValues, hiValue, hoValue).toFixed(4);
      uValue = calculateUValue(rTotal).toFixed(3); // Updated to 3 decimal points
    } catch (error) {
      calculationError = error.message;
    }
  }

  return (
    <Box p={3} display="flex" flexDirection="column" gap={2}>
      <h1 className="font-semibold text-2xl">Wall Details</h1>

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
          label="Outer Layer Thickness (inches)"
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
          label="Core Layer Thickness (inches)"
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
          label="Insulation Layer Thickness (inches)"
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
          label="Inner Layer Thickness (inches)"
          variant="outlined"
          fullWidth
          value={innerLayerThickness}
          onChange={(e) => setInnerLayerThickness(e.target.value)}
        />
      </Box>

      {/* hi and ho Inputs */}
      {/* <Box display="flex" gap={2} alignItems="center">
        <TextField
          label={
            <Box display="flex" alignItems="center">
              <span>
                h<sub>i</sub> (W/m<sup>2</sup>·K)
              </span>
              <Tooltip title="This value hi (7.69) is typical for walls. You can use this or enter your own value.">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          }
          variant="outlined"
          fullWidth
          value={hi}
          error={!!hiError}
          helperText={hiError}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || parseFloat(value) > 0) {
              setHi(value);
              setHiError("");
            } else {
              setHi(value);
              setHiError("hi must be a positive number");
            }
          }}
        />
        <TextField
          label={
            <Box display="flex" alignItems="center">
              <span>
                h<sub>o</sub> (W/m<sup>2</sup>·K)
              </span>
              <Tooltip title="This value ho (25) is typical for walls. You can use this or enter your own value.">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          }
          variant="outlined"
          fullWidth
          value={ho}
          error={!!hoError}
          helperText={hoError}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || parseFloat(value) > 0) {
              setHo(value);
              setHoError("");
            } else {
              setHo(value);
              setHoError("ho must be a positive number");
            }
          }}
        />
      </Box> */}

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
          Total R-Value: {rTotal}
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

export default WallFabricDetails;
