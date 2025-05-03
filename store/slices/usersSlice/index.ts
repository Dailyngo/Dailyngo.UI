import { StateCreator } from 'zustand';
import { ResponseData, ResponseSingleData, TStoreState } from '../..';
import { getTodayBirthdaysService, getUserProfileCardService, searchUsersService } from '@/services';

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
}

// IsReceiverFollowRequest = receivedFollowRequest != null,
// SendReceiverRequestId = receivedFollowRequest?.Id.ToString()
export interface UserProfileData {
  getUserResponse: {
	profilePicture: string | null;
	fullName: string;
	userName: string;
  };
  follower: number;
  following: number;
  bio: string | null;
  postCount: number;
  isFollowing: boolean;
  isFollowed: boolean;
  sendFollowRequestId: string | null; // attigim takip isteginin idsi
  isSendFollowRequest: boolean; // ben takip istegi gonderdim mi?
  isReceiverFollowRequest: boolean; // bana takip istegi atmismi?
  sendReceiverRequestId: string | null; // bana gonderilen takip isteginin idsi
}

// State tipi
export interface TUserState {
  birthdays: BirthdayUser[];
  searchUsers: SearchUser[];

  // Actions
  fetchBirthdays: () => Promise<void>;
  getSearchUsers:(searchTerm:string,pageNumber?: number | null) => Promise<void>;
  getUserProfileCard: (userId?: string | null) => Promise<UserProfileData | null>;
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

	getUserProfileCard: async (userId?: string | null) => {
		try {
			console.log("userId in slice", userId);
			const response = await getUserProfileCardService<
				ResponseSingleData<UserProfileData>,
				{ userId?: string | null }
			>( { userId });
			const userProfileData = response.data.data;
			return userProfileData;
		} catch (error) {
			console.error("Kullanıcı profili verileri alınamadı:", error);
			throw error; // Hata durumunda hata fırlat
		}
	},

	resetBirthdayError: () => {
		set({ error: null });
	},
});

export default createUserSlice;
