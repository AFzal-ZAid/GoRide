import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Car, LogOut, MapPin, Menu, User, X } from 'lucide-react';
import Button from './Button';
import Logo from './Logo';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Logo className="h-10 w-auto" />
              <span className="ml-2 text-xl font-bold text-primary-900">RideShare</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                {user?.userType === 'rider' ? (
                  <>
                    <Link 
                      to="/rider/dashboard" 
                      className="text-neutral-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/rider/book" 
                      className="text-neutral-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Book a Ride
                    </Link>
                    <Link 
                      to="/rider/history" 
                      className="text-neutral-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Ride History
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/driver/dashboard" 
                      className="text-neutral-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/driver/rides" 
                      className="text-neutral-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Available Rides
                    </Link>
                  </>
                )}
                <div className="relative ml-3">
                  <div className="flex">
                    <Link 
                      to="/profile" 
                      className="text-neutral-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      <User size={16} className="mr-1" /> Profile
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="text-neutral-700 hover:text-error-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      <LogOut size={16} className="mr-1" /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-neutral-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log In
                </Link>
                <Button
                  onClick={() => navigate('/register')}
                  size="sm"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                {user?.userType === 'rider' ? (
                  <>
                    <Link 
                      to="/rider/dashboard" 
                      className="text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <MapPin size={18} className="mr-2" /> Dashboard
                      </div>
                    </Link>
                    <Link 
                      to="/rider/book" 
                      className="text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <Car size={18} className="mr-2" /> Book a Ride
                      </div>
                    </Link>
                    <Link 
                      to="/rider/history" 
                      className="text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <User size={18} className="mr-2" /> Ride History
                      </div>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/driver/dashboard" 
                      className="text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <MapPin size={18} className="mr-2" /> Dashboard
                      </div>
                    </Link>
                    <Link 
                      to="/driver/rides" 
                      className="text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <Car size={18} className="mr-2" /> Available Rides
                      </div>
                    </Link>
                  </>
                )}
                <Link 
                  to="/profile" 
                  className="text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <User size={18} className="mr-2" /> Profile
                  </div>
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }} 
                  className="text-neutral-700 hover:bg-neutral-100 hover:text-error-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  <div className="flex items-center">
                    <LogOut size={18} className="mr-2" /> Logout
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;