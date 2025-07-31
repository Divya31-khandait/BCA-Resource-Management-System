import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import StudentDashboard from '@/pages/StudentDashboard';
import TeacherUpload from '@/pages/TeacherUpload';
import AdminUsers from '@/pages/AdminUsers';
import RequireAuth from '@/components/RequireAuth';
import Home from '@/pages/Home';
import About from '@/pages/About';
import TeacherGqpView from './pages/TeacherGqpView';


export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student" element={<RequireAuth role="student"><StudentDashboard /></RequireAuth>} />
           <Route  path="/teacher/gqp-view" element={<RequireAuth role="teacher"><TeacherGqpView />  </RequireAuth> }/>
          <Route path="/teacher/upload" element={<RequireAuth role="teacher"><TeacherUpload /></RequireAuth>} />
          <Route path="/admin/users" element={<RequireAuth role="admin"><AdminUsers /></RequireAuth>} />
        </Routes>
      </main>
    </div>
  );
}
