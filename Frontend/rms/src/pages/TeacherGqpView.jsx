import React, { useState } from 'react';
import axios from 'axios';

const TeachGqpView = () => {
  const [courseYear, setCourseYear] = useState('');
  const [semester, setSemester] = useState('');
  const [gqps, setGqps] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleFetch = async () => {
    if (!courseYear || !semester) return alert('Please select both course year and semester');
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/gqp', {
        headers: { Authorization: `Bearer ${token}` },
        params: { courseYear, semester },
      });
      setGqps(res.data);
    } catch (err) {
      alert('Failed to fetch GQPs');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/gqp/${id}/download`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });

      const blob = new Blob([res.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'GQP.pdf';
      link.click();
    } catch (err) {
      alert('Failed to download');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-300 via-white to-blue-400 min-h-screen flex flex-col items-center">
      

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10 p-6 rounded-xl shadow-lg border border-blue-300 backdrop-blur-md bg-white/30">
        <select
          value={courseYear}
          onChange={(e) => setCourseYear(e.target.value)}
          className="bg-white/40 text-gray-700 border border-gray-300 p-2 rounded w-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md"
        >
          <option value="">Select Course Year</option>
          <option value="FYBCA">FYBCA</option>
          <option value="SYBCA">SYBCA</option>
          <option value="TYBCA">TYBCA</option>
        </select>

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="bg-white/40 text-gray-700 border border-gray-300 p-2 rounded w-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md"
        >
          <option value="">Select Semester</option>
          <option value="Sem1">Sem1</option>
          <option value="Sem2">Sem2</option>
          <option value="Sem3">Sem3</option>
          <option value="Sem4">Sem4</option>
          <option value="Sem5">Sem5</option>
          <option value="Sem6">Sem6</option>
        </select>

        <button
          onClick={handleFetch}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition shadow-md"
        >
          Generate
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading...</p>
      ) : gqps.length === 0 ? (
        <p className="text-center text-red-500 text-lg">
          No Generated Papers found for selected criteria.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4">
          {gqps.map((gqp) => (
            <div
              key={gqp._id}
              className="bg-white/30 backdrop-blur-lg border border-gray-300 p-5 rounded-xl shadow-md hover:-translate-y-1 transition-transform duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{gqp.title}</h3>
              <p className="text-sm text-gray-700">
                Subject: <span className="font-medium">{gqp.subject}</span>
              </p>
              <p className="text-sm text-gray-700">
                Semester: <span className="font-medium">{gqp.semester}</span>
              </p>
              <p className="text-sm text-gray-700 mb-3">
                Uploaded At:{' '}
                <span className="font-medium">
                  {new Date(gqp.uploadedAt).toLocaleString()}
                </span>
              </p>
              <button
                onClick={() => handleDownload(gqp._id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Download 
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeachGqpView;
