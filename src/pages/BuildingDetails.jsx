import { Tabs, Tab, Box } from '@mui/material';
import { useState } from 'react';
import BuildingInformation from './tabs/BuildingInformation';
import FloorPlan from './tabs/FloorPlan';
import FabricDetails from './tabs/FabricDetails';
import LightingLoad from './tabs/LightingLoad';
import AppliancesLoad from './tabs/AppliancesLoad';
import HeatingCoolingEnergy from './tabs/HeatingCooling';
import Eui from './tabs/Eui';
import CostAndCO from './tabs/CostAndCo';

function BuildingDetails() {
  const [value, setValue] = useState(0);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <div className="p-4">
      <Tabs
        value={value}
        onChange={(event, newValue) => handleChange(newValue)} // Keep event but not necessary to use it
        aria-label="Building Details Tabs"
        indicatorColor="primary"
      >
        <Tab label="Building Information" />
        <Tab label="Floor Plan" />
        <Tab label="Fabric Details" />
        <Tab label="Lighting Load" />
        <Tab label="Appliances Load" />
        <Tab label="Heating/Cooling Energy" />
        <Tab label="EUI" />
        <Tab label="Cost and CO" />
      </Tabs>

      <Box role="tabpanel" hidden={value !== 0}>
        <BuildingInformation />
      </Box>
      <Box role="tabpanel" hidden={value !== 1}>
        <FloorPlan />
      </Box>
      <Box role="tabpanel" hidden={value !== 2}>
        <FabricDetails />
      </Box>
      <Box role="tabpanel" hidden={value !== 3}>
        <LightingLoad />
      </Box>
      <Box role="tabpanel" hidden={value !== 4}>
        <AppliancesLoad />
      </Box>
      <Box role="tabpanel" hidden={value !== 5}>
        <HeatingCoolingEnergy />
      </Box>
      <Box role="tabpanel" hidden={value !== 6}>
        <Eui />
      </Box>
      <Box role="tabpanel" hidden={value !== 7}>
        <CostAndCO />
      </Box>
    </div>
  );
}

export default BuildingDetails;
