import {
  Container,
  Flex,
  Heading,
  VStack,
  Button,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { NewCampaignModal } from "../../components/NewCampaignModal/NewCampaignModal";
import { useProtectedRoute } from "../../hooks/routes";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, orderBy, query, where } from "firebase/firestore";
import { auth, firestore } from "../../services/firebase";
import { Campaign } from "ddtools-types";
import { campaignConverter } from "../../services/converter";
import { CampaignInvitesModal } from "../../components/CampaignInvitesModal/CampaignInvitesModal";
import { CampaignBox } from "../../components/CampaignBox/CampaignBox";
import { FaPlus } from "react-icons/fa";
import { ErrorAlert } from "../../components/ErrorAlert";

export default function CampaignIndexPage() {
  useProtectedRoute();

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
        collection(firestore, "campaigns"),
        where("playerUserIds", "array-contains", auth.currentUser?.uid ?? null),
        orderBy("createdAt", "desc"),
      ).withConverter(campaignConverter),
    );
  const [
    playerCampaignInvites,
    isPlayerCampaignInvitesLoading,
    playerCampaignInvitesError,
  ] = useCollectionData(
    query(
      collection(firestore, "campaigns"),
      where(
        "playerInviteEmails",
        "array-contains",
        auth.currentUser?.email ?? null,
      ),
      orderBy("createdAt", "desc"),
    ).withConverter(campaignConverter),
  );

  // DM data
  const [dmCampaigns, isDMCampaignsLoading, dmCampaignsError] =
    useCollectionData(
      query(
        collection(firestore, "campaigns"),
        where("dmUserIds", "array-contains", auth.currentUser?.uid ?? null),
        orderBy("createdAt", "desc"),
      ).withConverter(campaignConverter),
    );

  const [
    dmCampaignInvites,
    isDMCampaignInvitesLoading,
    dmCampaignInvitesError,
  ] = useCollectionData(
    query(
      collection(firestore, "campaigns"),
      where(
        "dmInviteEmails",
        "array-contains",
        auth.currentUser?.email ?? null,
      ),
      orderBy("createdAt", "desc"),
    ).withConverter(campaignConverter),
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
        <VStack flex={"1"} align="flex-start" p={3}>
          <Heading mb="8">Your Player Campaigns</Heading>

          {playerCampaignsError && (
            <ErrorAlert
              title="Yikes!"
              description="There was an error fetching your player campaigns..."
            />
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
                campaign={campaign as Campaign}
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
              No Pending Invites
            </Button>
          )}
        </VStack>

        {/* DM listing */}
        <VStack flex={"1"} align="flex-start" p={3}>
          <Heading mb="8">Your DM Campaigns</Heading>
          {dmCampaignsError && (
            <ErrorAlert
              title="Yikes!"
              description="There was an error fetching your DM campaigns..."
            />
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
                campaign={campaign as Campaign}
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
                No Pending DM Invites
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
