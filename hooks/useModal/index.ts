import { generateInitialState } from "@/hooks/useModal/constants";
import { MODALS, TModalMessageType, TModalState } from "@/hooks/useModal/types";
import { create } from "zustand";

/**
 * for new modal just add new modal item to MODAL enum
 * and create new state for it
 */

const initialState = {
  [MODALS.GENERIC_MESSAGE_MODAL]: generateInitialState(MODALS.GENERIC_MESSAGE_MODAL),
};

export const useModal = create<TModalState>((set) => ({
  modals: initialState,
  changeVisibility: (
    modalName: MODALS,
    isOpen: boolean,
    title?: string,
    content?: string,
    type?: TModalMessageType,
    onOk?: () => void,
  ) => {
    set((state: TModalState) => ({
      modals: {
        ...state.modals,
        [modalName]: {
          ...state.modals[modalName],
          title,
          content,
          isOpen,
          type,
          onOk,
        },
      },
    }));
  },
}));
