import { StateCreator } from "zustand";
import { TStoreState } from "../..";
import { createCommentService, deleteCommentService, getPostCommentsService } from "@/services";

// Yorum veri tipi
export interface CommentData {
  id: string;
  replyCommentId: string;
  userId: string;
  userName: string;
  canDelete: boolean;
  content: string;
  commentDate: string;
  userProfileImage?: string | null;
}

// Yeni yorum oluşturma için tip
export interface CreateCommentData {
  content: string;
  postId: string;
  replyCommentId?: string | null;
}

// API yanıtı için tip
interface CommentResponseData {
  data: CommentData[];
}

export interface TCommentState {
  comments: { [postId: string]: CommentData[] };
  loading: boolean;
  error: string | null;
  
  // Comment Actions
  createComment: (commentData: CreateCommentData) => Promise<void>;
  getPostComments: (postId: string) => Promise<CommentData[]>;
  deleteComment: (commentId: string, postId: string) => Promise<void>;
  
  // Utility functions
  resetError: () => void;
}

const createCommentSlice: StateCreator<TStoreState, [], [], TCommentState> = (set, get) => ({
  // State
  comments: {},
  loading: false,
  error: null,
  
  // Actions
  createComment: async (commentData: CreateCommentData) => {
    try {
      set({ loading: true, error: null });
      
      // API'ye yorum ekleme isteği gönder
      await createCommentService(commentData);

      set({ loading: false });
    } catch (error) {
      console.error('Yorum eklenirken bir hata oluştu:', error);
      set({ error: 'Yorum eklenirken bir hata oluştu.', loading: false });
    }
  },
  
  getPostComments: async (postId: string) => {
    try {
      set({ loading: true, error: null });
      
      // Eğer yorumlar zaten yüklendiyse, önbellekten getir
      if (get().comments[postId] && get().comments[postId].length > 0) {
        set({ loading: false });
        return get().comments[postId];
      }
      
      // API'den yorumları getir
      const response = await getPostCommentsService<CommentResponseData,string>(postId);
      
      if (response?.data?.data) {
        // Yorumları sakla
        set({ 
          comments: { 
            ...get().comments, 
            [postId]: response.data.data 
          },
          loading: false 
        });
        
        return response.data.data;
      } else {
        // Veri yoksa boş dizi döndür
        set({ 
          comments: { 
            ...get().comments, 
            [postId]: [] 
          },
          loading: false 
        });
        
        return [];
      }
    } catch (error) {
      console.error('Yorumlar yüklenirken bir hata oluştu:', error);
      set({ error: 'Yorumlar yüklenirken bir hata oluştu.', loading: false });
      return [];
    }
  },
  
  deleteComment: async (commentId: string, postId: string) => {
    try {
      set({ loading: true, error: null });
      
      // API'ye yorum silme isteği gönder
      await deleteCommentService(commentId);
      
      // Yorumları güncelle - silinen yorumu ve yanıtlarını kaldır
      const currentComments = get().comments[postId] || [];
      
      // Silinen yorumu ve cevaplarını filtrele
      const updatedComments = currentComments.filter(
        comment => comment.id !== commentId && comment.replyCommentId !== commentId
      );
      
      // State'i güncelle
      set({
        comments: {
          ...get().comments,
          [postId]: updatedComments
        },
        loading: false
      });
    } catch (error) {
      console.error('Yorum silinirken bir hata oluştu:', error);
      set({ error: 'Yorum silinirken bir hata oluştu.', loading: false });
    }
  },
  
  // Utility functions
  resetError: () => {
    set({ error: null });
  }
});

export default createCommentSlice; 