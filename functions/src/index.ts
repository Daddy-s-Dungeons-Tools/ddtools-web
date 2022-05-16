import {Campaign} from "ddtools-types";
import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";

/** Firebase admin app with full permissions */
const app = initializeApp();


// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const modifyCampaign = functions.firestore
    .document("campaigns/{campaignId}")
    .onWrite(async (change, context) => {
    // Get an object with the current document value.
    // If the document does not exist, it has been deleted.
      const campaign: Campaign | null = change.after.exists ?
        change.after.data() as Campaign : null;

      // Get an object with the previous document value (for update or delete)
      // const oldCampaign: Campaign | null =
      //   change.before.exists ? change.before.data() as Campaign : null;

      if (!campaign) {
        return;
      }

      // Calculate DM user names
      let dmUserNames: string[] = [];
      if (campaign.dmUserIds) {
        const dmUsers = await getAuth(app)
            .getUsers(campaign.dmUserIds?.map((uid) => ({uid})));

        dmUserNames = dmUsers.users.map((user) =>
          user.displayName?.split(" ")[0] || user.email!);
      }

      return change.after.ref.update({
        dmUserNames,
      });
    });
