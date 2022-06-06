import {
  Campaign,
  Note,
  Audio,
  LogItem,
  UserID,
  Character,
} from "ddtools-types";
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
  PartialWithFieldValue,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { converterFactory } from "./converter";
import { auth, firestore, storage } from "./firebase";

const DATA_URL_PREFIX =
  "https://raw.githubusercontent.com/Daddy-s-Dungeons-Tools/ddtools-data/main/";

const campaignCollection = collection(firestore, "campaigns").withConverter(
  converterFactory<Campaign>(),
);

const campaignConverter = converterFactory<Campaign>();
const noteConverter = converterFactory<Note>();
const logConverter = converterFactory<LogItem>();
const characterConverter = converterFactory<Character>();

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
  ).withConverter(converterFactory<Note>());
  return addDoc(notesCollection, {
    ownerUserId: userId,
    createdAt: serverTimestamp(),
    sharedWith: [],
    ...note,
  });
}

export async function addCampaignAudioFiles(
  campaignId: Campaign["id"],
  files: File[],
) {
  const audioCollection = collection(
    firestore,
    "campaigns",
    campaignId,
    "audio",
  ).withConverter(converterFactory<Audio>());

  for (const file of files) {
    const fileRef = ref(storage, "campaigns/" + campaignId + "/" + file.name);
    const uploadResult = await uploadBytes(fileRef, file);

    await addDoc(audioCollection, {
      createdAt: new Date().getTime(),
      filePath: uploadResult.ref.fullPath,
      name: file.name,
      ownerUserId: "",
      sharedWith: [],
      defaultVolume: 100,
    });
  }
}

/** Fetch a data source from the GitHub ddtools-data repository. */
export async function fetchData<T>(filename: string): Promise<T[]> {
  const response = await fetch(DATA_URL_PREFIX + filename);
  const data = await response.json();
  return data;
}

export abstract class CampaignAPI {
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

    return setDoc(
      doc(campaignCollection, docId).withConverter(campaignConverter),
      campaignDoc,
    );
  }

  public static updateDetails(
    campaignId: Campaign["id"],
    updates: PartialWithFieldValue<
      Pick<Campaign, "name" | "description" | "color">
    >,
  ) {
    return updateDoc(
      doc(campaignCollection, campaignId).withConverter(campaignConverter),
      updates,
    );
  }

  /** Add desired users (by their user IDs) to a campaign. */
  public static addUsers(
    campaignId: Campaign["id"],
    as: "player" | "dm",
    userIds: string[],
  ) {
    return updateDoc(
      doc(campaignCollection, campaignId).withConverter(campaignConverter),
      {
        [as === "player" ? "playerUserIds" : "dmUserIds"]: arrayUnion(
          ...userIds,
        ),
      },
    );
  }

  /** Add the desired user invites (by their user IDs) from a campaign. */
  public static addUserInvites(
    campaignId: Campaign["id"],
    as: "player" | "dm",
    userEmails: string[],
  ) {
    return updateDoc(
      doc(campaignCollection, campaignId).withConverter(campaignConverter),
      {
        [as === "player" ? "playerInviteEmails" : "dmInviteEmails"]: arrayUnion(
          ...userEmails,
        ),
      },
    );
  }

  /** Remove the desired user invites (by their emails) from a campaign. */
  public static removeUserInvites(
    campaignId: Campaign["id"],
    as: "player" | "dm",
    userEmails: string[],
  ) {
    return updateDoc(
      doc(campaignCollection, campaignId).withConverter(campaignConverter),
      {
        [as === "player" ? "playerInviteEmails" : "dmInviteEmails"]:
          arrayRemove(...userEmails),
      },
    );
  }

  /** Add an item to a campaign's log. */
  public static log(
    campaignId: Campaign["id"],
    item: PartialWithFieldValue<LogItem>,
  ) {
    const logCollection = collection(
      firestore,
      "campaigns",
      campaignId,
      "log",
    ).withConverter(logConverter);
    return addDoc(logCollection, item);
  }
}

export abstract class CharacterAPI {
  public static setCampaignPlayerCharacter(
    campaignId: Campaign["id"],
    userId: UserID,
    character: Character,
  ) {
    const campaignCharacterCollection = collection(
      firestore,
      "campaigns",
      campaignId,
      "characters",
    ).withConverter(characterConverter);

    return setDoc(doc(campaignCharacterCollection, userId), {
      ...character,
      createdAt: new Date().getTime(),
      ownerUserId: userId,
    });
  }
}
