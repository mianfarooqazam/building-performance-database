import { Box, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { Orientation } from "../../utils/BuildingInformationData";
function FloorPlan() {
  return (
    <Box p={3} display="flex" flexDirection="column" gap={2}>
      <Box display="flex" gap={2}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Orientation</InputLabel>
          <Select label="Orientation">
            {Orientation.map((direction) => (
              <MenuItem key={direction} value={direction}>
                {direction}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}

export default FloorPlan;
