import {
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import useBuildingInformationStore from '../../store/useBuildingInformationStore';

function BuildingInformation() {
  const {
    ownerName,
    address,
    plotNo,
    streetNo,
    postalCode,
    selectedCity,
    setOwnerName,
    setAddress,
    setPlotNo,
    setStreetNo,
    setPostalCode,
    setSelectedCity,
  } = useBuildingInformationStore();

  const cities = ["Peshawar", "Lahore", "Islamabad", "Karachi", "Multan"];

  return (
    <Box p={3} display="flex" flexDirection="column" gap={2}>
      <Box display="flex" gap={2}>
        <TextField
          label="Owner Name"
          variant="outlined"
          fullWidth
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
        />
        <TextField
          label="Address"
          variant="outlined"
          fullWidth
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Box>

      <Box display="flex" gap={2}>
        <TextField
          label="Plot No."
          variant="outlined"
          fullWidth
          value={plotNo}
          onChange={(e) => setPlotNo(e.target.value)}
        />
        <TextField
          label="Street No."
          variant="outlined"
          fullWidth
          value={streetNo}
          onChange={(e) => setStreetNo(e.target.value)}
        />
      </Box>

      <Box display="flex" gap={2}>
        <TextField
          label="Postal Code"
          variant="outlined"
          fullWidth
          type='number'
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel>City</InputLabel>
          <Select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            label="City"
          >
            {cities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}

export default BuildingInformation;
