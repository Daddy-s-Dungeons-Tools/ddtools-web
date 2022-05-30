import {
  Box,
  Center,
  Container,
  Flex,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { Campaign, Character } from "ddtools-types";
import { collection, doc } from "firebase/firestore";
import { createContext, useEffect, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { useProtectedRoute } from "../../hooks/routes";
import { campaignConverter, converterFactory } from "../../services/converter";
import { auth, firestore } from "../../services/firebase";

import { Sidebar } from "./dashboards/components/Sidebar";
import { DMDashboard } from "./dashboards/DMDashboard";
import { PlayerDashboard } from "./dashboards/PlayerDashboard";

type CampaignUserContextType = {
  userRole: "dm" | "player";
  campaign: Campaign;
  isPlayerCharacterLoading: boolean;
  playerCharacter?: Character;
};
export const CampaignUserContext = createContext<CampaignUserContextType>(
  undefined!,
);

const characterConverter = converterFactory<Character>();

export default function CampaignDashboardPage() {
  useProtectedRoute();
  const navigate = useNavigate();
  const toast = useToast();
  let { campaignId } = useParams();
  const [user, isUserLoading, userError] = useAuthState(auth);
  const [campaignDoc, isCampaignDocLoading, campaignDocError] = useDocumentData(
    doc(collection(firestore, "campaigns"), campaignId).withConverter(
      campaignConverter,
    ),
  );

  // Attempt to find the user's character only if they are a player and not a DM
  const [playerCharacter, isPlayerCharacterLoading, playerCharacterError] =
    useDocumentData(
      user && campaignDoc && campaignDoc.playerUserIds?.includes(user.uid!)
        ? doc(
            firestore,
            "campaigns",
            campaignId!,
            "characters",
            user.uid,
          ).withConverter(characterConverter)
        : null,
    );

  // We memoize this value since otherwise it would change every time this parent component rerenders,
  // and trigger way too many renders in child components that use it
  const campaignUserContextValue = useMemo<CampaignUserContextType>(() => {
    if (!user || !campaignDoc) return undefined!;
    return {
      userRole: campaignDoc?.playerUserIds?.includes(user?.uid)
        ? "player"
        : "dm",
      campaign: campaignDoc!,
      isPlayerCharacterLoading,
      playerCharacter: playerCharacter,
    };
  }, [user, campaignDoc, isPlayerCharacterLoading, playerCharacter]);

  // Log errors to console
  useEffect(() => {
    if (userError) {
      console.warn(userError);
    }
    if (campaignDocError) {
      console.warn(campaignDocError);
    }
    if (playerCharacterError) {
      console.warn(playerCharacterError);
    }
  }, [userError, campaignDocError, playerCharacterError]);

  useEffect(() => {
    if (isCampaignDocLoading || isUserLoading) {
      return;
    }

    // Check if campaign actually exists
    if (!campaignDoc) {
      navigate("/campaigns");
      toast({
        title: "Campaign Not Found",
        description: "We couldn't find the campaign you were looking for.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (
      campaignDoc &&
      user &&
      !campaignDoc.dmUserIds?.includes(user.uid) &&
      !campaignDoc.playerUserIds?.includes(user.uid)
    ) {
      // Check if user is either player or DM in campaign
      navigate("/campaigns");
      toast({
        title: "Access Denied!",
        description:
          "You aren't a DM or player in that campaign. Check for pending invites.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [user, isCampaignDocLoading, campaignDoc, navigate, toast, isUserLoading]);

  // If anything is missing or loading, render a loading spinner
  if (isCampaignDocLoading || isUserLoading || !user || !campaignDoc) {
    return (
      <Center pos={"fixed"} top={0} left={0} w={"100%"} h="100vh">
        <Spinner size={"xl"} />
      </Center>
    );
  } else {
    return (
      <CampaignUserContext.Provider value={campaignUserContextValue}>
        <Container maxW="100%" p="0">
          <Flex>
            <Sidebar />
            <Box
              id="main-dashboard"
              flex="1"
              px="8"
              height="calc(100vh - 200px)"
            >
              {campaignUserContextValue.userRole === "dm" ? (
                <DMDashboard />
              ) : campaignUserContextValue.isPlayerCharacterLoading ? (
                <Center>
                  <Spinner size="xl" />
                </Center>
              ) : (
                <PlayerDashboard />
              )}
            </Box>
          </Flex>
        </Container>
      </CampaignUserContext.Provider>
    );
  }
}
