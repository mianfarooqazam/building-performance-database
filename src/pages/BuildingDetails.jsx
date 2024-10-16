import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import FloorPlanIcon from "@mui/icons-material/Map";
import FabricIcon from "@mui/icons-material/Category";
import LightingIcon from "@mui/icons-material/Lightbulb";
import AppliancesIcon from "@mui/icons-material/Kitchen";
import HeatingCoolingIcon from "@mui/icons-material/AcUnit";
import EnergyIcon from "@mui/icons-material/Speed";
import CostIcon from "@mui/icons-material/AttachMoney";
import BuildingInformation from "./tabs/BuildingInformation";
import FloorPlan from "./tabs/FloorPlan";
import FabricDetails from "./tabs/FabricDetails";
import Ventilation from "./tabs/Ventilation";
import LightingLoad from "./tabs/LightingLoad";
import AppliancesLoad from "./tabs/AppliancesLoad";
import HeatingCoolingEnergy from "./tabs/HeatingCooling";
import Eui from "./tabs/Eui";
import CostAndCO from "./tabs/CostAndCo";

function BuildingDetails() {
  const [value, setValue] = useState(0);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <div className="p-4">
      {/* Red background wrapper for the entire tabs section */}
      <div className=" p-2 rounded-lg" style={{ backgroundColor: "#fff" }}>
        <Tabs
          value={value}
          onChange={(event, newValue) => handleChange(newValue)}
          aria-label="Building Details Tabs"
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{
            style: {
              backgroundColor: "#fff",
            },
          }}
        >
          <Tab
            icon={<HomeIcon />}
            label="Building Information"
            className={`${value === 0 ? "bg-blue-100 rounded-lg" : ""}`}
          />
          <Tab
            icon={<FloorPlanIcon />}
            label="Floor Plan"
            className={`${value === 1 ? "bg-blue-100 rounded-lg" : ""}`}
          />
          <Tab
            icon={<FabricIcon />}
            label="Fabric Details"
            className={`${value === 2 ? "bg-blue-100 rounded-lg" : ""}`}
          />
          <Tab
            icon={<HeatingCoolingIcon />}
            label="Ventilation"
            className={`${value === 3 ? "bg-blue-100 rounded-lg" : ""}`}
          />
          <Tab
            icon={<LightingIcon />}
            label="Lighting Load"
            className={`${value === 4 ? "bg-blue-100 rounded-lg" : ""}`}
          />
          <Tab
            icon={<AppliancesIcon />}
            label="Appliances Load"
            className={`${value === 5 ? "bg-blue-100 rounded-lg" : ""}`}
          />
          <Tab
            icon={<HeatingCoolingIcon />}
            label="Heating/Cooling Energy"
            className={`${value === 6 ? "bg-blue-100 rounded-lg" : ""}`}
          />
          <Tab
            icon={<EnergyIcon />}
            label="EUI"
            className={`${value === 7 ? "bg-blue-100 rounded-lg" : ""}`}
          />
          <Tab
            icon={<CostIcon />}
            label="Cost and CO"
            className={`${value === 8 ? "bg-blue-100 rounded-lg" : ""}`}
          />
        </Tabs>
      </div>

      {/* Tab Panels with scrollable view */}
      <Box
        sx={{
          padding: 2,
          marginTop: 2,
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          flexGrow: 1, // Adjusted to allow the content to use available screen space
          overflowY: "auto", // Keeps auto overflow only when absolutely necessary
        }}
      >
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
          <Ventilation />
        </Box>
        <Box role="tabpanel" hidden={value !== 4}>
          <LightingLoad />
        </Box>
        <Box role="tabpanel" hidden={value !== 5}>
          <AppliancesLoad />
        </Box>
        <Box role="tabpanel" hidden={value !== 6}>
          <HeatingCoolingEnergy />
        </Box>
        <Box role="tabpanel" hidden={value !== 7}>
          <Eui />
        </Box>
        <Box role="tabpanel" hidden={value !== 8}>
          <CostAndCO />
        </Box>
      </Box>
    </div>
  );
}

export default BuildingDetails;
