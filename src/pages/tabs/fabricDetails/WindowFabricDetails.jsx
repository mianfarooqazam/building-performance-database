

import { useEffect, useState } from 'react';
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
  Divider,
} from '@mui/material';

import { WindowType, FrameType, ShadingCover } from '../../../utils/WindowLayerData.js';
import { calculateEffectiveUValue } from '../../../calculations/FabricDetailCal/WindowCalculation.js';

import useWindowFabricDetailsStore from '../../../store/useWindowFabricDetailsStore.js';
import useFloorPlanStore from '../../../store/useFloorPlanStore.js';

function WindowFabricDetails() {
  const {
    selectedWindowType,
    setSelectedWindowType,
    selectedFrameType,
    setSelectedFrameType,
    selectedShadingCover,
    setSelectedShadingCover,
    uValue,
    setUValue,
  } = useWindowFabricDetailsStore();

  const { totalWindowArea } = useFloorPlanStore();

  const [calculationError, setCalculationError] = useState(null);
  const [uaValue, setUaValue] = useState(null);

  useEffect(() => {
    if (selectedWindowType) {
      try {
        const effectiveU = calculateEffectiveUValue(selectedWindowType.u_value).toFixed(3);
        setUValue(effectiveU);

        const areaInFt2 = parseFloat(totalWindowArea) || 0;
        const areaInM2 = areaInFt2 * 0.092903; // Convert ft² to m²

        const ua = (effectiveU * areaInM2).toFixed(3);
        setUaValue(ua);
        setCalculationError(null);
      } catch (error) {
        setCalculationError(error.message);
        setUValue(null);
        setUaValue(null);
      }
    } else {
      setUValue(null);
      setUaValue(null);
    }
  }, [selectedWindowType, totalWindowArea, setUValue]);

  return (
    <Box p={3} display="flex" flexDirection="row" gap={2}>
      {/* Inputs Section */}
      <Box width="80%" display="flex" flexDirection="column" gap={2}>
        {/* Window Type Selection */}
        <FormControl fullWidth variant="outlined">
          <InputLabel>Window Type</InputLabel>
          <Select
            label="Window Type"
            value={selectedWindowType ? selectedWindowType.name : ''}
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
            value={selectedFrameType ? selectedFrameType.name : ''}
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
            value={selectedShadingCover ? selectedShadingCover.type : ''}
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

        {/* Display Selected Values in a Table */}
        {(selectedWindowType || selectedFrameType || selectedShadingCover) && (
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
                  Parameter
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: 'lightblue',
                    textAlign: 'center',
                    fontWeight: 'bold',
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
                      <TableCell sx={{ textAlign: 'center' }}>{serialNumber++}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>Window Type</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {selectedWindowType.name}
                      </TableCell>
                    </TableRow>,
                    <TableRow key="u-value">
                      <TableCell sx={{ textAlign: 'center' }}>{serialNumber++}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>U-Value</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {selectedWindowType.u_value}
                      </TableCell>
                    </TableRow>,
                    <TableRow key="shgc">
                      <TableCell sx={{ textAlign: 'center' }}>{serialNumber++}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>SHGC</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {selectedWindowType.shgc}
                      </TableCell>
                    </TableRow>
                  );
                }

                if (selectedFrameType) {
                  rows.push(
                    <TableRow key="frame-type">
                      <TableCell sx={{ textAlign: 'center' }}>{serialNumber++}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>Frame Type</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {selectedFrameType.name}
                      </TableCell>
                    </TableRow>
                  );
                }

                if (selectedShadingCover) {
                  rows.push(
                    <TableRow key="shading-cover">
                      <TableCell sx={{ textAlign: 'center' }}>{serialNumber++}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>Shading Cover</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {selectedShadingCover.type}
                      </TableCell>
                    </TableRow>
                  );
                }

                return rows;
              })()}
            </TableBody>
          </Table>
        )}
      </Box>

      {/* Divider */}
      <Divider orientation="vertical" flexItem />

      {/* Calculations Section */}
      <Box width="20%" display="flex" flexDirection="column" gap={2}>
        {/* Effective U-value Display */}
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
             {/* [{(parseFloat(totalWindowArea) * 0.092903).toFixed(2)}] */}
          </Box>
        )}

        {/* Window Area Display */}
        <Box
          p={2}
          mt={2}
          bgcolor="lightblue"
          borderRadius={2}
          fontWeight="bold"
          textAlign="center"
        >
          Window Area: {(parseFloat(totalWindowArea) * 0.092903).toFixed(2) || 'N/A'}
        </Box>
      </Box>
    </Box>
  );
}

export default WindowFabricDetails;
