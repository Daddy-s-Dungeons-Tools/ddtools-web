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
  campaignConverter,
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

  let docId = name.toLowerCase().replaceAll(" ", "-");
  let counter = 2;

  // CHECK IF DOCID ALREADY EXISTS, TRY TO ADD COUNTER UP TO 100
  while ((await getDoc(doc(campaignCollection, docId))).exists()) {
    console.warn("Campaign already exists with ID " + docId);
    docId = name.toLowerCase().replaceAll(" ", "-") + "-" + counter;
    counter++;

    if (counter > 100) {
      throw new Error("Too many campaigns with that title already exist!");
    }
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
  userIds: string[],
) {
  return updateDoc(doc(campaignCollection, campaignId), {
    [as === "player" ? "playerUserIds" : "dmUserIds"]: arrayUnion(...userIds),
  });
}

/** Add the desired user invites (by their user IDs) from a campaign. */
export function addUserCampaignInvites(
  campaignId: Campaign["id"],
  as: "player" | "dm",
  userEmails: string[],
) {
  return updateDoc(doc(campaignCollection, campaignId), {
    [as === "player" ? "playerInviteEmails" : "dmInviteEmails"]: arrayUnion(
      ...userEmails,
    ),
  });
}

/** Remove the desired user invites (by their emails) from a campaign. */
export function removeUserCampaignInvites(
  campaignId: Campaign["id"],
  as: "player" | "dm",
  userEmails: string[],
) {
  return updateDoc(doc(campaignCollection, campaignId), {
    [as === "player" ? "playerInviteEmails" : "dmInviteEmails"]: arrayRemove(
      ...userEmails,
    ),
  });
}

/** Add a new note for a particular user in a particular campaign. Can be empty. */
export function addNote(
  userId: string,
  campaignId: Campaign["id"],
  note?: Partial<Omit<Note, "timestamp" | "authorUserId">>,
) {
  const notesCollection = collection(
    firestore,
    "campaigns",
    campaignId,
    "notes",
  ).withConverter(noteConverter);
  return addDoc(notesCollection, {
    ownerUserId: userId,
    createdAt: serverTimestamp(),
    sharedWith: [],
    ...note,
  });
}
