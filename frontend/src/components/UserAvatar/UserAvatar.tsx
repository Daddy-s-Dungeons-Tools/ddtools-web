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
} & AvatarProps;

/** Wrapper around Chakra UI's Avatar that attempts to load a user's uploaded avatar. */
export function UserAvatar({
  userAs,
  userId,
  userDisplayName,
  ...props
}: UserAvatarPropTypes) {
  const [downloadURL] = useDownloadURL(
    ref(storage, "/users/avatars/" + userId + ".png"),
  );
  let tooltipLabel = userDisplayName;
  if (userAs === "player") {
    tooltipLabel = "Player " + userDisplayName;
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

  if (userSummaries && userId in userSummaries) {
    const userSummary = userSummaries[userId];
    displayName = userSummary.displayName;
    userAs = userSummary.as;
  }

  return (
    <UserAvatar
      userId={userId}
      userDisplayName={displayName}
      userAs={userAs}
      {...props}
    />
  );
}
