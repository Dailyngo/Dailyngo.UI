import { StateCreator } from 'zustand';
import { ResponseData, TStoreState } from '../..';
import { getTodayBirthdaysService, searchUsersService } from '@/services';

// Doğum günü verisi tipi
export interface BirthdayUser {
  id: string;
  fullName: string;
  birthDate: string | null;
}

export interface SearchUser{
  id: string;
  fullName: string;
  username: string;
  profileImage: string | null;
  isFollowing: boolean;
  isFollowed: boolean;
}

// State tipi
export interface TUserState {
  birthdays: BirthdayUser[];
  searchUsers: SearchUser[];

  // Actions
  fetchBirthdays: () => Promise<void>;
  getSearchUsers:(searchTerm:string,pageNumber: number) => Promise<void>;
  resetBirthdayError: () => void;
}

const createUserSlice: StateCreator<TStoreState, [], [], TUserState> = (
	set
) => ({
	birthdays: [],
	searchUsers: [],

	fetchBirthdays: async () => {
		try {
			const response = await getTodayBirthdaysService<
				ResponseData<BirthdayUser>
			>();
			set({ birthdays: response.data.data });
		} catch (error) {
			console.error("Doğum günü verileri alınamadı:", error);
		}
	},

	getSearchUsers: async (searchTerm: string, pageNumber?: number | null) => {
		try {
			const response = await searchUsersService<
				ResponseData<SearchUser>,
				{ searchTerm: string; pageNumber: number }
			>({ searchTerm, pageNumber: pageNumber || 1 });
			const searchUsers = response.data.data;

			set({ searchUsers: searchUsers });
		} catch (error) {
			console.error("Kullanıcı arama verileri alınamadı:", error);
		}
	},

	resetBirthdayError: () => {
		set({ error: null });
	},
});

export default createUserSlice;
