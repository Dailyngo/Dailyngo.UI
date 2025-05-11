"use client";

import { useStore } from '../../store';
import { Card, Button, message, Progress } from 'antd';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { ERRORS } from '@/store/slices/errorSlice';
import { useState, useEffect } from 'react';

// Dynamically import ReactQuill since it requires the browser
const ReactQuillComponent = dynamic(() => import('react-quill'), { ssr: false });

const CreatePostForm: React.FC = () => {
  const { createPost, postError, setErrorConfirmInfoModal, postLoading } = useStore();
  const [content, setContent] = useState<string | null>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleImageUpload = async (file: File) => {
    try {
      if (!file.type.startsWith('image/')) {
        message.error('Lütfen geçerli bir resim dosyası seçin');
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        message.error("Resim boyutu 5MB'dan küçük olmalıdır");
        return false;
      }

      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      return true;
    } catch (error) {
      console.error('Error handling image upload:', error);
      message.error('Resim yüklenirken bir hata oluştu');
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!content && !selectedImage) return;

    try {
      let imageKey: string | undefined;

      // If there's an image, upload it first
      if (selectedImage) {
        setUploadProgress(0);

        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 10;
          });
        }, 200);

        const formData = new FormData();
        formData.append('file', selectedImage);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Image upload failed');
        }

        const result = await response.json();
        imageKey = result.key;
      }

      // Create post with content and imageKey
      const isSuccess = await createPost({
        content: content || '',
        imageKey
      });
      
      if (isSuccess) {
        setContent(null);
        setSelectedImage(null);
        setImagePreview(null);
        setUploadProgress(0);

        setErrorConfirmInfoModal(
          ERRORS.GENERIC_INFO_AND_ERRORS,
          "Başarılı",
          "Gönderi Başarılı bir şekilde paylaşıldı.",
          "success"
        );
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      setErrorConfirmInfoModal(
        ERRORS.GENERIC_INFO_AND_ERRORS,
        "Hata",
        "Gönderi paylaşılırken bir hata oluştu.",
        "error"
      );
    }
  };

  useEffect(() => {
    if (postError) {
      setErrorConfirmInfoModal(
        ERRORS.GENERIC_INFO_AND_ERRORS,
        "Hata",
        postError,
        "error"
      );
    }
  }, [postError]);

  const modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean']
      ]
    }
  };

  const formats = [
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link'
  ];

  return (
    <Card className="mb-6 shadow-lg rounded-xl border border-gray-200">
      <div>
        <div className="mb-12">
          <ReactQuillComponent
            theme="snow"
            value={content || ''}
            onChange={setContent}
            placeholder="Bir şeyler paylaş..."
            modules={modules}
            formats={formats}
            className="rounded-lg border border-gray-300"
            style={{ height: '120px' }}
          />
        </div>
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageUpload(file);
              }
            }}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer inline-block px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-md transition-colors"
          >
            Resim Ekle
          </label>
        </div>
        {imagePreview && (
          <div className="mb-4 relative">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-h-48 rounded-lg border border-gray-300 shadow-sm"
            />
            {uploadProgress < 100 && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-lg">
                <Progress type="circle" percent={uploadProgress} width={80} />
              </div>
            )}
            <Button
              type="text"
              danger
              className="absolute top-2 right-2 bg-white rounded-full shadow-md hover:bg-red-100"
              onClick={() => {
                setSelectedImage(null);
                setImagePreview(null);
                setUploadProgress(0);
              }}
            >
              Kaldır
            </Button>
          </div>
        )}
        <div className="flex justify-end mt-10">
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={postLoading}
            disabled={(!content || content === '<p><br></p>') && !selectedImage}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            Paylaş
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CreatePostForm;