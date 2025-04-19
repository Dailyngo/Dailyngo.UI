"use client";

import { useState } from 'react';
import { useStore } from '../../store';
import { Card, Button } from 'antd';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill since it requires the browser
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CreatePostForm: React.FC = () => {
  const { createPost, loading } = useStore();
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      await createPost({ content });
      setContent('');
    } catch (error) {
      console.error('Gönderi oluşturulurken bir hata oluştu:', error);
    }
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'], // Görsel ekleme seçeneği eklendi
    ],
  };

  const formats = [
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link', 'image', // Görsel formatı eklendi
  ];

  return (
    <Card className="mb-6 shadow-sm">
      <div>
        <div className="mb-12">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Bir şeyler paylaş..."
            modules={modules}
            formats={formats}
            className="rounded-lg"
            style={{ height: '120px' }}
          />
        </div>
        <div className="flex justify-end mt-10">
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={!content.trim()}
          >
            Paylaş
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CreatePostForm;