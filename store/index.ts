import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import createAuthSlice, { TAuthState } from "./slices/authSlice";
import createErrorSlice, { TErrorState } from "./slices/errorSlice";
import messageSlice, { TMessageState } from "./slices/messageSlice";
import chatMessagesSlice, { TchatMessagesState } from "./slices/chatMessagesSlice";
import createPostSlice, { TPostState } from "./slices/postSlice";
import createCommentSlice, { TCommentState } from "./slices/commentSlice";
import createBirthdaySlice, { TBirthdayState } from "./slices/usersSlice";
import createAboutsSlice, { TAboutState } from "./slices/aboutsSlice";

export type TStoreState = TAuthState &
  TErrorState &
  TMessageState &
  TchatMessagesState &
  TPostState &
  TCommentState &
  TBirthdayState&
  TAboutState;
// Add other slices here

export const useStore = create<TStoreState>()(
  devtools(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createErrorSlice(...a),
      ...messageSlice(...a),
      ...chatMessagesSlice(...a),
      ...createPostSlice(...a),
      ...createCommentSlice(...a),
      ...createBirthdaySlice(...a),
      ...createAboutsSlice(...a),
      /**ekstra slices will be add here */
    }),
    {
      name: "store",
    }
  )
);
export interface ResponseData<T>{
  data: T[];
}


if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("store", useStore);
}
