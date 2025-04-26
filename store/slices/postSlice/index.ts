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
  postLoading: boolean;
  postError: string | null;

  createPost: (postData: CreatePostData) => Promise<void>;
  getHomePosts: (pageNumber?: number) => Promise<void>;
  getUserPosts: (userId?: string | null, pageNumber?: number) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  getPostDetailService: (postId: string) => Promise<PostData | null>;
  
  resetPostError: () => void;
}

const createPostSlice: StateCreator<TStoreState, [], [], TPostState> = (set, get) => ({
  posts: [],
  userPosts: [],
  postLoading: false,
  postError: null,

  getPostDetailService: async (postId: string) => {
    try {
      set({ postError: null, postLoading: true });
      const response = await getPostDetailsService<
			ResponseSingleData<PostData>,
			string
		>(postId);
      return response.data.data;
    }
    catch (error : any) {
      set({ postError: error.response.data.messages });
      return null;
    }finally{
      set({ postLoading: false });

      setTimeout(() => {
        set({ postError: null });
      }, 3000);
    }
  },
  
  // Actions
  createPost: async (postData: CreatePostData) => {
    try {
      set({ postError: null, postLoading: true });
      
      await createPostService(postData);
      
    } catch (error : any) {
      set({ postError: error.response.data.messages});
    }finally{
      set({ postLoading: false });

      setTimeout(() => {
        set({ postError: null });
      }, 3000);
    }
  },
  
  getHomePosts: async (pageNumber: number = 1) => {
    try {
      set({ postError: null });
      
      // API çağrısı - Dışarıdan gelen pageNumber değerini kullanıyoruz
      const response = await getHomePagePostsService<ResponseData, { pageNumber: number }>({ pageNumber });
      
      // İşlem başarılı olduğunda - sayfa 1 ise değiştir, değilse ekle
      if (pageNumber === 1) {
        set({ posts: response.data.data });
      } else {
        // Mevcut gönderilere yeni gönderileri ekle
        set({ posts: [...get().posts, ...response.data.data] });
      }
    } catch (error : any) {
      set({ postError: error.response.data.messages });
    }finally{
      setTimeout(() => {
        set({ postError: null });
      }, 3000);
    }
  },
  
  getUserPosts: async (userId?: string | null, pageNumber: number = 1) => {
    try {
      set({ postLoading: true, postError: null });
      
      // API çağrısı
      const response = await getUserPostsService<ResponseData, { userId?: string | null, pageNumber: number }>({
        userId,
        pageNumber
      });
      
      // İşlem başarılı olduğunda
      set({ userPosts: response.data.data });
    } catch (error : any) {
      set({ postError: error.response.data.messages });
    }finally{
      set({ postLoading: false });

      setTimeout(() => {
        set({ postError: null });
      }, 3000);
    }
  },
  
  deletePost: async (postId: string) => {
    try {
      set({ postLoading: true, postError: null });
      
      // API çağrısı
      await deletePostService(postId);
      
      // Ana sayfa gönderilerinden silme
      const updatedPosts = get().posts.filter(post => post.id !== postId);
      
      // Kullanıcı gönderilerinden silme
      const updatedUserPosts = get().userPosts.filter(post => post.id !== postId);
      
      // Seçili gönderiyi güncelleme

      set({ 
        posts: updatedPosts, 
        userPosts: updatedUserPosts
      });
    } catch (error : any) {
      set({ postError: error.response.data.messages });
    }finally{
      set({ postLoading: false });
      setTimeout(() => {
        set({ postError: null });
      }, 3000);
    }
  },
  
  resetPostError: () => {
    set({ postError: null });
  }
});

export default createPostSlice;
