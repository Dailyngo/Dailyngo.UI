import { TModalItemState } from "@/hooks/useModal/types";

/**
 *
 * @param {{create initial state for every modal}}
 *
 * @returns {{it returns new state for every modal}}
 */

export const generateInitialState = (componentName: string): TModalItemState => ({
  isOpen: false,
  componentName,
});
