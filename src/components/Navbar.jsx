import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/UserSlice';

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  let dispatch = useDispatch();
  let userStore = useSelector((state) => state.user);
  let login = userStore.login;

  return (
    <nav className="bg-gray-800 h-20 flex items-center justify-between px-4">
      <div className="flex items-center justify-between w-full">
        <Link to="/" className="text-white text-2xl font-bold">
          MyBlog
        </Link>

        {/* Mobile menu icon */}
        <div className="ml-auto lg:hidden" onClick={toggleMobileMenu}>
          <i
            className={
              isMobileMenuOpen
                ? 'fas fa-times text-white text-2xl'
                : 'fas fa-bars text-white text-2xl'
            }
          ></i>
        </div>


        {/* Profile Dropdown */}
        <div
          className="relative text-white text-lg cursor-pointer ml-4"
          onClick={toggleDropdown}
        >
          <FaUserCircle size={30} />
          {isDropdownOpen && (
            <div className="absolute top-10 right-0 bg-gray-700 rounded-lg shadow-lg p-4">
              {!login && (
                <Link to="/login" className="block text-white hover:text-blue-400 py-1">
                  Login
                </Link>
              )}
              {!login && (
                <Link to="/signup" className="block text-white hover:text-blue-400 py-1">
                  Signup
                </Link>
              )}
              {login && (
                <button
                  onClick={() => dispatch(logout())}
                  className="block text-white hover:text-blue-400 py-1"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
