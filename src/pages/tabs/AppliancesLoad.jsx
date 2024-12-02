// AppliancesLoad.jsx
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
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
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
import useAppliancesLoadStore from "../../store/useAppliancesLoadStore.js";

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
  const {
    appliance,
    setAppliance,
    manufacturer,
    setManufacturer,
    quantity,
    setQuantity,
    dailyHourUsage,
    setDailyHourUsage,
    wattage,
    setWattage,
    appliances,
    addAppliance,
    removeAppliance,
  } = useAppliancesLoadStore();

  const handleAddAppliance = () => {
    if (
      appliance &&
      manufacturer &&
      quantity &&
      dailyHourUsage &&
      wattage &&
      dailyHourUsage >= 1 &&
      dailyHourUsage <= 24
    ) {
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
      addAppliance(newAppliance);

      // Reset input fields
      setAppliance("");
      setManufacturer("");
      setQuantity("");
      setDailyHourUsage("");
      setWattage("");
    }
  };

  // Calculate total annual energy
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
                slotProps={{ input: { min: 1 } }}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              {/* Daily Hour Usage Input */}
              <TextField
                label="Daily Hour Usage"
                variant="outlined"
                fullWidth
                type="number"
                slotProps={{ input: { min: 1, max: 24 } }}
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
              slotProps={{ input: { min: 1 } }}
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
          <Typography variant="h6" gutterBottom>
            Annual Energy Consumption
          </Typography>
          <TableContainer component={Paper}>
            <Table>
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
                  <TableCell
                    sx={{
                      backgroundColor: "lightblue",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appliances.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell
                      sx={{ textAlign: "center" }}
                      component="th"
                      scope="row"
                    >
                      {item.appliance}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {item.quantity}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {item.annualEnergy}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton
                        color="error"
                        onClick={() => removeAppliance(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
