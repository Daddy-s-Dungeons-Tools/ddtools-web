import {
  AvatarGroup,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Hide,
  HStack,
  Icon,
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
import { characterRaceAndClasses } from "../../utils/characters";
import { UserAvatar } from "../UserAvatar";
import { FaUserSlash } from "react-icons/fa";

type CampaignBoxPropTypes = {
  /** The campaign to display info for */
  campaign: Campaign;
  /** The role of the user viewing the campaign */
  as: "player" | "dm";
  /** The character of the player to display a summary of (only used when player) */
  character?: Character;
  /** Whether or not to display accept/decline buttons */
  isInvite?: boolean;
  /** Whether or not to make the entire box a link to the campaign page */
  isLink?: boolean;
};

/**
 * Box that displays a summary of a campaign. Depending on player or DM, displays different information.
 * If player, attempts to display a character summary if one is given. Can be a link to the campaign page,
 * or a invite with buttons to accept/decline.
 */
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

  /**
   * Add the user to the campaign with the desired role from `props.as`.
   * Displays a toast on success or failure. Also removes the invite.
   **/
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
          auth.currentUser ? [auth.currentUser.uid] : [],
        ),
        removeUserCampaignInvites(
          campaign.id,
          as,
          auth.currentUser && auth.currentUser.email
            ? [auth.currentUser.email]
            : [],
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

  /**
   * Remove the invite of user from the campaign with the desired role from `props.as`.
   * Displays a toast on success or failure.
   **/
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
          : [],
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
      <Flex
        flexDirection={{
          base: "column",
          md: "row",
        }}
      >
        <Hide below="sm">
          <Image
            w={{ base: "32" }}
            src="https://cdn.vox-cdn.com/thumbor/ShgZ3-pi6BnxczAG1ycmmk3l8uE=/0x23:1513x1032/1400x1400/filters:focal(0x23:1513x1032):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/33511669/905825_10152396043776071_8883312392855826763_o.0.jpg"
            alt=""
          />
        </Hide>
        <Box p={6}>
          <LinkOverlay
            as={ReactRouterLink}
            to={isLink ? "/campaigns/" + campaign.id : ""}
          >
            <Heading size={as === "dm" || isInvite ? "lg" : "sm"}>
              {campaign.name}
            </Heading>

            {as === "player" && character && (
              <>
                <Heading size="lg">{character.name}</Heading>
                <Heading size="md">
                  {characterRaceAndClasses(character)}
                </Heading>
              </>
            )}

            {as === "player" && !character && !isInvite && (
              <HStack>
                <Heading size="md">No Character Created</Heading>

                <Icon as={FaUserSlash} />
              </HStack>
            )}

            {as === "dm" && campaign.description && (
              <Text color="gray.500" noOfLines={1} fontStyle="italic">
                {campaign.description}
              </Text>
            )}

            <HStack mt="3">
              <AvatarGroup size="sm">
                {campaign.userSummaries &&
                  Object.entries(campaign.userSummaries)
                    .filter(([userId, summary]) => summary.as === "dm")
                    .map(([userId, summary]) => (
                      <UserAvatar
                        key={userId}
                        userAs="dm"
                        userId={userId}
                        userDisplayName={summary.displayName}
                      />
                    ))}
              </AvatarGroup>
              <AvatarGroup size="sm">
                {campaign.userSummaries &&
                  Object.entries(campaign.userSummaries)
                    .filter(([userId, summary]) => summary.as === "player")
                    .map(([userId, summary]) => (
                      <UserAvatar
                        userAs="player"
                        key={userId}
                        userId={userId}
                        userDisplayName={summary.displayName}
                      />
                    ))}
              </AvatarGroup>
            </HStack>
            <Box
              color="gray.500"
              fontSize="xs"
              fontWeight="semibold"
              textTransform="uppercase"
              mt="3"
            >
              started {new Date(campaign.createdAt).toLocaleDateString()}
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
