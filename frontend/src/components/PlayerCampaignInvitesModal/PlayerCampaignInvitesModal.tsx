import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Flex,
  Image,
  Text,
  Heading,
  ButtonGroup,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Campaign } from "ddtools-types";
import { useState } from "react";
import {
  addPlayersToCampaign,
  removePlayerCampaignInvites,
} from "../../services/api";
import { auth } from "../../services/firebase";

function CampaignInviteBox({ campaign }: { campaign: Campaign }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const handleAcceptInvite = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      await Promise.allSettled([
        addPlayersToCampaign(
          campaign.id,
          auth.currentUser ? [auth.currentUser.uid] : []
        ),
        removePlayerCampaignInvites(
          campaign.id,
          auth.currentUser && auth.currentUser.email
            ? [auth.currentUser.email]
            : []
        ),
      ]);

      toast({
        title: "Accepted Invite",
        description: (
          <p>
            You have joined campaign <strong>{campaign.name}</strong>
          </p>
        ),
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Uwu!",
        description: (
          <p>
            Something went wrong when joining <strong>{campaign.name}</strong>.
            Please try again later.
          </p>
        ),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minW="100%"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      mb="5"
    >
      <Flex>
        <Image
          w={"32"}
          src="https://cdn.vox-cdn.com/thumbor/ShgZ3-pi6BnxczAG1ycmmk3l8uE=/0x23:1513x1032/1400x1400/filters:focal(0x23:1513x1032):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/33511669/905825_10152396043776071_8883312392855826763_o.0.jpg"
          alt=""
        />
        <Box p={6}>
          <VStack align="flex-start">
            <Heading size="md">{campaign.name}</Heading>

            <Box
              color="gray.500"
              fontWeight="semibold"
              fontSize="xs"
              textTransform="uppercase"
            >
              {campaign.playerUserIds?.length ?? 0} players | ?? sessions | DMed
              by ??
            </Box>
            <Box>
              <Text>{campaign.description ?? "No description provided."}</Text>
            </Box>
            <ButtonGroup size="sm">
              <Button
                colorScheme="teal"
                onClick={handleAcceptInvite}
                isLoading={isLoading}
                loadingText="Accepting..."
              >
                Accept
              </Button>
              <Button>Decline</Button>
            </ButtonGroup>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}

type PlayerCampaignInvitesModalPropTypes = {
  isOpen: boolean;
  onClose: () => void;
  campaignInvites: Campaign[];
};
export function PlayerCampaignInvitesModal(
  props: PlayerCampaignInvitesModalPropTypes
) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Your Campaign Invites</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {props.campaignInvites.length > 0 ? (
            props.campaignInvites.map((campaign) => (
              <CampaignInviteBox key={campaign.id} campaign={campaign} />
            ))
          ) : (
            <Box mb="5">You have no pending campaign invitations.</Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
