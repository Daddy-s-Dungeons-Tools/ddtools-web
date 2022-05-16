import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

import { Campaign, Character } from "ddtools-types";
import { useState } from "react";
import {
  addUsersToCampaigns,
  removeUserCampaignInvites,
} from "../../services/api";
import { auth } from "../../services/firebase";

type CampaignBoxPropTypes = {
  campaign: Campaign;
  as: "player" | "dm";
  character?: Character;
  isInvite?: boolean;
  isLink?: boolean;
};
export function CampaignBox({
  campaign,
  as,
  character,
  isInvite = false,
  isLink = false,
}: CampaignBoxPropTypes) {
  const [isAccepting, setIsAccepting] = useState<boolean>(false);
  const [isDeclining, setIsDeclining] = useState<boolean>(false);
  const toast = useToast();

  const handleAcceptInvite = async () => {
    if (isAccepting) {
      return;
    }

    setIsAccepting(true);
    try {
      await Promise.allSettled([
        addUsersToCampaigns(
          campaign.id,
          as,
          auth.currentUser ? [auth.currentUser.uid] : []
        ),
        removeUserCampaignInvites(
          campaign.id,
          as,
          auth.currentUser && auth.currentUser.email
            ? [auth.currentUser.email]
            : []
        ),
      ]);

      toast({
        title: "Accepted Invite",
        description: (
          <p>
            You have joined campaign <strong>{campaign.name}</strong> as{" "}
            {as === "player" ? "a player" : "DM"}.
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
      setIsAccepting(false);
    }
  };

  const handleDeclineInvite = async () => {
    if (isDeclining) {
      return;
    }

    setIsDeclining(true);
    try {
      await removeUserCampaignInvites(
        campaign.id,
        as,
        auth.currentUser && auth.currentUser.email
          ? [auth.currentUser.email]
          : []
      );

      toast({
        title: "Declined Invite",
        description: (
          <p>
            You have <strong>declined</strong> the invite to{" "}
            {as === "player" ? "play in" : "DM"} campaign{" "}
            <strong>{campaign.name}</strong>. Harsh!
          </p>
        ),
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Uwu!",
        description:
          "Something went wrong when declining the invite. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeclining(false);
    }
  };

  return (
    <LinkBox
      as="article"
      minW="100%"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      mb="5"
      borderRightWidth="thick"
      borderRightColor={campaign.color}
    >
      <Flex>
        <Image
          w={"32"}
          src="https://cdn.vox-cdn.com/thumbor/ShgZ3-pi6BnxczAG1ycmmk3l8uE=/0x23:1513x1032/1400x1400/filters:focal(0x23:1513x1032):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/33511669/905825_10152396043776071_8883312392855826763_o.0.jpg"
          alt=""
        />
        <Box p={6}>
          <LinkOverlay
            as={ReactRouterLink}
            to={isLink ? "/campaigns/" + campaign.id : ""}
          >
            <Heading size={as === "dm" || isInvite ? "md" : "sm"}>
              {campaign.name}
            </Heading>

            {as === "player" && character && (
              <Heading size="lg">Characetr Stuff Here</Heading>
            )}

            {as === "player" && !character && !isInvite && (
              <Heading size="md">No Character Created</Heading>
            )}

            {campaign.description && (
              <Text color="gray.500" noOfLines={1} fontStyle="italic">
                {campaign.description}
              </Text>
            )}

            <Box
              color="gray.500"
              fontWeight="semibold"
              fontSize="xs"
              textTransform="uppercase"
              mt="3"
            >
              {campaign.playerUserIds?.length ?? 0} players | started{" "}
              {new Date(campaign.createdAt).toLocaleDateString()} | DMed by ??
            </Box>
          </LinkOverlay>
          {isInvite && (
            <ButtonGroup size="sm" mt="3">
              <Button
                colorScheme="teal"
                onClick={handleAcceptInvite}
                isLoading={isAccepting}
                loadingText="Accepting..."
              >
                Accept
              </Button>
              <Button
                onClick={handleDeclineInvite}
                isLoading={isDeclining}
                loadingText="Declining..."
              >
                Decline
              </Button>
            </ButtonGroup>
          )}
        </Box>
      </Flex>
    </LinkBox>
  );
}
