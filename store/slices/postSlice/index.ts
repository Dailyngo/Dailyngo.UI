import { StateCreator } from "zustand";
import { TStoreState } from "../..";
import { createPostService, deletePostService, getHomePagePostsService, getUserPostsService } from "@/services";

// Post veri tipi
export interface PostData {
  id: string;
  content: string;
  postDate: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  userId: string;
  userName: string;
  userProfileImage: string | null;
}

interface ResponseData{
  data: PostData[];
}

// Yeni post oluşturma için tip
export interface CreatePostData {
  content: string;
  id?: string;
}

export interface TPostState {
  posts: PostData[];
  userPosts: PostData[];
  loading: boolean;
  error: string | null;
  selectedPost: PostData | null;
  
  // Post Actions
  createPost: (postData: CreatePostData) => Promise<void>;
  getHomePosts: (pageNumber?: number) => Promise<void>;
  getUserPosts: (userId?: string, pageNumber?: number) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  
  // Utility functions
  setSelectedPost: (postId: string | null) => void;
  resetPostError: () => void;
}

const createPostSlice: StateCreator<TStoreState, [], [], TPostState> = (set, get) => ({
  // State
  posts: [],
  userPosts: [],
  loading: false,
  error: null,
  selectedPost: null,
  
  // Actions
  createPost: async (postData: CreatePostData) => {
    try {
      set({ loading: true, error: null });
      
      await createPostService(postData);
      
    } catch (error) {
      set({ error: 'Gönderi oluşturulurken bir hata oluştu.', loading: false });
    }
  },
  
  getHomePosts: async (pageNumber: number = 1) => {
    try {
      set({ loading: true, error: null });
      
      // API çağrısı - Dışarıdan gelen pageNumber değerini kullanıyoruz
      const response = await getHomePagePostsService<ResponseData, { pageNumber: number }>({ pageNumber });
      
      // İşlem başarılı olduğunda - sayfa 1 ise değiştir, değilse ekle
      if (pageNumber === 1) {
        set({ posts: response.data.data, loading: false });
      } else {
        // Mevcut gönderilere yeni gönderileri ekle
        set({ posts: [...get().posts, ...response.data.data], loading: false });
      }
    } catch (error) {
      set({ error: 'Ana sayfa gönderileri yüklenirken bir hata oluştu.', loading: false });
    }
  },
  
  getUserPosts: async (userId?: string, pageNumber: number = 1) => {
    try {
      set({ loading: true, error: null });
      
      // API çağrısı
      const response = await getUserPostsService<ResponseData, { userId?: string, pageNumber: number }>({
        userId,
        pageNumber
      });
      
      // İşlem başarılı olduğunda
      set({ userPosts: response.data.data, loading: false });
    } catch (error) {
      set({ error: 'Kullanıcı gönderileri yüklenirken bir hata oluştu.', loading: false });
    }
  },
  
  deletePost: async (postId: string) => {
    try {
      set({ loading: true, error: null });
      
      // API çağrısı
      await deletePostService(postId);
      
      // Ana sayfa gönderilerinden silme
      const updatedPosts = get().posts.filter(post => post.id !== postId);
      
      // Kullanıcı gönderilerinden silme
      const updatedUserPosts = get().userPosts.filter(post => post.id !== postId);
      
      // Seçili gönderiyi güncelleme
      let selectedPost = get().selectedPost;
      if (selectedPost && selectedPost.id === postId) {
        selectedPost = null;
      }
      
      set({ 
        posts: updatedPosts, 
        userPosts: updatedUserPosts,
        selectedPost,
        loading: false 
      });
    } catch (error) {
      set({ error: 'Gönderi silinirken bir hata oluştu.', loading: false });
    }
  },
  
  // Utility functions
  setSelectedPost: (postId: string | null) => {
    if (postId === null) {
      set({ selectedPost: null });
    } else {
      const post = get().posts.find(p => p.id === postId) || 
                  get().userPosts.find(p => p.id === postId) || 
                  null;
      set({ selectedPost: post });
    }
  },
  
  resetPostError: () => {
    set({ error: null });
  }
});

export default createPostSlice;
