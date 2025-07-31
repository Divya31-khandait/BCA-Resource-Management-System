import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/services/api';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

export default function TeacherUpload() {
  const initialMeta = { title: '', type: 'notes', subject: '', year: 'FYBCA', semester: 'Sem1' };
  const [meta, setMeta] = useState(initialMeta);
  const [file, setFile] = useState(null);
  const formRef = useRef();

  const handleChange = e => setMeta(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFile = e => setFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(meta).forEach(([k, v]) => formData.append(k, v));
    formData.append('file', file);

    try {
      await api.post('/resources/upload', formData);
      toast.success('Uploaded successfully');

      // reset React state
      setMeta(initialMeta);
      setFile(null);
      // reset the actual form (clears native file input)
      formRef.current.reset();
    } catch {
      toast.error('Upload failed');
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 space-y-4 bg-white rounded-2xl shadow"
    >
      <Input
        name="title"
        placeholder="Title"
        value={meta.title}
        onChange={handleChange}
        required
      />
      <select
        name="type"
        value={meta.type}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="notes">Notes</option>
        <option value="ebook">eBook</option>
        <option value="questionpaper">Question Paper</option>
      </select>
      <Input
        name="subject"
        placeholder="Subject"
        value={meta.subject}
        onChange={handleChange}
        required
      />
      <select
        name="year"
        value={meta.year}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="FYBCA">FYBCA</option>
        <option value="SYBCA">SYBCA</option>
        <option value="TYBCA">TYBCA</option>
      </select>
      <select
        name="semester"
        value={meta.semester}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="Sem1">Sem1</option>
        <option value="Sem2">Sem2</option>
        <option value="Sem1">Sem3</option>
        <option value="Sem2">Sem4</option>
        <option value="Sem1">Sem5</option>
        <option value="Sem2">Sem6</option>
      </select>
      <Input type="file" onChange={handleFile} required />
      <Button type="submit" className="w-full">
        Upload
      </Button>
    </form>
  );
}