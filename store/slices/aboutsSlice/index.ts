import { StateCreator } from 'zustand';
import { TStoreState } from '../..';
import { getOwnAboutService, getOtherAboutService } from '@/services';
import { AxiosResponse } from 'axios';

// Hakkında veri yapısını belirliyoruz
interface Department {
  id: string;
  name: string;
  faculty: {
    id: string;
    name: string;
    university: {
      id: string;
      name: string;
    };
  };
}

interface AboutData {
  department: Department;
  birthDate: string | null;
  gender: number;
}

// State tipi
export interface TAboutState {
  about: AboutData | null;
  otherAbout: AboutData | null;
  loading: boolean;
  error: string | null;
  
  // Aksiyonlar
  getOwnAbout: () => Promise<void>;
  getOtherAbout: (userId: string) => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  resetError: () => void;
}

const createAboutsSlice: StateCreator<TStoreState, [], [], TAboutState> = (set, get) => ({
  about: null,
  otherAbout: null,
  loading: false,
  error: null,

  // Global loading state
  setLoading: (isLoading: boolean) => {
    set((state: TAboutState) => ({
      ...state,
      loading: isLoading
    }));
  },

  // Hakkında bilgilerini almak için kullanılan fonksiyon (Kendi hakkında)
  getOwnAbout: async () => {
    const { setLoading } = get() as TAboutState;
    setLoading(true);
    try {
      const response: AxiosResponse<{ data: AboutData }> = await getOwnAboutService();
      
      set({
        about: response?.data?.data,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      set({
        error: 'Hakkında bilgileri alınırken bir hata oluştu.',
        loading: false,
      });
    }
  },

  // Diğerinin hakkında bilgilerini almak için kullanılan fonksiyon (Diğer kişi hakkında)
  getOtherAbout: async (userId: string) => {
    const { setLoading } = get() as TAboutState;
    setLoading(true);
    try {
      const response: AxiosResponse<{ data: AboutData }> = await getOtherAboutService({ userId });

      set({
        otherAbout: response?.data?.data,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      set({
        error: 'Diğer kişinin hakkında bilgileri alınırken bir hata oluştu.',
        loading: false,
      });
    }
  },

  // Hata mesajını sıfırlama fonksiyonu
  resetError: () => {
    set({ error: null });
  }
});

export default createAboutsSlice;
