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
  Badge,
  Divider,
  Skeleton,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Alert,
} from "@chakra-ui/react";
import { Character } from "ddtools-types";
import { collection, orderBy, query } from "firebase/firestore";
import { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { CampaignPlayerBox } from "../../../../components/CampaignPlayerBox/CampaignPlayerBox";
import {
  addUserCampaignInvites,
  removeUserCampaignInvites,
} from "../../../../services/api";
import { converterFactory } from "../../../../services/converter";
import { firestore } from "../../../../services/firebase";
import { CampaignUserContext } from "../../CampaignDashboardPage";

const characterConverter = converterFactory<Character>();

function CampaignUsersManager() {
  const toast = useToast();
  const { campaign } = useContext(CampaignUserContext);

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
        Manage Users
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
              {playerEmail} <Badge colorScheme="cyan">invited</Badge>
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
            placeholder="Email address(es)"
            mr="3"
            required
          />

          <Button colorScheme="teal" type="submit">
            Invite to Play
          </Button>
        </Flex>
      </form>
    </Box>
  );
}

export default function Party() {
  const { userRole, campaign } = useContext(CampaignUserContext);

  const [
    campaignCharacters,
    isCampaignCharactersLoading,
    campaignCharactersError,
  ] = useCollectionData(
    query(
      collection(firestore, "campaigns", campaign.id, "characters"),
      orderBy("name"),
    ).withConverter(characterConverter),
  );

  return (
    <Box>
      <VStack align="flex-start" spacing="8">
        <VStack minW="100%">
          {campaignCharactersError && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Yikes!</AlertTitle>
              <AlertDescription>
                There was an error while fetching this campaign's characters...
              </AlertDescription>
            </Alert>
          )}
          {!isCampaignCharactersLoading &&
            campaignCharacters &&
            campaignCharacters.map((character) => (
              <CampaignPlayerBox
                key={character.id}
                userDisplayName={
                  (campaign.userSummaries &&
                    character.id in campaign.userSummaries &&
                    campaign.userSummaries[character.id].displayName) ||
                  "User"
                }
                character={character}
              />
            ))}

          {!isCampaignCharactersLoading && campaignCharacters?.length === 0 && (
            <Text>There are no adventurers in this campaign yet!</Text>
          )}

          {isCampaignCharactersLoading && (
            <VStack>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height="150px" />
              ))}
            </VStack>
          )}
        </VStack>

        {userRole === "dm" && (
          <>
            <Divider />
            <CampaignUsersManager />
          </>
        )}
      </VStack>
    </Box>
  );
}
