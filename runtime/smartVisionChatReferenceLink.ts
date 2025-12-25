import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { getConversationsList } from "@/runtime/smartvisionApi";
interface SmartVisionChatReferenceLinkState {
  reference?: {
    text: string;
    position: {
      top: number;
      left: number;
    };
  };
}
const store = create(immer<SmartVisionChatReferenceLinkState>(() => ({})));

export const useSmartVisionChatReferenceLink = () => {
  const chooseReference = (
    text: string,
    position: { top: number; left: number },
  ) => {
    store.setState((draft) => {
      draft.reference = {
        text,
        position,
      };
    });
  };
  const clearReference = () => {
    store.setState((draft) => {
      draft.reference = undefined;
    });
  };
  return {
    chooseReference,
    clearReference,
  };
};
