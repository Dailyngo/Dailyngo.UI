import { StateCreator } from "zustand";

export type TchatMessagesState = {
  userMessages: {
    [userId: string]: {
      Id: string;
      SenderId: string;
      ReceiverId: string;
      Message: string;
      Timestamp: any;
      ConversationId: string;
      IsRead: boolean;
    }[];
  };
  /** actions */
  addMessageForUser: (
    userId: string,
    message: {
      Id: string;
      SenderId: string;
      ReceiverId: string;
      Message: string;
      Timestamp: string;
      ConversationId: string;
      IsRead: boolean;
    }
  ) => void;
};

const chatMessagesSlice: StateCreator<TchatMessagesState> = (set, get) => ({
  userMessages: {},

  /** Add message for specific user, checking for duplicates */
  addMessageForUser: (userId, newMessage) => {
    set((state: TchatMessagesState) => {
      const existingMessages = state.userMessages[userId] || [];

      // Check if a message with the same Id already exists
      const isDuplicate = existingMessages.some((msg) => msg.Id === newMessage.Id);

      // Only add the new message if it doesn't exist
      return isDuplicate
        ? state
        : {
            ...state,
            userMessages: {
              ...state.userMessages,
              [userId]: [...existingMessages, newMessage],
            },
          };
    });
  },
});

export default chatMessagesSlice;
