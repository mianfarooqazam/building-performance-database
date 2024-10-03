import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faBuilding,
  faFileAlt,
  faUser,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/bg.jpeg';

function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-white fixed overflow-hidden shadow-lg rounded-tr-lg rounded-br-lg border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b">
        <img src={logo} alt="Logo" className="h-8" />
      </div>
      <ul className="mt-4">
        <li className={`px-4 py-2 ${location.pathname === '/' ? 'bg-blue-500 text-white rounded-tr-lg' : 'text-gray-700'}`}>
          <Link to="/" className="flex items-center">
            <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />
            Dashboard
          </Link>
        </li>
        <li className={`px-4 py-2 ${location.pathname === '/building-details' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}>
          <Link to="/building-details" className="flex items-center">
            <FontAwesomeIcon icon={faBuilding} className="mr-2" />
            Building Details
          </Link>
        </li>
        <li className={`px-4 py-2 ${location.pathname === '/report' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}>
          <Link to="/report" className="flex items-center">
            <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
            Reports
          </Link>
        </li>
      </ul>
      <hr className="my-4" />
      <ul>
        <li className={`px-4 py-2 ${location.pathname === '/profile' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}>
          <Link to="/profile" className="flex items-center">
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Profile
          </Link>
        </li>
        <li className={`px-4 py-2 ${location.pathname === '/logout' ? 'bg-blue-500 text-white rounded-br-lg' : 'text-gray-700'}`}>
          <Link to="/logout" className="flex items-center">
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
