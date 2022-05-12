import { Campaign, Note } from "ddtools-types";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";

export const campaignConverter: FirestoreDataConverter<Campaign> = {
  toFirestore(campaign: WithFieldValue<Campaign>): DocumentData {
    const c = { ...campaign };
    delete c.ref;
    delete c.id;
    return c;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Campaign {
    const data = snapshot.data(options) as Campaign;
    return {
      ...data,
      id: snapshot.id,
      ref: snapshot.ref,
    };
  },
};

export const noteConverter: FirestoreDataConverter<Note> = {
  toFirestore(note: WithFieldValue<Note>): DocumentData {
    const n = { ...note };
    delete n.ref;
    delete n.id;
    return n;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Note {
    const data = snapshot.data(options) as Note;
    return {
      ...data,
      id: snapshot.id,
      ref: snapshot.ref,
    };
  },
};
