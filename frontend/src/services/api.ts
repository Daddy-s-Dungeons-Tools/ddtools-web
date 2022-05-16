import { Campaign, Note } from "ddtools-types";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { campaignConverter, noteConverter } from "./converter";
import { auth, firestore } from "./firebase";

const campaignCollection = collection(firestore, "campaigns").withConverter(
  campaignConverter
);

/** Add a new campaign with the desired name and DM invitations. */
export async function addCampaign({
  name,
  dmInviteEmails,
  color,
}: {
  name: string;
  dmInviteEmails: string[];
  color?: string;
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

  // Filter empty values
  dmInviteEmails = dmInviteEmails.filter((email) => !!email);

  const campaignDoc: Campaign = {
    name,
    dmUserIds,
    dmInviteEmails,
    mode: "out-of-combat",
    createdAt: new Date().getTime(),
  };

  // Optional starting values
  if (color) {
    campaignDoc.color = color;
  }

  return setDoc(doc(campaignCollection, docId), campaignDoc);
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

/** Add a new note for a particular user in a particular campaign. Can be empty. */
export function addNote(
  userId: string,
  campaignId: Campaign["id"],
  note?: Partial<Omit<Note, "timestamp" | "authorUserId">>
) {
  const notesCollection = collection(
    firestore,
    "campaigns",
    campaignId,
    "notes"
  ).withConverter(noteConverter);
  return addDoc(notesCollection, {
    ownerUserId: userId,
    createdAt: serverTimestamp(),
    sharedWith: [],
    ...note,
  });
}
