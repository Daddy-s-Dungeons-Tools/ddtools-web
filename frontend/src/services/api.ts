import { collection, doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "./firebase";

export function addCampaign(name: string, dmInviteEmails: string[]) {
  if (!name || name.trim().length === 0) return;

  const docId = name.toLowerCase().replaceAll(" ", "-");

  // TODO: CHECK IF DOCID ALREADY EXISTS

  return setDoc(doc(collection(firestore, "campaigns"), docId), {
    name,
    dmUserIds: [auth.currentUser?.uid],
    dmInviteEmails,
  });
}
