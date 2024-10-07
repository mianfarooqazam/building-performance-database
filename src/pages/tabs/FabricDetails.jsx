import {
  Box,
  MenuItem,
  Select,

  InputLabel,
  FormControl,
} from "@mui/material";
import {
  Layer1,
} from "../../utils/RoofLayerData.js";


function FabricDetails() {
  return (
    <Box p={3}>
   <FormControl fullWidth variant="outlined">
          <InputLabel>Roof Layer</InputLabel>
          <Select
            label="No. of Floors"
          >
            {Layer1.map((floor) => (
              <MenuItem key={floor} value={floor}>
                {floor}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
    </Box>
  );
}

export default FabricDetails;
