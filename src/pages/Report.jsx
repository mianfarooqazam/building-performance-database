
import { Tabs, Tab, Box } from '@mui/material';
import { useState } from 'react';
import useBuildingInformationStore from '../store/useBuildingInformationStore';
import useFloorPlanStore from '../store/useFloorPlanStore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function Report() {
  const [value, setValue] = useState(0);

  // Access data from the stores
  const {
    ownerName,
    address,
    plotNo,
    streetNo,
    postalCode,
    selectedState,
    selectedCity,
  } = useBuildingInformationStore();

  const {
    buildingOrientation,
    numberOfFloors,
    wallLengths,
    wallHeight,
    totalFloorArea,
    windowOrientation,
    windowArea,
  } = useFloorPlanStore();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Prepare data for the summary table
  const summaryData = [
    { label: 'Owner Name', value: ownerName },
    { label: 'Address', value: address },
    { label: 'Plot No.', value: plotNo },
    { label: 'Street No.', value: streetNo },
    { label: 'Postal Code', value: postalCode },
    { label: 'State/Province', value: selectedState },
    { label: 'City', value: selectedCity },
    { label: 'Building Orientation', value: buildingOrientation },
    { label: 'Number of Floors', value: numberOfFloors },
    { label: 'Wall Height (ft)', value: wallHeight },
    { label: 'Total Floor Area (ft²)', value: totalFloorArea },
    // Wall lengths
    ...Object.entries(wallLengths).map(([key, value]) => ({ label: key, value })),
    // Window details
    { label: 'Window Orientation', value: windowOrientation },
    { label: 'Window Area (ft²)', value: windowArea },
  ];

  return (
    <div className="p-4">
      <Tabs value={value} onChange={handleChange} aria-label="Report Tabs" indicatorColor="primary">
        <Tab label="Summary" />
        <Tab label="Certificate" />
        <Tab label="Suggestion" />
      </Tabs>
      <Box role="tabpanel" hidden={value !== 0} p={3}>
        {/* Summary Tab Content */}
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {summaryData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell><strong>{item.label}</strong></TableCell>
                  <TableCell>{item.value || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box role="tabpanel" hidden={value !== 1} p={3}>
        <p>Certificate data...</p>
      </Box>
      <Box role="tabpanel" hidden={value !== 2} p={3}>
        <p>Suggestions data...</p>
      </Box>
    </div>
  );
}

export default Report;
