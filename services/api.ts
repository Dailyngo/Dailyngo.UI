import axios from 'axios';
import { ENVIRONMENT } from '@/configurations';

export const createPost = async (formData: FormData) => {
  try {
    const response = await axios.post(`${ENVIRONMENT.baseURL}/api/posts`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating post:', error);
    throw error;
  }
}; 