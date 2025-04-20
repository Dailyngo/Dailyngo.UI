import { StateCreator } from 'zustand';
import { ResponseData, TStoreState } from '../..';
import { getTodayBirthdaysService } from '@/services';

// Doğum günü verisi tipi
export interface BirthdayUser {
  id: string;
  fullName: string;
  birthDate: string | null;
}

// State tipi
export interface TBirthdayState {
  birthdays: BirthdayUser[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchBirthdays: () => Promise<void>;
  resetBirthdayError: () => void;
}

// Slice creator
const createBirthdaySlice: StateCreator<TStoreState, [], [], TBirthdayState> = (set) => ({
  birthdays: [],
  loading: false,
  error: null,

  fetchBirthdays: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getTodayBirthdaysService<ResponseData<BirthdayUser>>();
      set({ birthdays: response.data.data, loading: false });  // Buraya dikkat!
    } catch (error) {
      set({ error: 'Doğum günü verileri alınırken bir hata oluştu.', loading: false });
    }
  },

  resetBirthdayError: () => {
    set({ error: null });
  },
});

export default createBirthdaySlice;
