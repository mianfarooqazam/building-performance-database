import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import RoofFabricDetails from "../tabs/fabricDetails/RoofFabricDetails";
import WallFarbricDetails from "../tabs/fabricDetails/WallFabricDetails";

function FabricDetails() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box p={3}>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Roof Details" />
        <Tab label="Wall Details" />
      </Tabs>
      {selectedTab === 0 && <RoofFabricDetails />}
      {selectedTab === 1 && <WallFarbricDetails />}
    </Box>
  );
}

export default FabricDetails;
