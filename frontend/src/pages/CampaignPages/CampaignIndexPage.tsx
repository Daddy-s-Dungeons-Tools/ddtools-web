import {
  Image,
  Text,
  Box,
  Container,
  Flex,
  Heading,
  VStack,
  Button,
  Skeleton,
  Stack,
  ButtonGroup,
} from "@chakra-ui/react";
import { useState } from "react";
import { NewCampaignModal } from "../../components/NewCampaignModal/NewCampaignModal";
import { useProtectedRoute } from "../../hooks/routes";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { auth, firestore } from "../../services/firebase";
import { Campaign } from "ddtools-types";
import { campaignConverter } from "../../services/converter";
import { CampaignInvitesModal } from "../../components/PlayerCampaignInvitesModal/PlayerCampaignInvitesModal";

type PlayerCampaignBoxPropTypes = {
  campaign: Campaign;
};
function PlayerCampaignBox({ campaign }: PlayerCampaignBoxPropTypes) {
  return (
    <Box minW="100%" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Flex>
        <Image
          w={"32"}
          src="https://cdn.vox-cdn.com/thumbor/ShgZ3-pi6BnxczAG1ycmmk3l8uE=/0x23:1513x1032/1400x1400/filters:focal(0x23:1513x1032):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/33511669/905825_10152396043776071_8883312392855826763_o.0.jpg"
          alt=""
        />
        <Box p={6}>
          <Text>{campaign.name}</Text>
          <Heading size="md" mb="8">
            Atreyu, Level 9 Human Monk
          </Heading>

          <Box
            color="gray.500"
            fontWeight="semibold"
            fontSize="xs"
            textTransform="uppercase"
          >
            {campaign.playerUserIds?.length ?? 0} players | ?? sessions | DMed
            by ??
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

type DMCampaignBoxPropTypes = {
  campaign: Campaign;
};
function DMCampaignBox({ campaign }: DMCampaignBoxPropTypes) {
  return (
    <Box minW="100%" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Flex>
        <Image
          w={"32"}
          src="https://cdn.vox-cdn.com/thumbor/ShgZ3-pi6BnxczAG1ycmmk3l8uE=/0x23:1513x1032/1400x1400/filters:focal(0x23:1513x1032):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/33511669/905825_10152396043776071_8883312392855826763_o.0.jpg"
          alt=""
        />
        <Box p={6}>
          <Heading size="md" mb="8">
            {campaign.name}
          </Heading>

          <Box
            color="gray.500"
            fontWeight="semibold"
            fontSize="xs"
            textTransform="uppercase"
          >
            {campaign.playerUserIds?.length ?? 0} players | ?? sessions | DMed
            by ??
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

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
        where("playerUserIds", "array-contains", auth.currentUser?.uid ?? null)
      ).withConverter(campaignConverter)
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
        auth.currentUser?.email ?? null
      )
    ).withConverter(campaignConverter)
  );

  // DM data
  const [dmCampaigns, isDMCampaignsLoading, dmCampaignsError] =
    useCollectionData(
      query(
        collection(firestore, "campaigns"),
        where("dmUserIds", "array-contains", auth.currentUser?.uid ?? null)
      ).withConverter(campaignConverter)
    );

  const [
    dmCampaignInvites,
    isDMCampaignInvitesLoading,
    dmCampaignInvitesError,
  ] = useCollectionData(
    query(
      collection(firestore, "campaigns"),
      where("dmInviteEmails", "array-contains", auth.currentUser?.email ?? null)
    ).withConverter(campaignConverter)
  );

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

      <Flex w="100%">
        {/* Player listing */}
        <VStack flex={"1"} align="flex-start" p={3}>
          <Heading mb="8">Your Player Campaigns</Heading>

          {isPlayerCampaignsLoading ? (
            <Stack w="100%">
              <Skeleton height="130px" />
            </Stack>
          ) : (
            playerCampaigns?.map((campaign) => (
              <PlayerCampaignBox
                key={campaign.id}
                campaign={campaign as Campaign}
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
            <Button minW="100%" disabled>
              No Pending Invites
            </Button>
          )}
        </VStack>

        {/* DM listing */}
        <VStack flex={"1"} align="flex-start" p={3}>
          <Heading mb="8">Your DM Campaigns</Heading>
          {isDMCampaignsLoading ? (
            <Stack w="100%">
              <Skeleton height="130px" />
            </Stack>
          ) : (
            dmCampaigns?.map((campaign) => (
              <DMCampaignBox
                key={campaign.id}
                campaign={campaign as Campaign}
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
              <Button disabled flex={"1"}>
                No Pending DM Invites
              </Button>
            )}
            <Button
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
