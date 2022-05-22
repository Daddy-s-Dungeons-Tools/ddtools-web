import {
  Box,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  VStack,
  Input,
  Flex,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import {
  addUserCampaignInvites,
  removeUserCampaignInvites,
} from "../../../../services/api";
import { CampaignContext } from "../../CampaignDashboardPage";

function PartyList() {
  const campaign = useContext(CampaignContext);

  return <Box>party list</Box>;
}

function CampaignUsers() {
  const toast = useToast();
  const campaign = useContext(CampaignContext);

  const handleSubmitNewUserInvite: React.FormEventHandler<
    HTMLFormElement
  > = async (ev) => {
    ev.preventDefault();

    const input = ev.currentTarget.emails;
    const newUserInviteEmails = input.value
      .trim()
      .split(",")
      .map((email: string) => email.trim());

    try {
      await addUserCampaignInvites(campaign.id, "player", newUserInviteEmails);
      input.value = "";

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

  return (
    <Box minW="100%">
      <Heading size="md" mb="1">
        Invited Users
      </Heading>
      <UnorderedList spacing={1} mb="3">
        {campaign.playerInviteEmails ? (
          campaign.playerInviteEmails.map((playerEmail) => (
            <ListItem
              onClick={() =>
                removeUserCampaignInvites(campaign.id, "player", [playerEmail])
              }
              key={playerEmail}
            >
              {playerEmail}
            </ListItem>
          ))
        ) : (
          <Text>No pending user invites!</Text>
        )}
      </UnorderedList>

      <form onSubmit={handleSubmitNewUserInvite}>
        <Flex minW="100%">
          <Input
            name="emails"
            flex="1"
            type="text"
            placeholder="New user email"
            mr="3"
            required
          />

          <Button colorScheme="teal" type="submit">
            Invite
          </Button>
        </Flex>
      </form>
    </Box>
  );
}

type PartyPropTypes = {
  as: "player" | "dm";
};
export default function Party(props: PartyPropTypes) {
  const campaign = useContext(CampaignContext);

  if (props.as === "dm") {
    // DM party listing
    return (
      <Box>
        <VStack align="flex-start" spacing="8">
          <PartyList />

          <CampaignUsers />
        </VStack>
      </Box>
    );
  } else {
    // Player party listing
    return <p>hi nick</p>;
  }
}
