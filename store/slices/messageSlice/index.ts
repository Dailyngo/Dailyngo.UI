import { StateCreator } from "zustand";

export type messageType = {
  title: string;
  message?: string;
  icon?: string;
  type: "info" | "error" | "success" | "warning";
};

export type TMessageState = {
  message: messageType;
  showMessage: (message: messageType) => void;
};

const createMessageSlice: StateCreator<TMessageState> = (set, get) => ({
  message: {
    title: "",
    type: "info",
  },
  showMessage: (message) => {
    set((state: TMessageState) => ({
      ...state,
      message: message,
    }));
  },
});

export default createMessageSlice;
