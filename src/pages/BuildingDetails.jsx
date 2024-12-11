import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import FloorPlanIcon from "@mui/icons-material/Map";
import FabricIcon from "@mui/icons-material/Category";
import AppliancesIcon from "@mui/icons-material/Kitchen";
import HeatingCoolingIcon from "@mui/icons-material/AcUnit";
import EnergyIcon from "@mui/icons-material/Speed";
import BuildingInformation from "./tabs/BuildingInformation";
import FloorPlan from "./tabs/FloorPlan";
import FabricDetails from "./tabs/FabricDetails";
import Ventilation from "./tabs/Ventilation";
import AppliancesLoad from "./tabs/AppliancesLoad";
import AnnualEnergyDemand from "./tabs/AnnualEnergyDemand";
import LSheetCalculation from "./tabs/LSheetCalculation";
import SolarGainCalculation from "./tabs/SolarGainCalculation";

function BuildingDetails() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="p-4">
      {/* Sticky Tabs wrapper */}
      <div className="p-2 rounded-lg bg-white sticky top-0 z-10 shadow-md">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Building Details Tabs"
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{
            style: {
              backgroundColor: "#3f51b5", // Changed to a visible color
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
            icon={<AppliancesIcon />}
            label="Appliances Load"
            className={`${value === 4 ? "bg-blue-100 rounded-lg" : ""}`}
          />
          <Tab
            icon={<EnergyIcon />}
            label="Annual Energy Demand"
            className={`${value === 5 ? "bg-blue-100 rounded-lg" : ""}`}
          />
          <Tab
            icon={<EnergyIcon />}
            label="Solar Gain Calculation"
            className={`${value === 6 ? "bg-blue-100 rounded-lg" : ""}`}
          />
          <Tab
            icon={<EnergyIcon />}
            label="L Sheet Calculation"
            className={`${value === 7 ? "bg-blue-100 rounded-lg" : ""}`}
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
          flexGrow: 1,
          overflowY: "auto",
          overflowX: "hidden", // Prevent horizontal overflow on the panel
          maxHeight: "80vh", // Adjust as needed to fit the viewport
        }}
      >
        <Box role="tabpanel" hidden={value !== 0}>
          {value === 0 && (
            <div className="overflow-x-auto">
              <BuildingInformation />
            </div>
          )}
        </Box>
        <Box role="tabpanel" hidden={value !== 1}>
          {value === 1 && (
            <div className="overflow-x-auto">
              <FloorPlan />
            </div>
          )}
        </Box>
        <Box role="tabpanel" hidden={value !== 2}>
          {value === 2 && (
            <div className="overflow-x-auto">
              <FabricDetails />
            </div>
          )}
        </Box>
        <Box role="tabpanel" hidden={value !== 3}>
          {value === 3 && (
            <div className="overflow-x-auto">
              <Ventilation />
            </div>
          )}
        </Box>
        <Box role="tabpanel" hidden={value !== 4}>
          {value === 4 && (
            <div className="overflow-x-auto">
              <AppliancesLoad />
            </div>
          )}
        </Box>
        <Box role="tabpanel" hidden={value !== 5}>
          {value === 5 && (
            <div className="overflow-x-auto">
              <AnnualEnergyDemand />
            </div>
          )}
        </Box>
        <Box role="tabpanel" hidden={value !== 6}>
          {value === 6 && (
            <div className="overflow-x-auto">
              <SolarGainCalculation />
            </div>
          )}
        </Box>
        <Box role="tabpanel" hidden={value !== 7}>
          {value === 7 && (
            <div className="overflow-x-auto">
              <LSheetCalculation />
            </div>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default BuildingDetails;
