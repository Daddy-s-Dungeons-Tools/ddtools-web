import {
  useToast,
  Box,
  UnorderedList,
  ListItem,
  Badge,
  Text,
  Input,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { CampaignAPI } from "../../../../services/api";
import { CampaignUserContext } from "../../CampaignDashboardPage";

export function ManageUsers() {
  const toast = useToast();
  const { campaign } = useContext(CampaignUserContext);

  const [emailsStr, setEmailsStr] = useState<string>("");

  const handleSubmitNewUserInvite = async (as: "player" | "dm") => {
    const newUserInviteEmails = emailsStr
      .trim()
      .split(",")
      .map((email: string) => email.trim())
      .filter((email) => email);

    if (newUserInviteEmails.length === 0) {
      return;
    }

    try {
      await CampaignAPI.addUserInvites(campaign.id, as, newUserInviteEmails);
      setEmailsStr("");

      toast({
        title: `Invited ${newUserInviteEmails.length} Users`,
        description:
          "They can now accept their invite from the campaigns page.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: `Failed to Invite ${newUserInviteEmails.length} Users`,
        description:
          "There was an error inviting the users. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  function InviteListItem({
    userEmail,
    as,
  }: {
    as: "player" | "dm";
    userEmail: string;
  }) {
    return (
      <ListItem
        onClick={() =>
          CampaignAPI.removeUserInvites(campaign.id, as, [userEmail])
        }
        key={userEmail}
      >
        {userEmail}{" "}
        <Badge colorScheme={as === "dm" ? "green" : "teal"}>{as} invite</Badge>
      </ListItem>
    );
  }

  return (
    <Box>
      <UnorderedList spacing={1} mb="3">
        {(!campaign.dmInviteEmails || !campaign.dmInviteEmails.length) &&
          (!campaign.playerInviteEmails ||
            !campaign.playerInviteEmails.length) && (
            <Text color="gray.500">No pending invites!</Text>
          )}
        {campaign.dmInviteEmails?.map((userEmail) => (
          <InviteListItem key={userEmail} as="dm" userEmail={userEmail} />
        ))}
        {campaign.playerInviteEmails?.map((userEmail) => (
          <InviteListItem key={userEmail} as="player" userEmail={userEmail} />
        ))}
      </UnorderedList>

      <HStack>
        <Input
          name="emails"
          flex="1"
          type="text"
          placeholder="Email address(es)"
          value={emailsStr}
          onChange={(ev) => setEmailsStr(ev.currentTarget.value)}
          required
        />
        <Button
          colorScheme="teal"
          type="submit"
          onClick={() => handleSubmitNewUserInvite("player")}
        >
          Invite to Play
        </Button>
        <Button
          colorScheme="green"
          type="submit"
          onClick={() => handleSubmitNewUserInvite("dm")}
        >
          Invite to DM
        </Button>
      </HStack>
    </Box>
  );
}
