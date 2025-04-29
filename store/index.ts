import { mountStoreDevtool } from "simple-zustand-devtools";
import { create, StoreApi } from "zustand";
import { devtools, persist } from "zustand/middleware";
import createAuthSlice, { TAuthState } from "./slices/authSlice";
import createErrorSlice, { TErrorState } from "./slices/errorSlice";
import messageSlice, { TMessageState } from "./slices/messageSlice";
import chatMessagesSlice, { TchatMessagesState } from "./slices/chatMessagesSlice";
import createPostSlice, { TPostState } from "./slices/postSlice";
import createCommentSlice, { TCommentState } from "./slices/commentSlice";
import createLikeSlice, { TLikeState } from "./slices/likeSlice";
import createUserSlice, { TUserState } from "./slices/usersSlice";
import createFollowSlice, { TFollowState } from "./slices/followSlice";
import createAboutsSlice, { TAboutState } from "./slices/aboutsSlice";
import createNotificationSlice, { TNotificationState } from "./slices/notification";
import createReportSlice, { TReportState } from "./slices/reportSlice";

export type TStoreState = TAuthState &
  TErrorState &
  TMessageState &
  TchatMessagesState &
  TPostState &
  TCommentState &
  TLikeState & 
  TCommentState &
  TFollowState &
  TUserState &
  TNotificationState &
  TReportState &
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
      ...createLikeSlice(...a),
      ...createUserSlice(...a),
      ...createFollowSlice(...a),
      ...createAboutsSlice(...a),
      ...createNotificationSlice(...a),
      ...createReportSlice(...a),
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
export interface ResponseSingleData<T>{
  data: T;
}


if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("store", useStore);
}
