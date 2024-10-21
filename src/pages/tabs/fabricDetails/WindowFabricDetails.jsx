// src/components/WindowFabricDetails.js

import {
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import { WindowType, FrameType, ShadingCover } from "../../../utils/WindowLayerData.js";
import { calculateEffectiveUValue } from "../../../calculations/FabricDetailCal/WindowCalculation.js";

import useWindowFabricDetailsStore from '../../../store/useWindowFabricDetailsStore.js';

function WindowFabricDetails() {
  // Use Zustand store instead of useState
  const {
    selectedWindowType,
    setSelectedWindowType,
    selectedFrameType,
    setSelectedFrameType,
    selectedShadingCover,
    setSelectedShadingCover,
  } = useWindowFabricDetailsStore();

  // Effective U-value calculation
  let effectiveUValue = null;
  if (selectedWindowType) {
    try {
      effectiveUValue = calculateEffectiveUValue(selectedWindowType.u_value).toFixed(3);
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <Box p={3} display="flex" flexDirection="column" gap={2}>
      {/* Window Type Selection */}
      <FormControl fullWidth variant="outlined">
        <InputLabel>Window Type</InputLabel>
        <Select
          label="Window Type"
          value={selectedWindowType ? selectedWindowType.name : ""}
          onChange={(e) => {
            const selected = WindowType.find((item) => item.name === e.target.value);
            setSelectedWindowType(selected);
          }}
        >
          {WindowType.map((item) => (
            <MenuItem key={item.name} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Frame Type Selection */}
      <FormControl fullWidth variant="outlined">
        <InputLabel>Frame Type</InputLabel>
        <Select
          label="Frame Type"
          value={selectedFrameType ? selectedFrameType.name : ""}
          onChange={(e) => {
            const selected = FrameType.find((item) => item.name === e.target.value);
            setSelectedFrameType(selected);
          }}
        >
          {FrameType.map((item) => (
            <MenuItem key={item.name} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Shading Cover Selection */}
      <FormControl fullWidth variant="outlined">
        <InputLabel>Shading Cover</InputLabel>
        <Select
          label="Shading Cover"
          value={selectedShadingCover ? selectedShadingCover.type : ""}
          onChange={(e) => {
            const selected = ShadingCover.find((item) => item.type === e.target.value);
            setSelectedShadingCover(selected);
          }}
        >
          {ShadingCover.map((item) => (
            <MenuItem key={item.type} value={item.type}>
              {item.type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Display Effective U-Value */}
      {effectiveUValue && (
        <Box
          p={2}
          mt={2}
          bgcolor="lightblue"
          borderRadius={2}
          fontWeight="bold"
          textAlign="center"
        >
          Effective U-Value: {effectiveUValue}
        </Box>
      )}

      {/* Display Selected Values in a Table */}
      {(selectedWindowType || selectedFrameType || selectedShadingCover) && (
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
                Parameter
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "lightblue",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Value
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(() => {
              let serialNumber = 1;
              const rows = [];

              if (selectedWindowType) {
                rows.push(
                  <TableRow key="window-type">
                    <TableCell sx={{ textAlign: "center" }}>{serialNumber++}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Window Type</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {selectedWindowType.name}
                    </TableCell>
                  </TableRow>,
                  <TableRow key="u-value">
                    <TableCell sx={{ textAlign: "center" }}>{serialNumber++}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>U-Value</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {selectedWindowType.u_value}
                    </TableCell>
                  </TableRow>,
                  <TableRow key="shgc">
                    <TableCell sx={{ textAlign: "center" }}>{serialNumber++}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>SHGC</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {selectedWindowType.shgc}
                    </TableCell>
                  </TableRow>
                );
              }

              if (selectedFrameType) {
                rows.push(
                  <TableRow key="frame-type">
                    <TableCell sx={{ textAlign: "center" }}>{serialNumber++}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Frame Type</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {selectedFrameType.name}
                    </TableCell>
                  </TableRow>
                  // Frame Value (frame_factor) row is omitted
                );
              }

              if (selectedShadingCover) {
                rows.push(
                  <TableRow key="shading-cover">
                    <TableCell sx={{ textAlign: "center" }}>{serialNumber++}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Shading Cover</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {selectedShadingCover.type}
                    </TableCell>
                  </TableRow>
                  // Winter and Summer Value rows are omitted
                );
              }

              return rows;
            })()}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}

export default WindowFabricDetails;
