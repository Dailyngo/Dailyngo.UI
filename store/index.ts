import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import createAuthSlice, { TAuthState } from "./slices/authSlice";
import createErrorSlice, { TErrorState } from "./slices/errorSlice";
import messageSlice, { TMessageState } from "./slices/messageSlice";
import chatMessagesSlice, { TchatMessagesState } from "./slices/chatMessagesSlice";
import createPostSlice, { TPostState } from "./slices/postSlice";
import createCommentSlice, { TCommentState } from "./slices/commentSlice";

export type TStoreState = TAuthState &
  TErrorState &
  TMessageState &
  TchatMessagesState &
  TPostState &
  TCommentState;
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
      /**ekstra slices will be add here */
    }),
    {
      name: "store",
    }
  )
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("store", useStore);
}
