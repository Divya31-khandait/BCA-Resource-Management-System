import AuthForm from '@/components/AuthForm';
import api from '@/services/api';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Register() {
  const navigate = useNavigate();
  const onSubmit = async data => {
    try { await api.post('/register', data); toast.success('Registered'); navigate('/login'); }
    catch (err) { toast.error(err.response?.data || 'Registration failed'); }
  };
  return <AuthForm onSubmit={onSubmit} isRegister />;
}