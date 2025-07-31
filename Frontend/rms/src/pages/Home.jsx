import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative bg-gradient-to-br from-blue-100 via-white to-blue-200 text-gray-900 py-24 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 leading-tight mb-6 drop-shadow-md">
          Welcome to the BCA Resource Management System
        </h1>
        <p className="text-lg sm:text-xl mb-10 text-gray-700">
          An efficient platform designed to help BCA students and teachers manage academic resources like notes, eBooks, and question papers seamlessly.
        </p>
        <div className="flex justify-center gap-6">
          <Link
            to="/about"
            className="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded-full text-lg font-semibold hover:bg-blue-50 transition duration-300 shadow"
          >
            Learn More
          </Link>
          <Link
            to="/Register"
            className="bg-blue-600 text-white px-6 py-2 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
