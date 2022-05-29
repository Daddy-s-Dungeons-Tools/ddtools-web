import { Campaign } from "ddtools-types";
import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

/** Firebase admin app with full permissions */
const app = initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const arrayEqual = (arr1: any[] | undefined, arr2: any[] | undefined) =>
  JSON.stringify(arr1) === JSON.stringify(arr2);

export const modifyCampaign = functions.firestore
  .document("campaigns/{campaignId}")
  .onWrite(async (change, context) => {
    // Get an object with the current document value.
    // If the document does not exist, it has been deleted.
    const campaign: Campaign | null = change.after.exists
      ? (change.after.data() as Campaign)
      : null;

    if (!campaign) {
      return;
    }

    const previousDMUserIds = change.before.exists
      ? change.before.data()!.dmUserIds
      : undefined;
    if (!arrayEqual(previousDMUserIds, campaign.dmUserIds)) {
      functions.logger.info("DMs have changed");
      // Calculate DM user summaries
      const dmUserSummaries: Campaign["dmUserSummaries"] = {};
      if (campaign.dmUserIds) {
        const dmUsersResult = await getAuth(app).getUsers(
          campaign.dmUserIds?.map((uid) => ({ uid })),
        );

        for (const dmUser of dmUsersResult.users) {
          dmUserSummaries[dmUser.uid] = {
            displayName: dmUser.displayName ?? null,
          };
        }
      }

      await change.after.ref.update({
        dmUserSummaries,
      });
    }

    const previousPlayerUserIds = change.before.exists
      ? change.before.data()!.playerUserIds
      : undefined;
    if (!arrayEqual(previousPlayerUserIds, campaign.playerUserIds)) {
      functions.logger.info("Players have changed");
      // Calculate player user summaries
      const playerUserSummaries: Campaign["playerUserSummaries"] = {};
      if (campaign.playerUserIds) {
        const playerUsersResult = await getAuth(app).getUsers(
          campaign.playerUserIds?.map((uid) => ({ uid })),
        );

        for (const dmUser of playerUsersResult.users) {
          playerUserSummaries[dmUser.uid] = {
            displayName: dmUser.displayName ?? null,
          };
        }
      }
      await change.after.ref.update({
        playerUserSummaries,
      });
    }
  });
