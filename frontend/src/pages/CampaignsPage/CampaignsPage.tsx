import {
  Button,
  Container,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Campaign } from "ddtools-types";
import {
  collection,
  FirestoreDataConverter,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FaPlus } from "react-icons/fa";
import { CampaignBox } from "../../components/CampaignBox/CampaignBox";
import { CampaignInvitesModal } from "../../components/CampaignInvitesModal/CampaignInvitesModal";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { NewCampaignModal } from "../../components/NewCampaignModal/NewCampaignModal";
import { converter, FirestoreDoc } from "../../services/converter";
import { auth, firestore } from "../../services/firebase";

const readCampaignConverter = converter as FirestoreDataConverter<
  Campaign & FirestoreDoc
>;

const campaignCollection = collection(firestore, "campaigns").withConverter(
  readCampaignConverter,
);

export default function CampaignsPage() {
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] =
    useState<boolean>(false);
  const [
    isPlayerCampaignInvitesModalOpen,
    setIsPlayerCampaignInvitesModalOpen,
  ] = useState<boolean>(false);
  const [isDMCampaignInvitesModalOpen, setIsDMCampaignInvitesModalOpen] =
    useState<boolean>(false);

  // Player data
  const [playerCampaigns, isPlayerCampaignsLoading, playerCampaignsError] =
    useCollectionData(
      query(
        campaignCollection,
        where("playerUserIds", "array-contains", auth.currentUser?.uid ?? null),
        orderBy("createdAt", "desc"),
      ),
    );
  const [
    playerCampaignInvites,
    isPlayerCampaignInvitesLoading,
    playerCampaignInvitesError,
  ] = useCollectionData(
    query(
      campaignCollection,
      where(
        "playerInviteEmails",
        "array-contains",
        auth.currentUser?.email ?? null,
      ),
      orderBy("createdAt", "desc"),
    ),
  );

  // DM data
  const [dmCampaigns, isDMCampaignsLoading, dmCampaignsError] =
    useCollectionData(
      query(
        campaignCollection,
        where("dmUserIds", "array-contains", auth.currentUser?.uid ?? null),
        orderBy("createdAt", "desc"),
      ),
    );

  const [
    dmCampaignInvites,
    isDMCampaignInvitesLoading,
    dmCampaignInvitesError,
  ] = useCollectionData(
    query(
      campaignCollection,
      where(
        "dmInviteEmails",
        "array-contains",
        auth.currentUser?.email ?? null,
      ),
      orderBy("createdAt", "desc"),
    ),
  );

  // Log errors to console
  useEffect(() => {
    if (dmCampaignsError) {
      console.warn(dmCampaignInvitesError);
    }
    if (playerCampaignsError) {
      console.warn(playerCampaignInvitesError);
    }
    if (dmCampaignInvitesError) {
      console.warn(dmCampaignInvitesError);
    }
    if (playerCampaignInvitesError) {
      console.warn(playerCampaignInvitesError);
    }
  }, [
    dmCampaignsError,
    playerCampaignsError,
    dmCampaignInvitesError,
    playerCampaignInvitesError,
  ]);

  return (
    <Container maxW="container.lg">
      <NewCampaignModal
        isOpen={isNewCampaignModalOpen}
        onClose={() => setIsNewCampaignModalOpen(false)}
      />
      <CampaignInvitesModal
        as="player"
        isOpen={isPlayerCampaignInvitesModalOpen}
        onClose={() => setIsPlayerCampaignInvitesModalOpen(false)}
        campaignInvites={playerCampaignInvites ?? []}
      />
      <CampaignInvitesModal
        as="dm"
        isOpen={isDMCampaignInvitesModalOpen}
        onClose={() => setIsDMCampaignInvitesModalOpen(false)}
        campaignInvites={dmCampaignInvites ?? []}
      />

      <Flex w="100%" flexDirection={{ base: "column", md: "row" }}>
        {/* Player listing */}
        <VStack flex={"1"} align="flex-start" p={3} spacing="5">
          <Heading>Your Player Campaigns</Heading>

          {playerCampaignsError && (
            <ErrorAlert
              title="Yikes!"
              description="There was an error fetching your player campaigns..."
            />
          )}

          {playerCampaigns && playerCampaigns.length === 0 && (
            <Text color="gray.500">You are not playing in any campaigns.</Text>
          )}

          {isPlayerCampaignsLoading ? (
            <Stack w="100%">
              <Skeleton height="130px" />
            </Stack>
          ) : (
            playerCampaigns?.map((campaign) => (
              <CampaignBox
                key={campaign.id}
                as="player"
                campaign={campaign}
                // character={null}
                isLink
              />
            ))
          )}

          {playerCampaignInvites?.length ? (
            <Button
              minW="100%"
              colorScheme="teal"
              onClick={() => setIsPlayerCampaignInvitesModalOpen(true)}
            >
              View {playerCampaignInvites.length} Pending{" "}
              {playerCampaignInvites.length > 1 ? "Invites" : "Invite"}
            </Button>
          ) : (
            <Button
              minW="100%"
              isLoading={isPlayerCampaignInvitesLoading}
              loadingText="Loading invites..."
              disabled
            >
              No Player Invites
            </Button>
          )}
        </VStack>

        {/* DM listing */}
        <VStack flex={"1"} align="flex-start" p={3} spacing="5">
          <Heading>Your DM Campaigns</Heading>
          {dmCampaignsError && (
            <ErrorAlert
              title="Yikes!"
              description="There was an error fetching your DM campaigns..."
            />
          )}

          {dmCampaigns && dmCampaigns.length === 0 && (
            <Text color="gray.500">You are not DMing any campaigns.</Text>
          )}

          {isDMCampaignsLoading ? (
            <Stack w="100%">
              <Skeleton height="130px" />
            </Stack>
          ) : (
            dmCampaigns?.map((campaign) => (
              <CampaignBox
                key={campaign.id}
                as="dm"
                campaign={campaign}
                isLink
              />
            ))
          )}

          <Flex width="100%">
            {dmCampaignInvites?.length ? (
              <Button
                colorScheme="teal"
                flex="1"
                onClick={() => setIsDMCampaignInvitesModalOpen(true)}
              >
                View {dmCampaignInvites.length} Pending{" "}
                {dmCampaignInvites.length > 1 ? "Invites" : "Invite"}
              </Button>
            ) : (
              <Button
                disabled
                flex={"1"}
                isLoading={isDMCampaignInvitesLoading}
                loadingText="Loading invites..."
              >
                No DM Invites
              </Button>
            )}
            <Button
              leftIcon={<FaPlus />}
              ml={"2"}
              onClick={() => setIsNewCampaignModalOpen(true)}
              flex={"1"}
            >
              Start Campaign
            </Button>
          </Flex>
        </VStack>
      </Flex>
    </Container>
  );
}
