import { Audio, Campaign, FirestoreDoc, Note } from "ddtools-types";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";

function customToFirestore<T extends FirestoreDoc>(
  obj: WithFieldValue<T>,
): DocumentData {
  const o = { ...obj };
  delete o.ref;
  delete o.id;
  return o;
}

function customFromFirestore<T extends FirestoreDoc>(
  snapshot: QueryDocumentSnapshot,
  options: SnapshotOptions,
): T {
  const data = snapshot.data(options) as T;
  return {
    ...data,
    id: snapshot.id,
    ref: snapshot.ref,
  };
}

export const campaignConverter: FirestoreDataConverter<Campaign> = {
  toFirestore: customToFirestore,
  fromFirestore: customFromFirestore,
};

export const noteConverter: FirestoreDataConverter<Note> = {
  toFirestore: customToFirestore,
  fromFirestore: customFromFirestore,
};

export const audioConverter: FirestoreDataConverter<Audio> = {
  toFirestore: customToFirestore,
  fromFirestore: customFromFirestore,
};

export function converterFactory<T>(): FirestoreDataConverter<T> {
  return {
    toFirestore: customToFirestore,
    fromFirestore: customFromFirestore,
  };
}
