import { TextField, Box } from '@mui/material';

function BuildingInformation() {
  return (
    <Box p={3}>
      <div className="space-y-4">
        <TextField label="Building Name" variant="outlined" fullWidth />
        <TextField label="Address" variant="outlined" fullWidth />
        {/* Add other text fields related to Building Information */}
      </div>
    </Box>
  );
}

export default BuildingInformation;
