import { FirestoreDoc } from "ddtools-types";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  PartialWithFieldValue,
} from "firebase/firestore";

function customToFirestore<T extends FirestoreDoc>(
  obj: PartialWithFieldValue<T>,
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

export function converterFactory<T>(): FirestoreDataConverter<T> {
  return {
    toFirestore: customToFirestore,
    fromFirestore: customFromFirestore,
  };
}
