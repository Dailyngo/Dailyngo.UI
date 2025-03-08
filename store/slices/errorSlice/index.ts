import { useModal } from "@/hooks/useModal";
import { MODALS, TModalMessageType } from "@/hooks/useModal/types";
import { StateCreator } from "zustand";

export enum ERRORS {
  GENERIC_INFO_AND_ERRORS = "genericInfoAndErrors",
  AUTH_ERRORS = "authErrors",
}

export type TErrorItemState = {
  stateName: string;
  errorMessage?: string;
  errorTitle?: string;
  type?: TModalMessageType;
  onOk?: () => void;
};

export type TErrorState = {
  errors: TGenericErrorState;
  setErrorConfirmInfoModal: (
    stateName: ERRORS,
    errorMessage?: string,
    errorTitle?: string,
    type?: TModalMessageType,
    onOk?: () => void,
  ) => void;
};

type TGenericErrorState = {
  [ERRORS.GENERIC_INFO_AND_ERRORS]: TErrorItemState;
  [ERRORS.AUTH_ERRORS]: TErrorItemState;
};

export const generateInitialState = (stateName: string): TErrorItemState => ({
  stateName,
  errorMessage: undefined,
  errorTitle: undefined,
});

const initialState = {
  [ERRORS.GENERIC_INFO_AND_ERRORS]: generateInitialState(ERRORS.GENERIC_INFO_AND_ERRORS),
  [ERRORS.AUTH_ERRORS]: generateInitialState(ERRORS.AUTH_ERRORS),
};

const createErrorSlice: StateCreator<TErrorState> = (set, get) => ({
  errors: initialState,
  setErrorConfirmInfoModal: (stateName, errorTitle, errorMessage, type, onOk) => {
    // const { t } = useLanguageStore.getState();
    // const error = t?.[errorTitle || ""] || errorTitle || "Hata";
    const error = errorTitle || "Hata";
    // const errorContent = t?.[errorMessage || ""] || errorMessage || "Bir şeyler ters gitti";
    const errorContent = errorMessage || "Bir şeyler ters gitti";
    set((state: TErrorState) => ({
      errors: {
        ...state.errors,
        [stateName]: {
          ...state.errors[stateName],
          errorMessage: errorContent,
          errorTitle: error,
          type,
          onOk,
        },
      },
    }));
    const { changeVisibility, modals } = useModal.getState();
    const isGenericInfoModalOpen = modals[MODALS.GENERIC_MESSAGE_MODAL]?.isOpen;
    if (!!type && !isGenericInfoModalOpen) {
      changeVisibility(MODALS.GENERIC_MESSAGE_MODAL, true);
    }
  },
});

export default createErrorSlice;
