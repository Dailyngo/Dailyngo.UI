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
  getPostComments: (postId: string, pageNumber?: number) => Promise<CommentData[]>;
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
      // API'ye yorum ekleme isteği gönder
      await createCommentService(commentData);

    } catch (error) {
      console.error('Yorum eklenirken bir hata oluştu:', error);
      set({ error: 'Yorum eklenirken bir hata oluştu.', loginLoading: false });
    }
  },
  
  getPostComments: async (postId: string,pageNumber?: number ) => {
    try {
      const existingComments = get().comments[postId];
      if (existingComments && existingComments.length > 0 && (pageNumber === undefined || pageNumber === 1)) {
        return existingComments;
      }
      
      // API'den yorumları getir
      const response = await getPostCommentsService<CommentResponseData, { postId: string,queryParams : { pageNumber?: number} }>(
        { postId , queryParams: { pageNumber:  pageNumber }}
      );
      
      set({ comments: {
        ...get().comments,
        [postId]: [...get().comments[postId]??[], ...response.data.data]
      } });
      
      return response.data.data;

    } catch (error) {
      console.error('Yorumlar yüklenirken bir hata oluştu:', error);
      return [];
    }
  },
  
  deleteComment: async (commentId: string, postId: string) => {
    try {
      set({ loginLoading: true, error: null });
      
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
        loginLoading: false
      });
    } catch (error) {
      console.error('Yorum silinirken bir hata oluştu:', error);
      set({ error: 'Yorum silinirken bir hata oluştu.', loginLoading: false });
    }
  },
  
  // Utility functions
  resetError: () => {
    set({ error: null });
  }
});

export default createCommentSlice; 