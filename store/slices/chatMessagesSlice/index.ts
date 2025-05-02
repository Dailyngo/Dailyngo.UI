import { getAllMessagesService, getAllUsersMessageService } from "@/services";
import { ResponseData, TStoreState } from "@/store";
import { StateCreator } from "zustand";

export interface MessageUser {
  userId: string;
  fullName: string;
  userImage?: string;
  unreadCount: number;
  lastMessageDate: string;
  lastMessage?: string;
  lastMessageOwner: boolean;
}

export interface Message{
  id: string;
  content: string;
  createdAt: string;
  isOwner: boolean;
}

export type TChatMessagesState = {
  userMessages: Record<string, Message[]>; // Store messages for each user by userId
  messageUsers: MessageUser[]; // Store user list with their details
  messageLoading: boolean; // Loading state for messages
  messageError: string | null; // Error state for messages

  getAllMessages: (userId: string, pageNumber: number) => Promise<void>; 
  getAllUsersMessage: (pageNumber: number) => Promise<void>;
};

const chatMessagesSlice: StateCreator<TStoreState, [], [], TChatMessagesState> = (set, get) => ({
  userMessages: {},
  messageUsers: [],
  messageLoading: false,
  messageError: null,

  getAllMessages: async (userId: string, pageNumber: number = 1) => {
    try {
      set({ messageLoading: true,messageError: null });
      const response = await getAllMessagesService<ResponseData<Message>,
        { userId: string; queryParams: { pageNumber: number } }
      >({
        userId,
        queryParams: { pageNumber },
      });

      if(pageNumber === 1){
        set((state) => ({
          userMessages: {
            ...state.userMessages,
            [userId]: response.data.data,
          },
          messageLoading: false,
        }));
        return;
      }

      set((state) => ({
        userMessages: {
          ...state.userMessages,
          [userId]: [...(state.userMessages[userId] || []), ...response.data.data],
        },
        messageLoading: false,
      }));
    } catch (error : any) {
      console.error("Error fetching messages:", error);
      set({ messageLoading: false, messageError: error.response?.data?.messages });
    }
  },

  getAllUsersMessage: async (pageNumber: number = 1) => {
    try {
      set({ messageLoading: true });
      const response = await getAllUsersMessageService<
			ResponseData<MessageUser>,
			{ pageNumber: number }
		>({
			pageNumber,
		});

      set({
        messageUsers: response.data.data,
        messageLoading: false,
      });
    } catch (error :any) {
      console.error("Error fetching users' messages:", error);
      set({ messageLoading: false, messageError: error.response?.data?.messages });
    }
  },
});

export default chatMessagesSlice;
