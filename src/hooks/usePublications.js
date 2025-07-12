// src/hooks/usePublications.js
import { useContext } from "react";
import { PublicationContext } from "../context/PublicationsContext";
export function usePublications() {
  const context = useContext(PublicationContext);

  if (!context) {
    throw new Error(
      "usePublications must be used within a PublicationProvider"
    );
  }

  return context;
}
