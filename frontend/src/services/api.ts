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

/** Add desired users (by their user IDs) to a campaign. */
export function addUsersToCampaigns(
  campaignId: Campaign["id"],
  as: "player" | "dm",
  userIds: string[]
) {
  return updateDoc(doc(campaignCollection, campaignId), {
    [as === "player" ? "playerUserIds" : "dmUserIds"]: arrayUnion(...userIds),
  });
}

/** Remove the desired players (by their user IDs) from a campaign. */
export function removeUserCampaignInvites(
  campaignId: Campaign["id"],
  as: "player" | "dm",
  userEmails: string[]
) {
  return updateDoc(doc(campaignCollection, campaignId), {
    [as === "player" ? "playerInviteEmails" : "dmInviteEmails"]: arrayRemove(
      ...userEmails
    ),
  });
}
