import {
  ABILITIES,
  Campaign,
  CampaignUserSummaries,
  LogItem,
  UserID,
} from "ddtools-types";
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
 * Add a new log item to a campaign.
 *
 * @param {string} campaignId
 * @param {LogItem} item
 * @return {Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>>}
 */
function logToCampaign(campaignId: string, item: LogItem) {
  return db.collection(`campaigns/${campaignId}/log`).add(item);
}

/**
 *
 * @param {functions.firestore.DocumentSnapshot} campaignSnap
 * @param {UserID[]} userIds
 * @return {Promise<CampaignUserSummaries>}
 */
async function generateCampaignUserSummaries(
  campaignSnap: functions.firestore.DocumentSnapshot,
  userIds: UserID[],
): Promise<CampaignUserSummaries> {
  const campaign = campaignSnap.data() as Campaign;

  // Construct user summaries for desired players
  const userSummaries: CampaignUserSummaries = {};
  const usersResult = await getAuth(app).getUsers(
    userIds.map((uid) => ({ uid })),
  );
  for (const user of usersResult.users) {
    const displayName = user.displayName || user.email!;
    ABILITIES;
    if (campaign.dmUserIds?.includes(user.uid)) {
      userSummaries[user.uid] = {
        as: "dm",
        displayName,
      };
    } else if (campaign.playerUserIds?.includes(user.uid)) {
      userSummaries[user.uid] = {
        as: "player",
        displayName,
        // TODO: currentCharacterName
      };
    }
  }

  return userSummaries;
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
      await logToCampaign(change.after.id, {
        type: "campaign-created",
        message: `Campaign ${campaign.name} was created`,
        createdAt: new Date(),
        sourceUserIds: campaign.dmUserIds,
      });
    }

    const previousDMUserIds = change.before.exists
      ? change.before.data()!.dmUserIds
      : undefined;
    const previousPlayerUserIds = change.before.exists
      ? change.before.data()!.playerUserIds
      : undefined;
    if (
      !arrayEqual(previousDMUserIds, campaign.dmUserIds) ||
      !arrayEqual(previousPlayerUserIds, campaign.playerUserIds)
    ) {
      functions.logger.info("Campaign users have changed");
      // Calculate user summaries
      const userIds = [
        ...(campaign.dmUserIds ?? []),
        ...(campaign.playerUserIds ?? []),
      ];
      const userSummaries = await generateCampaignUserSummaries(
        change.after,
        userIds,
      );
      await change.after.ref.update({
        userSummaries: userSummaries,
      });
    }
  });
