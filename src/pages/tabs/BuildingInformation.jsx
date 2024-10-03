import { useState } from 'react';
import { Box, TextField, MenuItem, Select, InputLabel, FormControl, Grid } from '@mui/material';
import {
  States,
  CitiesKPK,
  CitiesPunjab,
  CitiesSindh,
  CitiesBalochistan,
  CitiesKashmirAJK,
  CitiesGilgitBaltistan,
  CitiesIslamabadICT,
  BuildingType,
  Basement,
  Orientation,
  Floors,
} from '../../utils/BuildingInformationData';

function BuildingInformation() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const getCities = () => {
    switch (selectedState) {
      case 'KPK':
        return CitiesKPK;
      case 'Punjab':
        return CitiesPunjab;
      case 'Sindh':
        return CitiesSindh;
      case 'Balochistan':
        return CitiesBalochistan;
      case 'Kashmir AJK':
        return CitiesKashmirAJK;
      case 'Gilgit Baltistan':
        return CitiesGilgitBaltistan;
      case 'Islamabad ICT':
        return CitiesIslamabadICT;
      default:
        return [];
    }
  };

  return (
    <Box p={3}>
      <Grid container spacing={2}>
        {/* Owner Name and Address */}
        <Grid item xs={12} sm={6}>
          <TextField label="Owner Name" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Address" variant="outlined" fullWidth />
        </Grid>

        {/* Plot No. and Street No. */}
        <Grid item xs={12} sm={6}>
          <TextField label="Plot No." variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Street No." variant="outlined" fullWidth />
        </Grid>

        {/* Postal Code and State/Province */}
        <Grid item xs={12} sm={6}>
          <TextField label="Postal Code" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>State/Province</InputLabel>
            <Select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity('');
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
        </Grid>

        {/* City and Building Type */}
        <Grid item xs={12} sm={6}>
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Building Type</InputLabel>
            <Select label="Building Type">
              {BuildingType.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* No. of Floors and Basement */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>No. of Floors</InputLabel>
            <Select label="No. of Floors">
              {Floors.map((floor) => (
                <MenuItem key={floor} value={floor}>
                  {floor}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Basement</InputLabel>
            <Select label="Basement">
              {Basement.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Orientation */}
        <Grid item xs={12} sm={6}>
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
        </Grid>
      </Grid>
    </Box>
  );
}

export default BuildingInformation;
