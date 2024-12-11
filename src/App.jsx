// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import Sidebar from './components/Sidebar';
// import Dashboard from './pages/Dashboard';
// import BuildingDetails from './pages/BuildingDetails';
// import Report from './pages/Report';
// import Login from './auth/Login';
// import SignUp from './auth/SignUp';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Check for token on component mount
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     setIsLoggedIn(!!token);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setIsLoggedIn(false);
//     toast.info('Logged out successfully.');
//   };

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <Router>
//         <div className="flex overflow-x-hidden">
//           {isLoggedIn ? (
//             <>
//               <Sidebar onLogout={handleLogout} />
//               <div className="flex-1 bg-[#fafafa] ml-64 min-h-screen p-4 overflow-x-hidden">
//                 <Routes>
//                   <Route path="/" element={<Dashboard />} />
//                   <Route path="/building-details" element={<BuildingDetails />} />
//                   <Route path="/report" element={<Report />} />
//                   <Route path="*" element={<Navigate to="/" />} />
//                 </Routes>
//               </div>
//             </>
//           ) : (
//             <Routes>
//               <Route path="/" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
//               <Route path="/signup" element={<SignUp />} />
//               <Route path="*" element={<Navigate to="/" />} />
//             </Routes>
//           )}
//         </div>
//       </Router>
//     </>
//   );
// }

// export default App;



import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import BuildingDetails from './pages/BuildingDetails';
import Report from './pages/Report';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.info('Logged out successfully.');
    // Optionally, you can redirect to a different page or perform other actions after logout
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <div className="flex overflow-x-hidden">
          <Sidebar onLogout={handleLogout} />
          <div className="flex-1 bg-[#fafafa] ml-64 min-h-screen p-4 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/building-details" element={<BuildingDetails />} />
              <Route path="/report" element={<Report />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
