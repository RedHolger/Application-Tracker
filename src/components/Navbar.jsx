import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Plus } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
            <GraduationCap className="h-8 w-8" />
            <span>Master's Tracker</span>
          </Link>
          <Link
            to="/add"
            className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Application</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
