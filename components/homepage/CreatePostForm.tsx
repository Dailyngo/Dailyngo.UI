"use client";

import { useEffect, useState } from 'react';
import { useStore } from '../../store';
import { Card, Button } from 'antd';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { ERRORS } from '@/store/slices/errorSlice';

// Dynamically import ReactQuill since it requires the browser
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CreatePostForm: React.FC = () => {
  const { createPost, postError, setErrorConfirmInfoModal, postLoading} = useStore();
  const [content, setContent] = useState<string | null>();

    const handleSubmit = async () => {
      if (!content) return;
      const isSuccess = await createPost({ content });
      setContent(null);

      if(isSuccess){
        console.log('postError create after', postError);
        setErrorConfirmInfoModal(
          ERRORS.GENERIC_INFO_AND_ERRORS,
          "Hata",
          "Gönderi Başarılı bir şekilde paylaşıldı.",
          "success"
        );
      }
    };

    useEffect(() => {
      if (postError) {
        console.log('postError', postError);
        setErrorConfirmInfoModal(
          ERRORS.GENERIC_INFO_AND_ERRORS,
          "Hata",
          postError,
          "error"
        );
      }
    }, [postError]);

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
            value={content || ''}
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
            loading={postLoading}
            disabled={!content || content === '<p><br></p>'}
          >
            Paylaş
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CreatePostForm;