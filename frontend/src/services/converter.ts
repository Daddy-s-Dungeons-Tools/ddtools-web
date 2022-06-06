import { Timestamped } from "ddtools-types";
import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  PartialWithFieldValue,
  DocumentSnapshot,
} from "firebase/firestore";

export type FirestoreDoc = {
  id: DocumentSnapshot<DocumentData>["id"];
  ref: DocumentSnapshot<DocumentData>["ref"];
};

function customToFirestore<T extends object>(
  obj: PartialWithFieldValue<T>,
): DocumentData {
  const o = { ...obj };
  return o;
}

function customFromFirestore<T>(
  snapshot: QueryDocumentSnapshot,
  options: SnapshotOptions,
): T & FirestoreDoc {
  const data = snapshot.data(options);

  try {
    data.createdAt = data.createdAt?.toDate() ?? new Date();
    data.updatedAt = data.updatedAt?.toDate() ?? new Date();
  } catch (error) {}

  return {
    ...(data as T),
    id: snapshot.id,
    ref: snapshot.ref,
  };
}

export const converter = {
  toFirestore: customToFirestore,
  fromFirestore: customFromFirestore,
};
