import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-3 px-4">
      <div className="max-w-4xl mx-auto mt-10 px-6 py-10 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-blue-100">
        <h2 className="text-4xl font-bold text-blue-700 mb-6 text-center">About BCA Resource Management System</h2>

        {/* Objective */}
        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">🎯 Objective</h3>
          <p className="text-gray-800 text-lg">
            The BCA Academic Resource Management System is designed to provide a centralized platform for students and teachers to easily
            access and manage academic materials like notes, eBooks, and previous year question papers.
          </p>
        </section>

        {/* Goals */}
        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">✅ Goals</h3>
          <ul className="list-disc list-inside text-gray-800 text-lg space-y-1">
            <li>Provide semester-wise academic resources to students.</li>
            <li>Allow teachers to upload, organize, and manage learning materials.</li>
            <li>Save time and improve academic outcomes by consolidating resources in one place.</li>
          </ul>
        </section>

        {/* Future Scope */}
        <section>
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">🚀 Future Scope</h3>
          <p className="text-gray-800 text-lg">
            The system can be expanded to support multiple universities, dynamic resource sharing, AI-based material recommendations, and better
            integration with learning analytics. It has the potential to become a comprehensive academic toolkit.
          </p>
        </section>
      </div>
    </div>
  );
}
