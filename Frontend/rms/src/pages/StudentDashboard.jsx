import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import api from '@/services/api';
import React, { useEffect, useState } from 'react';

export default function StudentDashboard() {
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({
    year: '',
    semester: '',
    type: '',
  });

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { year, semester, type } = filters;
        const params = {};
        if (year) params.year = year;
        if (semester) params.semester = semester;
        if (type) params.type = type;
        const res = await api.get('/resources', { params });
        setResources(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchResources();
  }, [filters]);

  const handleDownload = async (id) => {
    try {
      const response = await api.get(`/resources/${id}/download`, {
        responseType: 'blob',
      });

      const contentType = response.headers['content-type'] || 'application/octet-stream';
      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const disposition = response.headers['content-disposition'];
      let filename = 'download';
      if (disposition) {
        const match = disposition.match(/filename="?(.+)"?/);
        if (match && match[1]) filename = match[1];
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error', err);
    }
  };

  const handleView = (id) => {
    // View functionality (e.g., opening the resource in a modal or new page)
    window.open(`/view-resource/${id}`, '_blank'); // Open the resource in a new tab or modal
  };

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-300 via-white to-blue-400 min-h-screen">
      {/* Filter Controls */}
      <div className="mb-6 flex flex-wrap gap-4 bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
        <div className="flex-1">
          <label htmlFor="year" className="block text-sm font-semibold text-gray-600 mb-1">Year</label>
          <select
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:bg-blue-100"
          >
            <option value="">All Years</option>
            <option value="FYBCA">FYBCA</option>
            <option value="SYBCA">SYBCA</option>
            <option value="TYBCA">TYBCA</option>
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="semester" className="block text-sm font-semibold text-gray-700 mb-1">Semester</label>
          <select
            name="semester"
            value={filters.semester}
            onChange={handleFilterChange}
            className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 transition hover:bg-teal-50"
          >
            <option value="">All Semesters</option>
            <option value="Sem1">Sem1</option>
            <option value="Sem2">Sem2</option>
            <option value="Sem3">Sem3</option>
            <option value="Sem4">Sem4</option>
            <option value="Sem5">Sem5</option>
            <option value="Sem6">Sem6</option>
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 transition hover:bg-teal-50"
          >
            <option value="">All Types</option>
            <option value="notes">Notes</option>
            <option value="ebook">eBooks</option>
            <option value="questionpaper">Question Papers</option>
          </select>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map(r => (
          <Card
            key={r._id}
            className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02]"
          >
            <CardContent className="p-5 space-y-3">
              <CardTitle className="text-lg font-bold text-gray-800">{r.title}</CardTitle>
              <p className="text-sm text-gray-600">
                {r.subject} · {r.year} · {r.semester}
              </p>
              <div className="space-x-3">
                <Button
                  onClick={() => handleDownload(r._id)}
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Download
                </Button>
                <Button
                  onClick={() => handleView(r._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {resources.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No resources found.
          </p>
        )}
      </div>
    </div>
  );
}
