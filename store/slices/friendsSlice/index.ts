import { signOut } from "next-auth/react";
import { StateCreator } from "zustand";
import { ERRORS } from "../errorSlice";
import { AxiosResponse } from "@/services/types";

const handleError = (
  err: any,
  setErrorConfirmInfoModal: Function,
  closeConfirmModal?: Function
) => {
  console.log("err", err);
  if (closeConfirmModal) {
    closeConfirmModal();
  }
  const errorTitle = err?.response?.data?.title;
  const errorMessage = err?.response?.data?.messages;
  setErrorConfirmInfoModal(
    ERRORS.GENERIC_INFO_AND_ERRORS,
    errorTitle,
    errorMessage,
    "error"
  );
};

export type TFriendsState = {
  friendsLoading: boolean;
  friendList: any[];
  /** actions */
  setLoading: (isLoading: boolean) => void;
  // getFriends: () => void;
};

const friendsSlice: StateCreator<TFriendsState> = (set, get) => ({
  friendsLoading: false,
  friendList: [],
  /** global loading action */
  setLoading: (isLoading: boolean) => {
    set((state: TFriendsState) => ({
      ...state,
      friendsLoading: isLoading,
    }));
  }
  /** actions */
  // getFriends: async () => {
  //   const { setLoading } = get() as TFriendsState;
  //   setLoading(true);
  //   try {
  //     const response: AxiosResponse = await getFriendsService();
  //     set((state: TFriendsState) => ({
  //       ...state,
  //       friendList: response?.data?.data,
  //     }));
  //   } catch (err: any) {
  //     const errorTitle = err?.response?.data?.messages;
  //     const errorMessage = err?.response?.data?.messages;

  //     // Friendly Mesage burdan çağırılacak
  //   } finally {
  //     setLoading(false);
  //   }
  // },
});

export default friendsSlice;
