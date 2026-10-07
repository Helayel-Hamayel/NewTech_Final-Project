import { useState } from "react";
import type { ReactNode } from "react";
import { staffDisputesData } from "../data/staffData";
import {
  CitationStateContext,
  type CitationDecision,
  type CitationStatus,
} from "./CitationState";

export function CitationStateProvider({ children }: { children: ReactNode }) {
  const [citationState, setCitationState] = useState<
    Record<string, CitationStatus>
  >(() =>
    staffDisputesData.reduce<Record<string, CitationStatus>>(
      (state, dispute) => {
        state[dispute.fineId] = dispute.status;
        return state;
      },
      {},
    ),
  );

  function decideCitation(fineId: string, decision: CitationDecision) {
    setCitationState((current) => {
      if (current[fineId] !== "PENDING") return current;
      return { ...current, [fineId]: decision };
    });
  }

  return (
    <CitationStateContext.Provider value={{ citationState, decideCitation }}>
      {children}
    </CitationStateContext.Provider>
  );
}
