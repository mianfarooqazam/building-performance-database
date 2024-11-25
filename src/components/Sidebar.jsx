// src/components/Sidebar.jsx

import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faBuilding,
  faFileAlt,
  faUser,
  faSignOutAlt,
  faCircleInfo
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/berc-logo.webp";

function Sidebar({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoutClick = (e) => {
    e.preventDefault();
    onLogout(); // Call the logout function passed from App
    navigate('/'); // Redirect to login page
  };

  return (
    <div
      className="w-64 h-screen fixed shadow-lg rounded-tr-lg rounded-br-lg border-r border-gray-200 flex flex-col"
      style={{ backgroundColor: "#fafafa" }}
    >
      <div className="flex items-center justify-center h-20">
        <img src={logo} alt="Logo" className="h-20" />
      </div>
      <hr className="my-4" />

      <ul className="mt-8 flex-1">
        {/* Dashboard Link */}
        <li
          className={`mb-2 transition-all duration-300 ease-in-out ${
            location.pathname === "/"
              ? "bg-blue-500 text-white rounded-r-full shadow-md"
              : "text-gray-500 hover:bg-blue-200 hover:shadow-inner"
          }`}
        >
          <Link to="/" className="flex items-center px-6 py-4 w-full h-full">
            <FontAwesomeIcon icon={faTachometerAlt} className="mr-3 text-lg" />
            <span className="font-medium text-lg">Dashboard</span>
          </Link>
        </li>

        {/* Building Details Link */}
        <li
          className={`mb-2 transition-all duration-300 ease-in-out ${
            location.pathname === "/building-details"
              ? "bg-blue-500 text-white rounded-r-full shadow-md"
              : "text-gray-500 hover:bg-blue-200 hover:shadow-inner"
          }`}
        >
          <Link to="/building-details" className="flex items-center px-6 py-4 w-full h-full">
            <FontAwesomeIcon icon={faBuilding} className="mr-3 text-lg" />
            <span className="font-medium text-lg">Building Details</span>
          </Link>
        </li>

        {/* Reports Link */}
        <li
          className={`mb-2 transition-all duration-300 ease-in-out ${
            location.pathname === "/report"
              ? "bg-blue-500 text-white rounded-r-full shadow-md"
              : "text-gray-500 hover:bg-blue-200 hover:shadow-inner"
          }`}
        >
          <Link to="/report" className="flex items-center px-6 py-4 w-full h-full">
            <FontAwesomeIcon icon={faFileAlt} className="mr-3 text-lg" />
            <span className="font-medium text-lg">Reports</span>
          </Link>
        </li>
      </ul>

      <hr className="my-4" />

      <ul>
        {/* Profile Link */}
        <li
          className={`mb-2 transition-all duration-300 ease-in-out ${
            location.pathname === "/profile"
              ? "bg-blue-500 text-white rounded-l-full shadow-md"
              : "text-gray-500 hover:bg-gray-100 hover:shadow-inner"
          }`}
        >
          <Link to="/profile" className="flex items-center px-6 py-4 w-full h-full">
            <FontAwesomeIcon icon={faUser} className="mr-3 text-lg" />
            <span className="font-medium text-lg">Profile</span>
          </Link>
        </li>
 {/* Tool Link */}
 <li
          className={`mb-2 transition-all duration-300 ease-in-out ${
            location.pathname === "/tool"
              ? "bg-blue-500 text-white rounded-l-full shadow-md"
              : "text-gray-500 hover:bg-gray-100 hover:shadow-inner"
          }`}
        >
          <Link to="/profile" className="flex items-center px-6 py-4 w-full h-full">
            <FontAwesomeIcon icon={faCircleInfo} className="mr-3 text-lg" />
            <span className="font-medium text-lg">Tool Tutorial</span>
          </Link>
        </li>

        {/* Logout Link */}
        <li
          className={`mb-2 transition-all duration-300 ease-in-out text-red-500 hover:bg-red-100 hover:shadow-inner`}
        >
          <a
            href="#"
            onClick={handleLogoutClick}
            className="flex items-center px-6 py-4 w-full h-full"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-lg" />
            <span className="font-medium text-lg">Logout</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
