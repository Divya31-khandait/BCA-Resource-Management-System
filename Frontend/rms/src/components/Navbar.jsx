import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { role, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-white shadow z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Brand */}
        <Link to="/" className="text-2xl font-bold text-blue-700 hover:text-blue-900 transition duration-200">
          RMS
        </Link>

        {/* Nav Items */}
        <div className="flex items-center space-x-4">
          {!role && (
            <>
              <Link to="/" className="text-blue-700 hover:text-blue-900 font-medium transition duration-200">
                Home
              </Link>
              <Link to="about" className="text-blue-700 hover:text-blue-900 font-medium transition duration-200">
                About
              </Link>
              <Link to="/login" className="text-blue-700 hover:text-blue-900 font-medium transition duration-200">
                Login
              </Link>
              <Link to="/register" className="text-blue-700 hover:text-blue-900 font-medium transition duration-200">
                Register
              </Link>
            </>
          )}
          {role === 'student' && (
            <>
              <Link to="/student" className="text-blue-700 hover:text-blue-900 font-medium transition duration-200">
                Dashboard
              </Link>
              <Button 
                variant="solid" 
                size="sm" 
                onClick={logout} 
                className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
              >
                Logout
              </Button>
            </>
          )}
          {role === 'teacher' && (
            <>
              <Link to="/teacher/upload" className="text-blue-700 hover:text-blue-900 font-medium transition duration-200">
                Upload
              </Link>
              <Link to="/student" className="text-blue-700 hover:text-blue-900 font-medium transition duration-200">
                Resources
              </Link>
              <Link to="/teacher/gqp-view" className="text-blue-700 hover:text-blue-900 font-medium transition duration-200">
                Generate Papers
              </Link>

              <Button 
                variant="solid" 
                size="sm" 
                onClick={logout} 
                className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
              >
                Logout
              </Button>
            </>
          )}
          {role === 'admin' && (
            <>
              <Link to="/admin/users" className="text-blue-700 hover:text-blue-900 font-medium transition duration-200">
                Manage Users
              </Link>
              <Link to="/student" className="text-blue-700 hover:text-blue-900 font-medium transition duration-200">
                Resources
              </Link>
              <Link to="/teacher/upload" className="text-blue-700 hover:text-blue-900 font-medium transition duration-200">
                Upload
              </Link>
              
              <Button 
                variant="solid" 
                size="sm" 
                onClick={logout} 
                className="bg-red-500 text-white hover:bg-red-700 focus:ring-red-500 py-1.5 rounded-full"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
