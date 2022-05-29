import { Campaign, EventLogItem } from "ddtools-types";
import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/** Firebase admin app with full permissions */
const app = initializeApp();

const db = getFirestore(app);

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const arrayEqual = (arr1: any[] | undefined, arr2: any[] | undefined) =>
  JSON.stringify(arr1) === JSON.stringify(arr2);

/**
 * ASdasd
 * @param {string} campaignId
 * @param {EventLogItem} item
 * @return {Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>>}
 */
function logEvent(campaignId: Campaign["id"], item: EventLogItem) {
  return db.collection(`campaigns/${campaignId}/eventLog`).add(item);
}

/**
 * Updates the player user summaries for a campaign document.
 *
 * @param {functions.firestore.DocumentSnapshot} campaignSnap
 */
async function updateCampaignUserSummaries(
  campaignSnap: functions.firestore.DocumentSnapshot,
) {
  const campaign = campaignSnap.data() as Campaign;
  const userIds = campaign.playerUserIds ?? [];

  // Construct player user summaries for all players
  const playerUserSummaries: Campaign["playerUserSummaries"] = {};
  const playerUsersResult = await getAuth(app).getUsers(
    userIds.map((uid) => ({ uid })),
  );
  for (const user of playerUsersResult.users) {
    playerUserSummaries[user.uid] = {
      displayName: user.displayName || user.email!,
    };
  }

  // Update campaign
  await campaignSnap.ref.update({
    playerUserSummaries,
  });
}

/**
 * Updates the DM user summaries for a campaign document.
 *
 * @param {functions.firestore.DocumentSnapshot} campaignSnap
 */
async function updateCampaignDMSummaries(
  campaignSnap: functions.firestore.DocumentSnapshot,
) {
  const campaign = campaignSnap.data() as Campaign;
  const userIds = campaign.dmUserIds ?? [];

  // Construct DM user summaries for all players
  const dmUserSummaries: Campaign["dmUserSummaries"] = {};
  const dmUsersResult = await getAuth(app).getUsers(
    userIds.map((uid) => ({ uid })),
  );
  for (const user of dmUsersResult.users) {
    dmUserSummaries[user.uid] = {
      displayName: user.displayName || user.email!,
    };
  }

  // Update campaign
  await campaignSnap.ref.update({
    dmUserSummaries,
  });
}

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

    if (!change.before.exists) {
      await logEvent(change.after.id, {
        type: "campaign-created",
        message: `Campaign ${campaign.name} was created`,
        createdAt: new Date().getTime(),
        sourceUserIds: campaign.dmUserIds,
      });
    }

    const previousDMUserIds = change.before.exists
      ? change.before.data()!.dmUserIds
      : undefined;
    if (!arrayEqual(previousDMUserIds, campaign.dmUserIds)) {
      functions.logger.info("DMs have changed");
      await updateCampaignDMSummaries(change.after);
    }

    const previousPlayerUserIds = change.before.exists
      ? change.before.data()!.playerUserIds
      : undefined;
    if (!arrayEqual(previousPlayerUserIds, campaign.playerUserIds)) {
      functions.logger.info("Players have changed");
      // Calculate player user summaries
      await updateCampaignUserSummaries(change.after);
    }
  });
