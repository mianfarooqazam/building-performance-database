import { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import {
  FanManufacturer,
  OvenManufacturer,
  WashingMachineManufacturer,
  RefrigeratorManufacturer,
  VacuumManufacturer,
  HeaterManufacturer,
  IronManufacturer,
  TVManufacturer,
  WaterPumpManufacturer,
} from "../../utils/appliances/AppliancesData.js";

const applianceOptions = [
  "Fan",
  "Oven",
  "Washing Machine",
  "Refrigerator",
  "Vacuum",
  "Heater",
  "Iron",
  "TV",
  "Water Pump",
];

const manufacturerMap = {
  Fan: FanManufacturer,
  Oven: OvenManufacturer,
  "Washing Machine": WashingMachineManufacturer,
  Refrigerator: RefrigeratorManufacturer,
  Vacuum: VacuumManufacturer,
  Heater: HeaterManufacturer,
  Iron: IronManufacturer,
  TV: TVManufacturer,
  "Water Pump": WaterPumpManufacturer,
};

function AppliancesLoad() {
  const [appliance, setAppliance] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dailyHourUsage, setDailyHourUsage] = useState("");
  const [wattage, setWattage] = useState("");
  const [appliances, setAppliances] = useState([]);

  const handleAddAppliance = () => {
    if (appliance && manufacturer && quantity && dailyHourUsage && wattage) {
      const annualEnergy = (
        (parseFloat(quantity) *
          parseFloat(wattage) *
          parseFloat(dailyHourUsage) *
          365) /
        1000
      ).toFixed(2);
      const newAppliance = {
        appliance,
        quantity: parseInt(quantity),
        annualEnergy: parseFloat(annualEnergy),
      };
      setAppliances([...appliances, newAppliance]);
      setAppliance("");
      setManufacturer("");
      setQuantity("");
      setDailyHourUsage("");
      setWattage("");
    }
  };

  const totalAnnualEnergy = appliances
    .reduce((total, item) => total + item.annualEnergy, 0)
    .toFixed(2);

  return (
    <Box p={3} maxWidth={1200} margin="0 auto">
      <Box display="flex" gap={2}>
        {/* Inputs Section */}
        <Box width="60%">
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Appliance Input */}
            <FormControl fullWidth>
              <InputLabel id="appliance-label">Appliance</InputLabel>
              <Select
                labelId="appliance-label"
                value={appliance}
                label="Appliance"
                onChange={(e) => {
                  setAppliance(e.target.value);
                  setManufacturer("");
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
            <FormControl fullWidth disabled={!appliance}>
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

            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
            >
              {/* Quantity Input */}
              <TextField
                label="Quantity"
                variant="outlined"
                fullWidth
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
                type="number"
                slotProps={{ htmlInput: { min: 1, max: 24 } }}
                value={dailyHourUsage}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 && value <= 24) {
                    setDailyHourUsage(value);
                  } else if (e.target.value === "") {
                    setDailyHourUsage("");
                  }
                }}
              />
            </Box>

            {/* Wattage Input */}
            <TextField
              label="Wattage (W)"
              variant="outlined"
              fullWidth
              type="number"
              slotProps={{ htmlInput: { min: 1 } }}
              value={wattage}
              onChange={(e) => setWattage(e.target.value)}
            />

            {/* Add Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddAppliance}
              disabled={
                !appliance ||
                !manufacturer ||
                !quantity ||
                !dailyHourUsage ||
                !wattage
              }
            >
              Add Appliance
            </Button>
          </Box>
        </Box>

        {/* Vertical Divider */}
        <Divider orientation="vertical" flexItem />

        {/* Table Section */}
        <Box width="40%">
          <Table sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: "lightblue",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Appliance
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "lightblue",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "lightblue",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Annual Energy (kWh)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appliances.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ textAlign: "center" }}>{item.appliance}</TableCell>
                    <TableCell sx={{ textAlign: "center" }} align="right">{item.quantity}</TableCell>
                    <TableCell sx={{ textAlign: "center" }} align="right">{item.annualEnergy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          <Box
            p={2}
            mt={2}
            bgcolor="lightblue"
            borderRadius={2}
            fontWeight="bold"
            textAlign="center"
          >
            Total Annual Energy: {totalAnnualEnergy} kWh
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AppliancesLoad;
