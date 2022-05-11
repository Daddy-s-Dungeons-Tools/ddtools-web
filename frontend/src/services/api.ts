import { collection, doc, setDoc } from "firebase/firestore";
import { campaignConverter } from "./converter";
import { auth, firestore } from "./firebase";

export function addCampaign(name: string, dmInviteEmails: string[]) {
  if (!name || name.trim().length === 0) return;

  const docId = name.toLowerCase().replaceAll(" ", "-");

  // TODO: CHECK IF DOCID ALREADY EXISTS
  const col = collection(firestore, "campaigns").withConverter(
    campaignConverter
  );

  const dmUserIds = [];
  if (auth.currentUser?.uid) {
    dmUserIds.push(auth.currentUser.uid);
  }

  return setDoc(doc(col, docId), {
    name,
    dmUserIds,
    dmInviteEmails,
  });
}
