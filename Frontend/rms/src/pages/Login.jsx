import React from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthForm from '@/components/AuthForm';
import api from '@/services/api';
import { toast } from 'sonner';

export default function Login() {
  const { login } = useAuth();

  const onSubmit = async ({ email, password }) => {
    try {
      const res = await api.post('/login', { email, password });
      login(res.data.token);
      toast.success('Logged in');
    } catch {
      toast.error('Login failed');
    }
  };

  return <AuthForm onSubmit={onSubmit} />;
}