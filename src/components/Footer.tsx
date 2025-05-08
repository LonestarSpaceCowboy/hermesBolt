import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400">Hermes</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md">
              Inbox Today. Done Tomorrow. Never miss another commitment or opportunity with our intelligent email-to-calendar conversion.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <span className="sr-only">Twitter</span>
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <span className="sr-only">GitHub</span>
                <Github size={20} />
              </a>
              <a href="mailto:info@hermesapp.com" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <span className="sr-only">Email</span>
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/features" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/how-to" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                  How-to Guides
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                  About
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Hermes. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;