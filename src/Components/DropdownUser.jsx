import { useEffect, useRef, useState } from 'react';
import { BsBoxArrowLeft, BsChevronDown, BsPerson } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [roleName, setRoleName] = useState('User Role'); // Default until role is fetched
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const navigate = useNavigate();

  // Fetch user data from localStorage and determine role
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Fetch role name from /api/roles/:id
      const fetchRoleName = async () => {
        try {
          const accessToken = localStorage.getItem('accessToken');
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/roles/${parsedUser.role.$oid || parsedUser.role}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setRoleName(response.data.name || 'Unknown Role');
        } catch (error) {
          console.error('Error fetching role:', error);
          setRoleName('Unknown Role');
        }
      };

      // Handle role (since no controller exists, use the ObjectId or a fallback)
      /* if (parsedUser.role && typeof parsedUser.role === 'string') {
        setRoleName(parsedUser.role); // Use the role string if available
      } else if (parsedUser.role && parsedUser.role.$oid) {
        setRoleName(parsedUser.role.$oid); // Use the ObjectId as a fallback
      } */
     if (parsedUser.role && (parsedUser.role.$oid || parsedUser.role)) {
        fetchRoleName();
      } else {
        setRoleName('Unknown Role'); // Fallback if no role data
      }
    } else {
      // If no user is found, redirect to login
      navigate('/');
    }
  }, [navigate]);

  // Close dropdown on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // Close dropdown if the Esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  // Handle logout
  const handleLogout = () => {
    // Remove tokens and user data from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // Redirect to login page
    navigate('/');
  };

  // If user data is not loaded yet, show a placeholder
  if (!user) {
    return (
      <div className="relative">
        <div className="flex items-center gap-4 animate-pulse">
          <span className="hidden text-right lg:block">
            <span className="block h-4 w-24 bg-gray-200 rounded"></span>
            <span className="block h-3 w-16 bg-gray-200 rounded mt-1"></span>
          </span>
          <span className="h-12 w-12 rounded-full bg-gray-200"></span>
          <BsChevronDown className="hidden fill-current sm:block" size={15} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black">
            {user.staffNumber || user.email || 'User Name'}
          </span>
          <span className="block text-xs">{roleName}</span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <img src="/vite.svg" alt="User-Image" />
        </span>

        <BsChevronDown className="hidden fill-current sm:block" size={15} />
      </Link>

      {/* Dropdown Start */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-RoyalGold bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen ? 'block' : 'hidden'
        }`}
      >
        <div className='items-center flex gap-4 border-b border-taureanLightBlue px-18 py-2'>
          <span className='block font-medium text-gray-700 text-theme-sm'>
            {user.username}
          </span>
        </div>
        <ul className="flex flex-col gap-5 border-b border-taureanLightBlue px-6 py-7.5">
          <li>
            <Link
              to="/profile"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-taureanOrange lg:text-base"
            >
              <BsPerson className="fill-current" fill="none" size={22} />
              User Profile
            </Link>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-taureanOrange lg:text-base"
        >
          <BsBoxArrowLeft className="fill-current" fill="none" size={22} />
          Logout
        </button>
      </div>
      {/* Dropdown End */}
    </div>
  );
};

export default DropdownUser;