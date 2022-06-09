import { Campaign, Character, LogItem, Note, UserID } from "ddtools-types";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  FirestoreDataConverter,
  getDoc,
  PartialWithFieldValue,
  serverTimestamp,
  setDoc,
  updateDoc,
  WithFieldValue,
} from "firebase/firestore";
import { converter, FirestoreDoc } from "./converter";
import { auth, firestore } from "./firebase";

const DATA_URL_PREFIX =
  "https://raw.githubusercontent.com/Daddy-s-Dungeons-Tools/ddtools-data/main/";

// export async function addCampaignAudioFiles(campaignId: string, files: File[]) {
//   const audioCollection = collection(
//     campaignCollection,
//     campaignId,
//     "audio",
//   ).withConverter(converterFactory<Audio>());

//   for (const file of files) {
//     const fileRef = ref(storage, "campaigns/" + campaignId + "/" + file.name);
//     const uploadResult = await uploadBytes(fileRef, file);

//     await addDoc(audioCollection, {
//       createdAt: new Date(),
//       filePath: uploadResult.ref.fullPath,
//       name: file.name,
//       ownerUserId: "",
//       sharedWith: [],
//       defaultVolume: 100,
//     });
//   }
// }

/** Fetch a data source from the GitHub ddtools-data repository. */
export async function fetchData<T>(filename: string): Promise<T[]> {
  const response = await fetch(DATA_URL_PREFIX + filename);
  const data = await response.json();
  return data;
}

export abstract class CampaignAPI {
  private static campaignConverter = converter as FirestoreDataConverter<
    Campaign & FirestoreDoc
  >;
  private static campaignCollection = collection(
    firestore,
    "campaigns",
  ).withConverter(this.campaignConverter);

  /** Add a new campaign with the desired name and DM invitations. */
  public static async add({
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
    while ((await getDoc(doc(this.campaignCollection, docId))).exists()) {
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

    const campaignDoc: WithFieldValue<Campaign> = {
      name,
      dmUserIds,
      dmInviteEmails,
      mode: "out-of-combat",
      createdAt: serverTimestamp(),
    };

    // Optional starting values
    if (color) {
      campaignDoc.color = color;
    }

    return setDoc(doc(this.campaignCollection, docId), campaignDoc);
  }

  /** Updates the name, description, and/or color of a campaign. */
  public static updateDetails(
    campaignId: string,
    updates: PartialWithFieldValue<
      Pick<Campaign, "name" | "description" | "color">
    >,
  ) {
    return updateDoc(doc(this.campaignCollection, campaignId), updates);
  }

  /** Add desired users (by their user IDs) to a campaign. */
  public static addUsers(
    campaignId: string,
    as: "player" | "dm",
    userIds: string[],
  ) {
    return updateDoc(
      doc(this.campaignCollection, campaignId).withConverter(
        this.campaignConverter,
      ),
      {
        [as === "player" ? "playerUserIds" : "dmUserIds"]: arrayUnion(
          ...userIds,
        ),
      },
    );
  }

  /** Add the desired user invites (by their user IDs) from a campaign. */
  public static addUserInvites(
    campaignId: string,
    as: "player" | "dm",
    userEmails: string[],
  ) {
    return updateDoc(
      doc(this.campaignCollection, campaignId).withConverter(
        this.campaignConverter,
      ),
      {
        [as === "player" ? "playerInviteEmails" : "dmInviteEmails"]: arrayUnion(
          ...userEmails,
        ),
      },
    );
  }

  /** Remove the desired user invites (by their emails) from a campaign. */
  public static removeUserInvites(
    campaignId: string,
    as: "player" | "dm",
    userEmails: string[],
  ) {
    return updateDoc(
      doc(this.campaignCollection, campaignId).withConverter(
        this.campaignConverter,
      ),
      {
        [as === "player" ? "playerInviteEmails" : "dmInviteEmails"]:
          arrayRemove(...userEmails),
      },
    );
  }
}
export abstract class LogAPI {
  private static logConverter = converter as FirestoreDataConverter<LogItem>;
  private static campaignCollection = collection(firestore, "campaigns");

  /** Add an item to a campaign's log. */
  public static log(campaignId: string, item: WithFieldValue<LogItem>) {
    const logCollection = collection(
      this.campaignCollection,
      campaignId,
      "log",
    ).withConverter(this.logConverter);
    return addDoc(logCollection, { ...item, createdAt: serverTimestamp() });
  }
}
export abstract class CharacterAPI {
  private static characterConverter =
    converter as FirestoreDataConverter<Character>;
  private static campaignCollection = collection(firestore, "campaigns");

  public static setCampaignPlayerCharacter(
    campaignId: string,
    userId: UserID,
    character: Character,
  ) {
    const campaignCharacterCollection = collection(
      this.campaignCollection,
      campaignId,
      "characters",
    ).withConverter(CharacterAPI.characterConverter);

    return setDoc(doc(campaignCharacterCollection, userId), {
      ...character,
      createdAt: serverTimestamp(),
      ownerUserId: userId,
    });
  }
}

export abstract class NoteAPI {
  private static noteConverter = converter as FirestoreDataConverter<Note>;
  private static campaignCollection = collection(firestore, "campaigns");

  /** Add a new note for a particular user in a particular campaign. Can be empty. */
  public static add(
    userId: string,
    campaignId: string,
    note: WithFieldValue<Note>,
  ) {
    const notesCollection = collection(
      this.campaignCollection,
      campaignId,
      "notes",
    ).withConverter(NoteAPI.noteConverter);
    return addDoc(notesCollection, {
      ...note,
      ownerUserId: userId,
      createdAt: serverTimestamp(),
      sharedWith: [],
    });
  }

  public static update(
    campaignId: string,
    noteId: FirestoreDoc["id"],
    updates: PartialWithFieldValue<Note>,
  ) {
    const notesCollection = collection(
      this.campaignCollection,
      campaignId,
      "notes",
    ).withConverter(this.noteConverter);

    return updateDoc(doc(notesCollection, noteId), updates);
  }

  /** Add a new note for a particular user in a particular campaign. Can be empty. */
  public static delete(campaignId: string, noteId: FirestoreDoc["id"]) {
    const notesCollection = collection(
      this.campaignCollection,
      campaignId,
      "notes",
    );
    return deleteDoc(doc(notesCollection, noteId));
  }
}
