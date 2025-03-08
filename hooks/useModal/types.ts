export type TModalMessageType = "info" | "warning" | "success" | "error";

export type TModalItemState = {
  componentName: string;
  isOpen: boolean;
  title?: string;
  content?: string;
};

/** this is MODALS enum for every modal */

export enum MODALS {
  GENERIC_MESSAGE_MODAL = "genericMessageModal",
}

type TGenericModalState = {
  [MODALS.GENERIC_MESSAGE_MODAL]: TModalItemState;
};

export type TModalState = {
  modals: TGenericModalState;
  changeVisibility: (
    modalName: MODALS,
    isOpen: boolean,
    title?: string,
    content?: string,
    type?: TModalMessageType,
    onOk?: () => void,
  ) => void;
};
