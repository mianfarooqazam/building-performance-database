import { useEffect } from 'react';
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
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
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
import useFloorPlanStore from '../../store/useFloorPlanStore.js';

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
    refrigeratorType,
    setRefrigeratorType,
    appliances,
    addAppliance,
    removeAppliance,
    eui,
    setEui,
  } = useAppliancesLoadStore();

  const { totalFloorArea } = useFloorPlanStore();

  const handleAddAppliance = () => {
    if (appliance === "Refrigerator") {
      if (manufacturer && refrigeratorType && quantity) {
        const qty = parseInt(quantity);
        const typeValue = parseInt(refrigeratorType);
        if (qty > 0) {
          const annualEnergy = qty * typeValue;
          const newAppliance = {
            appliance,
            manufacturer,
            quantity: qty,
            annualEnergy: parseFloat(annualEnergy),
          };
          addAppliance(newAppliance);

          // Reset input fields
          setAppliance("");
          setManufacturer("");
          setQuantity("");
          setRefrigeratorType("");
        }
      }
    } else {
      if (
        appliance &&
        manufacturer &&
        quantity &&
        dailyHourUsage &&
        wattage &&
        dailyHourUsage >= 1 &&
        dailyHourUsage <= 24
      ) {
        const qty = parseInt(quantity);
        const watt = parseFloat(wattage);
        const usage = parseFloat(dailyHourUsage);
        if (qty > 0 && watt > 0) {
          const annualEnergy = (
            (qty * watt * usage * 365) /
            1000
          ).toFixed(2);
          const newAppliance = {
            appliance,
            manufacturer,
            quantity: qty,
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
      }
    }
  };

  // Calculate total annual energy
  const totalAnnualEnergy = appliances
    .reduce((total, item) => total + item.annualEnergy, 0)
    .toFixed(2);

  // Calculate EUI whenever totalAnnualEnergy or totalFloorArea changes
  useEffect(() => {
    if (totalFloorArea > 0) {
      const floorAreaInM2 = totalFloorArea * 0.092903;
      const calculatedEui = (totalAnnualEnergy / floorAreaInM2).toFixed(2);
      setEui(calculatedEui);
    } else {
      setEui(0);
    }
  }, [totalAnnualEnergy, totalFloorArea, setEui]);

  return (
    <Box p={3} maxWidth={1200} margin="0 auto">
      <Box display="flex" gap={2}>
        {/* Inputs Section */}
        <Box width="55%">
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
                  setQuantity("");
                  setDailyHourUsage("");
                  setWattage("");
                  setRefrigeratorType("");
                }}
              >
                {applianceOptions.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Conditional Inputs */}
            {appliance === "Refrigerator" ? (
              <>
                {/* Manufacturer Input */}
                <FormControl fullWidth>
                  <InputLabel id="manufacturer-label">Manufacturer</InputLabel>
                  <Select
                    labelId="manufacturer-label"
                    value={manufacturer}
                    label="Manufacturer"
                    onChange={(e) => setManufacturer(e.target.value)}
                  >
                    {manufacturerMap["Refrigerator"].map((manu, index) => (
                      <MenuItem key={index} value={manu}>
                        {manu}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Refrigerator Type Input */}
                <FormControl fullWidth>
                  <InputLabel id="refrigerator-type-label">
                    Refrigerator Type
                  </InputLabel>
                  <Select
                    labelId="refrigerator-type-label"
                    value={refrigeratorType || ""}
                    label="Refrigerator Type"
                    onChange={(e) => setRefrigeratorType(e.target.value)}
                  >
                    <MenuItem value="360">Star Rating (360 kWh)</MenuItem>
                    <MenuItem value="420">Conventional (420 kWh)</MenuItem>
                  </Select>
                </FormControl>

                {/* Quantity Input */}
                <TextField
                  label="Quantity"
                  variant="outlined"
                  fullWidth
                  type="number"
                  slotProps={{ input: { min: 1 } }}
                  value={quantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || parseInt(value) > 0) {
                      setQuantity(value);
                    }
                  }}
                />

                {/* Info Icon with Text */}
                <Box display="flex" alignItems="center" gap={1}>
                  <InfoIcon color="info" />
                  <Typography variant="body2">
                    Conventional and star rating for refrigerator only
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                {/* Manufacturer Input */}
                <FormControl fullWidth>
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
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || parseInt(value) > 0) {
                        setQuantity(value);
                      }
                    }}
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
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || parseFloat(value) > 0) {
                      setWattage(value);
                    }
                  }}
                />
              </>
            )}

            {/* Add Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddAppliance}
              disabled={
                appliance === "Refrigerator"
                  ? !manufacturer || !quantity || !refrigeratorType
                  : !appliance ||
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
        <Box width="45%">
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
                    S.No
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "lightblue",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Appliances
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
                    <TableCell sx={{ textAlign: "center" }}>
                      {index + 1}
                    </TableCell>
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
          {/* Display EUI */}
          <Box
            p={2}
            mt={2}
            bgcolor="lightgreen"
            borderRadius={2}
            fontWeight="bold"
            textAlign="center"
          >
            Energy Utilization Index (EUI): {eui} kWh/m²
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AppliancesLoad;
