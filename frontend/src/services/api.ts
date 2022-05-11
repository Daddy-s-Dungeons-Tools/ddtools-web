import { Campaign } from "ddtools-types";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { campaignConverter } from "./converter";
import { auth, firestore } from "./firebase";

const campaignCollection = collection(firestore, "campaigns").withConverter(
  campaignConverter
);

export function addCampaign(name: string, dmInviteEmails: string[]) {
  if (!name || name.trim().length === 0) return;

  const docId = name.toLowerCase().replaceAll(" ", "-");

  // TODO: CHECK IF DOCID ALREADY EXISTS

  const dmUserIds = [];
  if (auth.currentUser?.uid) {
    dmUserIds.push(auth.currentUser.uid);
  }

  return setDoc(doc(campaignCollection, docId), {
    name,
    dmUserIds,
    dmInviteEmails,
  });
}

export function addPlayersToCampaign(
  campaignId: Campaign["id"],
  playerUserIds: string[]
) {
  return updateDoc(doc(campaignCollection, campaignId), {
    playerUserIds: arrayUnion(...playerUserIds),
  });
}

export function removePlayerCampaignInvites(
  campaignId: Campaign["id"],
  playerUserEmails: string[]
) {
  return updateDoc(doc(campaignCollection, campaignId), {
    playerInviteEmails: arrayRemove(...playerUserEmails),
  });
}
