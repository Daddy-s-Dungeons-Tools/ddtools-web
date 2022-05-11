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
} from "@chakra-ui/react";
import { useState } from "react";
import { NewCampaignModal } from "../../components/NewCampaignModal/NewCampaignModal";
import { useProtectedRoute } from "../../hooks/routes";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { auth, firestore } from "../../services/firebase";
import { Campaign } from "ddtools-types";

function PlayerCampaignBox() {
  return (
    <Box minW="100%" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Flex>
        <Image
          w={"32"}
          src="https://cdn.vox-cdn.com/thumbor/ShgZ3-pi6BnxczAG1ycmmk3l8uE=/0x23:1513x1032/1400x1400/filters:focal(0x23:1513x1032):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/33511669/905825_10152396043776071_8883312392855826763_o.0.jpg"
          alt=""
        />
        <Box p={6}>
          <Text>Silly Campaign Title</Text>
          <Heading size="md" mb="8">
            Atreyu, Level 9 Human Monk
          </Heading>

          <Box
            color="gray.500"
            fontWeight="semibold"
            fontSize="xs"
            textTransform="uppercase"
          >
            8 players | 30 sessions | DMed by Aaron Reers
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

export default function CampaignsPage() {
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] =
    useState<boolean>(false);
  const [dmCampaigns, isDMCampaignsLoading, dmCampaignsError] =
    useCollectionData(
      query(
        collection(firestore, "campaigns"),
        where("dmUserIds", "array-contains", auth.currentUser?.uid)
      )
    );

  useProtectedRoute();

  return (
    <Container maxW="container.lg">
      <NewCampaignModal
        isOpen={isNewCampaignModalOpen}
        onClose={() => setIsNewCampaignModalOpen(false)}
      />

      <Flex w="100%">
        {/* Player listing */}
        <VStack flex={"1"} align="flex-start" p={3}>
          <Heading mb="8">Your Player Campaigns</Heading>

          <PlayerCampaignBox />

          <Button minW="100%" disabled>
            No Pending Invites
          </Button>
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

          <Button minW="100%" onClick={() => setIsNewCampaignModalOpen(true)}>
            Start Campaign
          </Button>
        </VStack>
      </Flex>
    </Container>
  );
}
