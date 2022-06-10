import { Campaign, Character } from "ddtools-types";
import { User } from "firebase/auth";
import { createContext } from "react";
import { FirestoreDoc } from "services/converter";

export type CampaignUserContextType = {
  user: User;
  userRole: "dm" | "player";
  campaign: Campaign & FirestoreDoc;
  playerCharacter?: Character & FirestoreDoc;
};
export const CampaignUserContext = createContext<CampaignUserContextType>(
  undefined!,
);
