import { Avatar, AvatarProps, Tooltip } from "@chakra-ui/react";
import { CampaignUserSummaries, CampaignUserSummary } from "ddtools-types";
import { User } from "firebase/auth";
import { ref } from "firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { storage } from "../../services/firebase";

type UserAvatarPropTypes = {
  userAs?: "player" | "dm";
  userId: User["uid"];
  userDisplayName: User["displayName"];
  playerCharacterName?: string;
} & AvatarProps;

/** Wrapper around Chakra UI's Avatar that attempts to load a user's uploaded avatar. */
export function UserAvatar({
  userAs,
  userId,
  userDisplayName,
  playerCharacterName,
  ...props
}: UserAvatarPropTypes) {
  const [downloadURL] = useDownloadURL(
    ref(storage, "/characters/avatars/" + userId + ".png"),
  );
  let tooltipLabel = userDisplayName;
  if (userAs === "player") {
    tooltipLabel = playerCharacterName
      ? `${playerCharacterName} (${userDisplayName})`
      : "Player " + userDisplayName;
  } else if (userAs === "dm") {
    tooltipLabel = "DM " + userDisplayName;
  }
  return (
    <Tooltip label={tooltipLabel}>
      <Avatar
        src={downloadURL}
        name={userDisplayName ?? undefined}
        {...props}
      />
    </Tooltip>
  );
}

/** Wrapper around UserAvatar that determines the display name and role from a user summaries object. */
export function UserAvatarFromSummary({
  userId,
  userSummaries,
  ...props
}: { userSummaries?: CampaignUserSummaries } & Omit<
  UserAvatarPropTypes,
  "userDisplayName"
>) {
  let displayName = "Unknown User";
  let userAs: CampaignUserSummary["as"] = "player";
  let playerCharacterName;

  if (userSummaries && userId in userSummaries) {
    const userSummary = userSummaries[userId];
    displayName = userSummary.displayName;
    userAs = userSummary.as;
    if (userSummary.as === "player") {
      playerCharacterName = userSummary.currentCharacterName;
    }
  }

  return (
    <UserAvatar
      userId={userId}
      userDisplayName={displayName}
      userAs={userAs}
      playerCharacterName={playerCharacterName}
      {...props}
    />
  );
}
