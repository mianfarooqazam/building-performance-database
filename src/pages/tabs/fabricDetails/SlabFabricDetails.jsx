import React from 'react';
import {
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Divider,
} from '@mui/material';

import { SlabLayer } from '../../../utils/SlabLayerData.js';
import useSlabFabricDetailsStore from '../../../store/useSlabFabricDetailsStore.js';

function SlabFabricDetails() {
  // Use Zustand store
  const { selectedSlabType, setSelectedSlabType } = useSlabFabricDetailsStore();

  return (
    <Box p={3} display="flex" flexDirection="row" gap={2}>
      {/* Left Side - Input (80%) */}
      <Box flex={4}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Slab Type</InputLabel>
          <Select
            label="Slab Type"
            value={selectedSlabType ? selectedSlabType.name : ''}
            onChange={(e) => {
              const selected = SlabLayer.find((item) => item.name === e.target.value);
              setSelectedSlabType(selected);
            }}
          >
            {SlabLayer.map((item) => (
              <MenuItem key={item.name} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Vertical Divider */}
      <Divider orientation="vertical" flexItem />

      {/* Right Side - Display U-Value and R-Value (20%) */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="lightblue"
        borderRadius={2}
        p={2}
      >
        {selectedSlabType ? (
          <>
            <Typography variant="h6" fontWeight="bold">
              U-Value: {selectedSlabType.u_value}
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              R-Value: {selectedSlabType.r_value}
            </Typography>
          </>
        ) : (
          <Typography variant="subtitle1" fontWeight="bold">
            Select a slab type
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default SlabFabricDetails;
