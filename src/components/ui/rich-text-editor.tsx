'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to prevent SSR issues with document/window
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <div className="h-[300px] flex items-center justify-center bg-zinc-50 border border-zinc-200 text-zinc-400">Loading Editor...</div> });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className = '' }: RichTextEditorProps) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'link', 'image'
  ];

  return (
    <div className={`bg-white [&_.ql-editor]:min-h-[300px] [&_.ql-editor]:text-base ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Write something amazing...'}
      />
    </div>
  );
}
