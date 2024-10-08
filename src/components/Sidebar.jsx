import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faBuilding,
  faFileAlt,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/berc-logo.webp";

function Sidebar() {
  const location = useLocation();

  return (
    <div
      className="w-64 h-screen fixed shadow-lg rounded-tr-lg rounded-br-lg border-r border-gray-200 flex flex-col"
      style={{ backgroundColor: "#fafafa" }}
    >
      <div className="flex items-center justify-center h-20">
        <img src={logo} alt="Logo" className="h-20" /> {/* Larger logo */}
      </div>
      <hr className="my-4" />

      <ul className="mt-8 flex-1">
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
        <li
          className={`mb-2 transition-all duration-300 ease-in-out ${
            location.pathname === "/building-details"
              ? "bg-blue-500 text-white rounded-r-full shadow-md"
              : "text-gray-500 hover:bg-blue-200 hover:shadow-inner"
          }`}
        >
          <Link
            to="/building-details"
            className="flex items-center px-6 py-4 w-full h-full"
          >
            <FontAwesomeIcon icon={faBuilding} className="mr-3 text-lg" />
            <span className="font-medium text-lg">Building Details</span>
          </Link>
        </li>
        <li
          className={`mb-2 transition-all duration-300 ease-in-out ${
            location.pathname === "/report"
              ? "bg-blue-500 text-white rounded-r-full shadow-md"
              : "text-gray-500 hover:bg-blue-200 hover:shadow-inner"
          }`}
        >
          <Link
            to="/report"
            className="flex items-center px-6 py-4 w-full h-full"
          >
            <FontAwesomeIcon icon={faFileAlt} className="mr-3 text-lg" />
            <span className="font-medium text-lg">Reports</span>
          </Link>
        </li>
      </ul>

      <hr className="my-4" />

      <ul>
        <li
          className={`mb-2 transition-all duration-300 ease-in-out ${
            location.pathname === "/profile"
              ? "bg-blue-500 text-white rounded-l-full shadow-md"
              : "text-gray-500 hover:bg-gray-100 hover:shadow-inner"
          }`}
        >
          <Link
            to="/profile"
            className="flex items-center px-6 py-4 w-full h-full"
          >
            <FontAwesomeIcon icon={faUser} className="mr-3 text-lg" />
            <span className="font-medium text-lg">Profile</span>
          </Link>
        </li>
        <li
          className={`mb-2 transition-all duration-300 ease-in-out ${
            location.pathname === "/logout"
              ? "bg-red-500 text-white rounded-l-full shadow-md"
              : "text-red-500 hover:bg-red-100 hover:shadow-inner"
          }`}
        >
          <Link
            to="/logout"
            className="flex items-center px-6 py-4 w-full h-full"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-lg" />
            <span className="font-medium text-lg">Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
