import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, HomeIcon, Menu, UserRoundPen, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navItems = [
    ['Home', '/'],
    ['Search', '/search'],
    ['About', '/about'],
    ['Blogs', '/blogs'],
  ];

  const { auth, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('nav')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const isUserLoggedIn = auth.user_login || localStorage.getItem('user_login');

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo and Brand */}
            <Link to={'/'}>
              <div className="flex items-center space-x-3">
                <HomeIcon className="h-6 w-6 text-blue-600 transition-colors hover:text-blue-700" />
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  FlatMate
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <Link
                  key={item[1]} // Assign a unique key to the Link component
                  to={item[1]} // Use the 'to' property from the object
                >
                  <Button
                    variant="ghost"
                    className={`hover:bg-blue-50 hover:text-blue-600 transition-colors `}
                  >
                    {item[0]} {/* Use the 'name' property from the object */}
                  </Button>
                </Link>
              ))}
              {
                isUserLoggedIn == 'false' || isUserLoggedIn == null ?
                  <Link
                    key={'/auth'} // Assign a unique key to the Link component
                    to={'/auth'} // Use the 'to' property from the object
                  >
                    <Button
                      variant="ghost"
                      className={`transition-colors bg-blue-600 text-white hover:bg-blue-700 hover:text-white`}
                    >
                      Sign Up {/* Use the 'name' property from the object */}
                    </Button>
                  </Link> :
                  <Link
                    key={'/dashboard'} // Assign a unique key to the Link component
                    to={'/dashboard'} // Use the 'to' property from the object
                  >
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="icon">
                        <UserRoundPen className="h-5 w-5" />
                      </Button>
                    </div>
                  </Link>
              }
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hover:bg-blue-50"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 text-gray-600" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0 pointer-events-none'
              }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item, index) => (
                <Button
                  key={item}
                  variant="ghost"
                  className={`w-full justify-start text-left hover:bg-blue-50 hover:text-blue-600 transition-colors ${index === navItems.length - 1 ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white' : ''
                    }`}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer div with dynamic height matching navbar */}
      <div className="h-16 w-full" />
    </>
  );
};

export default Navbar;