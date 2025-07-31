import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import api from '@/services/api';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then(res => setUsers(res.data));
  }, []);

  const toggle = (id, status) => {
    api
      .patch(`/admin/user/${id}/status`, { status: status === 'active' ? 'inactive' : 'active' })
      .then(() => {
        toast.success('Updated');
        api.get('/admin/users').then(r => setUsers(r.data));
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6 space-y-6 max-w-4xl mx-auto">
      {users.map(u => (
        <Card
          key={u._id}
          className="rounded-2xl shadow-md border border-blue-100 bg-white hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg text-blue-700">{u.name}</CardTitle>
              <p className="text-sm text-gray-600">{u.email} · {u.role}</p>
            </div>
            <Button
              onClick={() => toggle(u._id, u.status)}
              className={`px-4 py-2 rounded-xl text-white ${
                u.status === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {u.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
