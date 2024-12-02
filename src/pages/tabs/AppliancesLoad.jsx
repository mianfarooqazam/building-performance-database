import { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import {
  FanManufacturer,
  OvenManufacturer,
  WashingMachineManufacturer,
  RefrigeratorManufacturer,
  VacuumManufacturer,
  HeaterManufacturer,
  IronManufacturer,
  TVManufacturer,
  WaterPumpManufacturer
} from '../../utils/appliances/AppliancesData.js'; 

const applianceOptions = [
  'Fan',
  'Oven',
  'Washing Machine',
  'Refrigerator',
  'Vacuum',
  'Heater',
  'Iron',
  'TV',
  'Water Pump'
];

const manufacturerMap = {
  Fan: FanManufacturer,
  Oven: OvenManufacturer,
  'Washing Machine': WashingMachineManufacturer,
  Refrigerator: RefrigeratorManufacturer,
  Vacuum: VacuumManufacturer,
  Heater: HeaterManufacturer,
  Iron: IronManufacturer,
  TV: TVManufacturer,
  'Water Pump': WaterPumpManufacturer
};

function AppliancesLoad() {
  const [appliance, setAppliance] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [quantity, setQuantity] = useState('');
  const [dailyHourUsage, setDailyHourUsage] = useState('');

  return (
    <Box p={3} maxWidth={800} margin="0 auto">
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Appliance Input */}
        <FormControl fullWidth required>
          <InputLabel id="appliance-label">Appliance</InputLabel>
          <Select
            labelId="appliance-label"
            value={appliance}
            label="Appliance"
            onChange={(e) => {
              setAppliance(e.target.value);
              setManufacturer('');
            }}
          >
            {applianceOptions.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Manufacturer Input */}
        <FormControl fullWidth required disabled={!appliance}>
          <InputLabel id="manufacturer-label">Manufacturer</InputLabel>
          <Select
            labelId="manufacturer-label"
            value={manufacturer}
            label="Manufacturer"
            onChange={(e) => setManufacturer(e.target.value)}
          >
            {appliance &&
              manufacturerMap[appliance].map((manu, index) => (
                <MenuItem key={index} value={manu}>
                  {manu}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
          {/* Quantity Input */}
          <TextField
            label="Quantity"
            variant="outlined"
            fullWidth
            required
            type="number"
            slotProps={{ htmlInput: { min: 1 } }}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          {/* Daily Hour Usage Input */}
          <TextField
            label="Daily Hour Usage"
            variant="outlined"
            fullWidth
            required
            type="number"
            slotProps={{ htmlInput: { min: 0, max: 24 } }}
            value={dailyHourUsage}
            onChange={(e) => setDailyHourUsage(e.target.value)}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default AppliancesLoad;
