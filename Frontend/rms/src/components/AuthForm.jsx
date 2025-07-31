import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';

export default function AuthForm({ onSubmit, isRegister }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-3 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-12 p-8 space-y-5 bg-white rounded-2xl shadow-lg border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">
          {isRegister ? 'Registration Form' : 'Login Form'}
        </h2>

        {isRegister && (
          <Input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="bg-gray-50"
          />
        )}

        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="bg-gray-50"
        />

        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="bg-gray-50"
        />

        {isRegister && (
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        )}

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          {isRegister ? 'Register' : 'Login'}
        </Button>
      </form>
    </div>
  );
}
