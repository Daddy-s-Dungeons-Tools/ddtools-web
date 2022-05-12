import { Campaign } from "ddtools-types";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { campaignConverter } from "./converter";
import { auth, firestore } from "./firebase";

const campaignCollection = collection(firestore, "campaigns").withConverter(
  campaignConverter
);

/** Add a new campaign with the desired name and DM invitations. */
export async function addCampaign({
  name,
  dmInviteEmails,
}: {
  name: string;
  dmInviteEmails: string[];
}) {
  if (!name || name.trim().length === 0) return;

  const docId = name.toLowerCase().replaceAll(" ", "-");

  // CHECK IF DOCID ALREADY EXISTS
  if ((await getDoc(doc(campaignCollection, docId))).exists()) {
    throw new Error("Campaign already exists with that ID.");
  }

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

/** Add desired players (by their user IDs) to a campaign. */
export function addPlayersToCampaign(
  campaignId: Campaign["id"],
  playerUserIds: string[]
) {
  return updateDoc(doc(campaignCollection, campaignId), {
    playerUserIds: arrayUnion(...playerUserIds),
  });
}

/** Remove the desired players (by their user IDs) from a campaign. */
export function removePlayerCampaignInvites(
  campaignId: Campaign["id"],
  playerUserEmails: string[]
) {
  return updateDoc(doc(campaignCollection, campaignId), {
    playerInviteEmails: arrayRemove(...playerUserEmails),
  });
}
