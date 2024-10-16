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
} from "@mui/material";

import { DoorType } from "../../../utils/DoorLayerData.js";

import {
  calculateRValue,
  calculateRTotal,
  calculateUValue,
} from "../../../calculations/FabricDetailCal/RoofCalculation.js";

function DoorFabricDetails() {
  // State variables for Door Type and Thickness
  const [doorMaterial, setDoorMaterial] = useState(null);
  const [doorThickness, setDoorThickness] = useState("");

  // Default values for hi and ho
  const hi = 2.5;
  const ho = 11.54;

  // Collect layers that have both material and thickness specified
  const layers = [];
  const rValues = [];

  // Helper function to process the door layer
  const processDoorLayer = (material, thickness) => {
    if (material && thickness !== "") {
      const thicknessValue = parseFloat(thickness);
      const kValue = material.k_value;
      const rValue = calculateRValue(thicknessValue, kValue);
      layers.push({
        material: material.name,
        thickness: thicknessValue,
        kValue: kValue,
        rValue: rValue.toFixed(4),
      });
      rValues.push(parseFloat(rValue.toFixed(4)));
    }
  };

  // Process the door layer
  processDoorLayer(doorMaterial, doorThickness);

  // Calculate rTotal and U-value if there are layers
  let rTotal = null;
  let uValue = null;
  let calculationError = null;

  if (layers.length > 0) {
    try {
      rTotal = calculateRTotal(rValues, hi, ho).toFixed(4);
      uValue = calculateUValue(rTotal).toFixed(3);
    } catch (error) {
      calculationError = error.message;
    }
  }

  return (
    <Box p={3} display="flex" flexDirection="column" gap={2}>
      {/* Door Type Input */}
      <Box display="flex" gap={2} alignItems="center">
        <FormControl fullWidth variant="outlined">
          <InputLabel>Door Type</InputLabel>
          <Select
            label="Door Type"
            value={doorMaterial ? doorMaterial.name : ""}
            onChange={(e) => {
              const selectedMaterial = DoorType.find(
                (material) => material.name === e.target.value
              );
              setDoorMaterial(selectedMaterial);
              if (selectedMaterial && selectedMaterial.name === "None") {
                setDoorThickness("0");
              } else {
                setDoorThickness("");
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
          disabled={doorMaterial && doorMaterial.name === "None"}
        />
      </Box>

      {/* Display K-Value */}
      {/* {doorMaterial && (
        <Box
          p={2}
          mt={2}
          bgcolor="lightgreen"
          borderRadius={2}
          fontWeight="bold"
          textAlign="center"
        >
          K-Value: {doorMaterial.k_value}
        </Box>
      )} */}

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
          Total R-Value: {rTotal}
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
          Calculated U-Factor: {uValue}
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
                K-Value
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
                <TableCell sx={{ textAlign: "center" }}>
                  {layer.material}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {layer.thickness}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {layer.kValue}
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

export default DoorFabricDetails;
