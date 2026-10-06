import { useContext } from "react";
import { CitationStateContext } from "./CitationState";

export function useCitationState() {
  const context = useContext(CitationStateContext);
  if (!context) {
    throw new Error(
      "useCitationState must be used within a CitationStateProvider",
    );
  }
  return context;
}
