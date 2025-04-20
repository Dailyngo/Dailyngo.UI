import { StateCreator } from "zustand";
import { TStoreState } from "../..";
import { addLikeService, getPostLikesService, removeLikeService } from "@/services";

// Like veri tipi
export interface LikeData {
  userId: string;
  fullName: string;
  isFollowing: boolean;
  isFollowed: boolean;
}

// API yanıtı için tip
interface LikeResponseData {
  data: LikeData[];
}

export interface TLikeState {
  likes: { [postId: string]: LikeData[] };
  loading: boolean;
  error: string | null;
  
  // Like Actions
  getPostLikes: (postId: string, pageNumber?: number) => Promise<LikeData[]>;
  addLike: (postId: string) => Promise<void>;
  removeLike: (postId: string) => Promise<void>;
  
  // Utility functions
  resetError: () => void;
}

const createLikeSlice: StateCreator<TStoreState, [], [], TLikeState> = (set, get) => ({
  // State
  likes: {},
  loading: false,
  error: null,
  
  // Actions
  getPostLikes: async (postId: string, pageNumber: number = 1) => {
    try {
      set({ loading: true, error: null });
      
      // Eğer beğeniler zaten yüklendiyse, önbellekten getir
      if (get().likes[postId] && get().likes[postId].length > 0 && pageNumber === 1) {
        set({ loading: false });
        return get().likes[postId];
      }
      
      // API'den beğenileri getir
      const response = await getPostLikesService<LikeResponseData, { postId: string, queryParams:{pageNumber: number} }>({
        postId,
        queryParams: { pageNumber }
      });
      
      if (response?.data?.data) {
        // Beğenileri sakla
        set({ 
          likes: { 
            ...get().likes, 
            [postId]: response.data.data 
          },
          loading: false 
        });
        
        return response.data.data;
      } else {
        // Veri yoksa boş dizi döndür
        set({ 
          likes: { 
            ...get().likes, 
            [postId]: [] 
          },
          loading: false 
        });
        
        return [];
      }
    } catch (error) {
      set({ loading: false });
      console.error('Beğeniler yüklenirken bir hata oluştu:', error);
      return [];
    }
  },
  
  addLike: async (postId: string) => {
    try {
      set({ loading: true, error: null });
      
      // API'ye beğeni ekleme isteği gönder
      await addLikeService(postId);
      
      // Beğenileri yeniden yükle
      await get().getPostLikes(postId);
      
    } catch (error) {
      console.error('Beğeni eklenirken bir hata oluştu:', error);
      set({ error: 'Beğeni eklenirken bir hata oluştu.', loading: false });
    }
  },
  
  removeLike: async (postId: string) => {
    try {
      set({ loading: true, error: null });
      
      // API'ye beğeni silme isteği gönder
      await removeLikeService(postId);
      
      // Beğenileri yeniden yükle
      await get().getPostLikes(postId);
      
    } catch (error) {
      console.error('Beğeni silinirken bir hata oluştu:', error);
      set({ error: 'Beğeni silinirken bir hata oluştu.', loading: false });
    }
  },
  
  // Utility functions
  resetError: () => {
    set({ error: null });
  }
});

export default createLikeSlice; 