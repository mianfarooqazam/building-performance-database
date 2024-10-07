import { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  States,
  CitiesKPK,
  CitiesPunjab,
  CitiesSindh,
  CitiesBalochistan,
  CitiesKashmirAJK,
  CitiesGilgitBaltistan,
  CitiesIslamabadICT,
} from "../../utils/BuildingInformationData";

function BuildingInformation() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const getCities = () => {
    switch (selectedState) {
      case "KPK":
        return CitiesKPK;
      case "Punjab":
        return CitiesPunjab;
      case "Sindh":
        return CitiesSindh;
      case "Balochistan":
        return CitiesBalochistan;
      case "Kashmir AJK":
        return CitiesKashmirAJK;
      case "Gilgit Baltistan":
        return CitiesGilgitBaltistan;
      case "Islamabad ICT":
        return CitiesIslamabadICT;
      default:
        return [];
    }
  };

  return (
    <Box p={3} display="flex" flexDirection="column" gap={2}>
      <Box display="flex" gap={2}>
        <TextField label="Owner Name" variant="outlined" fullWidth />
        <TextField label="Address" variant="outlined" fullWidth />
      </Box>

      <Box display="flex" gap={2}>
        <TextField label="Plot No." variant="outlined" fullWidth />
        <TextField label="Street No." variant="outlined" fullWidth />
      </Box>

      <Box display="flex" gap={2}>
        <TextField label="Postal Code" variant="outlined" fullWidth />
        <FormControl fullWidth variant="outlined">
          <InputLabel>State/Province</InputLabel>
          <Select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedCity("");
            }}
            label="State/Province"
          >
            {States.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box display="flex" gap={2}>
        <FormControl fullWidth variant="outlined" disabled={!selectedState}>
          <InputLabel>City</InputLabel>
          <Select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            label="City"
          >
            {getCities().map((city) => (
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
