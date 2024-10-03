import { Tabs, Tab, Box } from '@mui/material';
import { useState } from 'react';

function Report() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="p-4">
      <Tabs value={value} onChange={handleChange} aria-label="Report Tabs" indicatorColor="primary">
        <Tab label="Summary" />
        <Tab label="Certificate" />
        <Tab label="Suggestion" />
      </Tabs>
      <Box role="tabpanel" hidden={value !== 0} p={3}>
        <p>Summary report data...</p>
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
