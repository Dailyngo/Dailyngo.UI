import { StateCreator } from "zustand";
import { ResponseSingleData, TStoreState } from "../..";
import { createPostService, deletePostService, getHomePagePostsService, getPostDetailsService, getUserPostsService } from "@/services";

// Post veri tipi
export interface PostData {
  id: string;
  content: string;
  postDate: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isOwner: boolean;
  userId: string;
  userName: string;
  userProfileImage: string | null;
  isFollowing: boolean;
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
  
  // Post Actions
  createPost: (postData: CreatePostData) => Promise<void>;
  getHomePosts: (pageNumber?: number) => Promise<void>;
  getUserPosts: (userId?: string | null, pageNumber?: number) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  getPostDetailService: (postId: string) => Promise<PostData | null>;
  
  // Utility functions
  resetPostError: () => void;
}

const createPostSlice: StateCreator<TStoreState, [], [], TPostState> = (set, get) => ({
  // State
  posts: [],
  userPosts: [],
  loading: false,
  error: null,

  getPostDetailService: async (postId) => {
    
    try {
      const response = await getPostDetailsService<
			ResponseSingleData<PostData>,
			{ postId: string }
		>({ postId });
      
      return response.data.data;
    }
    catch (error) {
      set({ error: 'Gönderi detayları yüklenirken bir hata oluştu.' });
      console.error('Error fetching post details:', error);
      return null;
    }
  },
  
  // Actions
  createPost: async (postData: CreatePostData) => {
    try {
      set({ error: null });
      
      await createPostService(postData);
      
    } catch (error) {
      set({ error: 'Gönderi oluşturulurken bir hata oluştu.' });
    }
  },
  
  getHomePosts: async (pageNumber: number = 1) => {
    try {
      set({ loginLoading: true, error: null });
      
      // API çağrısı - Dışarıdan gelen pageNumber değerini kullanıyoruz
      const response = await getHomePagePostsService<ResponseData, { pageNumber: number }>({ pageNumber });
      
      // İşlem başarılı olduğunda - sayfa 1 ise değiştir, değilse ekle
      if (pageNumber === 1) {
        set({ posts: response.data.data, loginLoading: false });
      } else {
        // Mevcut gönderilere yeni gönderileri ekle
        set({ posts: [...get().posts, ...response.data.data], loginLoading: false });
      }
    } catch (error) {
      set({ error: 'Ana sayfa gönderileri yüklenirken bir hata oluştu.', loginLoading: false });
    }
  },
  
  getUserPosts: async (userId?: string | null, pageNumber: number = 1) => {
    try {
      set({ loginLoading: true, error: null });
      
      // API çağrısı
      const response = await getUserPostsService<ResponseData, { userId?: string | null, pageNumber: number }>({
        userId,
        pageNumber
      });
      
      // İşlem başarılı olduğunda
      set({ userPosts: response.data.data, loginLoading: false });
    } catch (error) {
      set({ error: 'Kullanıcı gönderileri yüklenirken bir hata oluştu.', loginLoading: false });
    }
  },
  
  deletePost: async (postId: string) => {
    try {
      set({ loginLoading: true, error: null });
      
      // API çağrısı
      await deletePostService(postId);
      
      // Ana sayfa gönderilerinden silme
      const updatedPosts = get().posts.filter(post => post.id !== postId);
      
      // Kullanıcı gönderilerinden silme
      const updatedUserPosts = get().userPosts.filter(post => post.id !== postId);
      
      // Seçili gönderiyi güncelleme

      set({ 
        posts: updatedPosts, 
        userPosts: updatedUserPosts,
        loginLoading: false 
      });
    } catch (error) {
      set({ error: 'Gönderi silinirken bir hata oluştu.', loginLoading: false });
    }
  },
  
  resetPostError: () => {
    set({ error: null });
  }
});

export default createPostSlice;
