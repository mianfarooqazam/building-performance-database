import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import BuildingDetails from './pages/BuildingDetails';
import Report from './pages/Report';

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-[#fafafa] ml-64 min-h-screen p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/building-details" element={<BuildingDetails />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
