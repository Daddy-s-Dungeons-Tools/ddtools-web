import {
  BattleMap,
  Campaign,
  Character,
  LogItem,
  Note,
  UserID,
  WorldMap,
} from "ddtools-types";
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
import { updateMessage } from "utils";
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

    await setDoc(doc(this.campaignCollection, docId), campaignDoc);
    return LogAPI.add(docId, {
      type: "campaign created",
      sourceUserIds: dmUserIds,
    });
  }

  /** Updates the name, description, and/or color of a campaign. */
  public static async updateDetails(
    campaignId: string,
    updates: PartialWithFieldValue<
      Pick<Campaign, "name" | "description" | "color">
    >,
  ) {
    await updateDoc(doc(this.campaignCollection, campaignId), updates);

    return LogAPI.add(campaignId, {
      type: "campaign updated",
      payload: updates,
      message: updateMessage(updates),
      sourceUserIds: auth.currentUser ? [auth.currentUser.uid] : [],
    });
  }

  /** Add desired users (by their user IDs) to a campaign. */
  public static async addUsers(
    campaignId: string,
    as: "player" | "dm",
    userIds: string[],
  ) {
    await updateDoc(
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
  public static async addUserInvites(
    campaignId: string,
    as: "player" | "dm",
    userEmails: string[],
  ) {
    await updateDoc(
      doc(this.campaignCollection, campaignId).withConverter(
        this.campaignConverter,
      ),
      {
        [as === "player" ? "playerInviteEmails" : "dmInviteEmails"]: arrayUnion(
          ...userEmails,
        ),
      },
    );

    return LogAPI.add(campaignId, {
      type: "player invited",
      message: `Invites for ${as} sent to \`${userEmails.join(", ")}\``,
      sourceUserIds: auth.currentUser ? [auth.currentUser.uid] : [],
    });
  }

  /** Remove the desired user invites (by their emails) from a campaign. */
  public static async removeUserInvites(
    campaignId: string,
    as: "player" | "dm",
    userEmails: string[],
  ) {
    await updateDoc(
      doc(this.campaignCollection, campaignId).withConverter(
        this.campaignConverter,
      ),
      {
        [as === "player" ? "playerInviteEmails" : "dmInviteEmails"]:
          arrayRemove(...userEmails),
      },
    );

    return LogAPI.add(campaignId, {
      type: "player uninvited",
      message: `Invites for ${as} removed for \`${userEmails.join(", ")}\``,
      sourceUserIds: auth.currentUser ? [auth.currentUser.uid] : [],
    });
  }
}
export abstract class LogAPI {
  private static logConverter = converter as FirestoreDataConverter<LogItem>;
  private static campaignCollection = collection(firestore, "campaigns");

  /** Add an item to a campaign's log. */
  public static add(
    campaignId: string,
    item: WithFieldValue<
      Pick<
        LogItem,
        "type" | "message" | "payload" | "sourceUserIds" | "targetUserIds"
      >
    >,
  ) {
    const logCollection = collection(
      this.campaignCollection,
      campaignId,
      "log",
    ).withConverter(this.logConverter);
    return addDoc(logCollection, { ...item, createdAt: serverTimestamp() });
  }

  /** Update an item in a campaign's log. */
  public static update(
    campaignId: string,
    logItemId: string,
    itemUpdates: PartialWithFieldValue<
      Pick<
        LogItem,
        "type" | "message" | "payload" | "sourceUserIds" | "targetUserIds"
      >
    >,
  ) {
    const logCollection = collection(
      this.campaignCollection,
      campaignId,
      "log",
    ).withConverter(this.logConverter);
    return updateDoc(doc(logCollection, logItemId), {
      ...itemUpdates,
      updatedAt: serverTimestamp(),
    });
  }
}
export abstract class CharacterAPI {
  private static characterConverter =
    converter as FirestoreDataConverter<Character>;
  private static campaignCollection = collection(firestore, "campaigns");

  public static async setCampaignPlayerCharacter(
    campaignId: string,
    userId: UserID,
    character: Character,
  ) {
    const campaignCharacterCollection = collection(
      this.campaignCollection,
      campaignId,
      "characters",
    ).withConverter(CharacterAPI.characterConverter);

    await setDoc(doc(campaignCharacterCollection, userId), {
      ...character,
      createdAt: serverTimestamp(),
      ownerUserId: userId,
    });

    // return LogAPI.log(campaignId, {
    //   type: "character-created",
    //   message: `Created character ${character.name}`,
    //   sourceUserIds: auth.currentUser ? [auth.currentUser.uid] : [],
    // });
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

    return updateDoc(doc(notesCollection, noteId), {
      ...updates,
      updatedAt: new Date(),
    });
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

export abstract class WorldMapAPI {
  private static mapConverter = converter as FirestoreDataConverter<WorldMap>;
  private static campaignCollection = collection(firestore, "campaigns");

  /** Add a new world map for a particular campaign. */
  public static add(
    userId: string,
    campaignId: string,
    map: WithFieldValue<WorldMap>,
  ) {
    const mapsCollection = collection(
      this.campaignCollection,
      campaignId,
      "worldmaps",
    ).withConverter(this.mapConverter);
    return addDoc(mapsCollection, {
      ...map,
      ownerUserId: userId,
      createdAt: serverTimestamp(),
      sharedWith: [],
    });
  }

  public static update(
    campaignId: string,
    mapId: FirestoreDoc["id"],
    updates: PartialWithFieldValue<WorldMap>,
  ) {
    const mapsCollection = collection(
      this.campaignCollection,
      campaignId,
      "worldmaps",
    ).withConverter(this.mapConverter);

    return updateDoc(doc(mapsCollection, mapId), {
      ...updates,
      updatedAt: new Date(),
    });
  }

  /** Deletes a map for a particular particular campaign. Can be empty. */
  public static delete(campaignId: string, mapId: FirestoreDoc["id"]) {
    const mapsCollection = collection(
      this.campaignCollection,
      campaignId,
      "worldmaps",
    ).withConverter(this.mapConverter);
    return deleteDoc(doc(mapsCollection, mapId));
  }
}

export abstract class BattleMapAPI {
  private static mapConverter = converter as FirestoreDataConverter<BattleMap>;
  private static campaignCollection = collection(firestore, "campaigns");

  /** Add a new battle map for a particular campaign. */
  public static async add(
    userId: string,
    campaignId: string,
    map: WithFieldValue<Pick<BattleMap, "name">>,
  ) {
    const mapsCollection = collection(
      this.campaignCollection,
      campaignId,
      "battlemaps",
    ).withConverter(this.mapConverter);
    await addDoc(mapsCollection, {
      ...map,
      gridCellSize: 50,
      gridTotalHeight: 50 * 10,
      gridTotalWidth: 50 * 15,
      isActive: false,
      ownerUserId: userId,
      createdAt: serverTimestamp(),
      sharedWith: [],
    });

    return LogAPI.add(campaignId, {
      message: `Battle map \`${map.name}\` created`,
      type: "battle map created",
      sourceUserIds: [userId],
    });
  }

  public static update(
    campaignId: string,
    mapId: FirestoreDoc["id"],
    updates: PartialWithFieldValue<BattleMap>,
  ) {
    const mapsCollection = collection(
      this.campaignCollection,
      campaignId,
      "battlemaps",
    ).withConverter(this.mapConverter);

    return updateDoc(doc(mapsCollection, mapId), {
      ...updates,
      updatedAt: new Date(),
    });
  }

  /** Deletes a battle map for a particular campaign. Can be empty. */
  public static async delete(campaignId: string, mapId: FirestoreDoc["id"]) {
    const mapsCollection = collection(
      this.campaignCollection,
      campaignId,
      "worldmaps",
    ).withConverter(this.mapConverter);
    await deleteDoc(doc(mapsCollection, mapId));
    LogAPI.add(campaignId, {
      type: "battle map deleted",
      payload: {
        mapId,
      },
      sourceUserIds: auth.currentUser ? [auth.currentUser.uid] : [],
    });
  }
}
