import { createContext } from "react";

export type CitationStatus = "PENDING" | "WAIVED" | "REJECTED";
export type CitationDecision = Exclude<CitationStatus, "PENDING">;

export type CitationStateContextValue = {
  citationState: Record<string, CitationStatus>;
  decideCitation: (fineId: string, decision: CitationDecision) => void;
};

export const CitationStateContext =
  createContext<CitationStateContextValue | null>(null);
