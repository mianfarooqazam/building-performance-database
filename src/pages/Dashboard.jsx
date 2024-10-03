import { Card, CardContent, Typography } from '@mui/material';

function Dashboard() {
  return (
    <div className="p-4">
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="div">
            Dashboard
          </Typography>
          <Typography variant="body2">
            Placeholder for charts and reports.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
