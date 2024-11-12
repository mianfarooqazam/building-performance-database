
import { useEffect, useState } from 'react';
import {
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Divider,
} from '@mui/material';

import { SlabLayer } from '../../../utils/SlabLayerData.js';
import useSlabFabricDetailsStore from '../../../store/useSlabFabricDetailsStore.js';
import useFloorPlanStore from '../../../store/useFloorPlanStore.js';

function SlabFabricDetails() {
  const { selectedSlabType, setSelectedSlabType, uValue, setUValue,uaValue,         
    setUAValue,  } = useSlabFabricDetailsStore();

  const { totalFloorArea } = useFloorPlanStore();
  const [calculationError, setCalculationError] = useState(null);

  useEffect(() => {
    if (selectedSlabType) {
      try {
        // Rename the local variable to avoid shadowing 'uValue' from the store
        const calculatedUValue = parseFloat(selectedSlabType.u_value);
        setUValue(calculatedUValue);

        const areaInFt2 = parseFloat(totalFloorArea) || 0;
        const areaInM2 = areaInFt2 * 0.092903;

        const ua = (calculatedUValue * areaInM2).toFixed(3);
        setUAValue(ua); 
        setCalculationError(null);
      } catch (error) {
        setCalculationError(error.message);
        setUValue(null);
        setUAValue(null); 
      }
    } else {
      setUValue(null); 
      setUAValue(null); 
    }
  }, [selectedSlabType, totalFloorArea,  setUValue,
    setUAValue,]);

  return (
    <Box p={3} display="flex" flexDirection="row" gap={2}>
      {/* Inputs Section */}
      <Box width="80%" display="flex" flexDirection="column" gap={2}>
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
      </Box>

      {/* Divider */}
      <Divider orientation="vertical" flexItem />

      {/* Calculations Section */}
      <Box width="20%" display="flex" flexDirection="column" gap={2}>
        {selectedSlabType ? (
          <>
           <Box
              p={2}
              mt={2}
              bgcolor="lightblue"
              borderRadius={2}
              fontWeight="bold"
              textAlign="center"
            >
              R-Value: {selectedSlabType.r_value}
            </Box>
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
                {/* [{(parseFloat(totalFloorArea) * 0.092903).toFixed(2)} m²] */}
              </Box>
            )}
            <Box
              p={2}
              mt={2}
              bgcolor="lightblue"
              borderRadius={2}
              fontWeight="bold"
              textAlign="center"
            >
              Floor Area: {(parseFloat(totalFloorArea) * 0.092903).toFixed(2) || 'N/A'} 
            </Box>
          </>
        ) : (
          <Box
            p={2}
            mt={2}
            bgcolor="lightgrey"
            borderRadius={2}
            fontWeight="bold"
            textAlign="center"
          >
            Select a slab type
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default SlabFabricDetails;
