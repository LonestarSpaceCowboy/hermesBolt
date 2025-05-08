import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, MenuIcon, Settings, X, Inbox, CheckSquare, User } from 'lucide-react';
import Button from './ui/Button';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigation = [
    { name: 'Calendar', href: '/dashboard', icon: <CalendarDays size={20} /> },
    { name: 'Tasks', href: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Requests', href: '/requests', icon: <Inbox size={20} /> },
    { name: 'Settings', href: '/settings', icon: <Settings size={20} /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path 
      ? 'text-primary-600 dark:text-primary-400 font-medium' 
      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400';
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">Hermes</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
            {user && navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${isActive(item.href)} inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  location.pathname === item.href 
                    ? 'border-primary-500' 
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            {!user ? (
              <div className="flex space-x-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">Sign up</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center ml-3">
                <Link to="/profile">
                  <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
                    <User size={18} />
                  </div>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-900 shadow-lg animate-fade-in">
          <div className="pt-2 pb-3 space-y-1">
            {user && navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive(item.href)
                } block pl-3 pr-4 py-2 text-base font-medium border-l-4 ${
                  location.pathname === item.href
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </div>
              </Link>
            ))}
            
            {!user ? (
              <div className="px-4 py-3 space-y-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" fullWidth>Log in</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="primary" fullWidth>Sign up</Button>
                </Link>
              </div>
            ) : (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
                <div className="px-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
                    <User size={20} />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link 
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;