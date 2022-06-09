import {
  Box,
  Button,
  Center,
  Container,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { Campaign, Character } from "ddtools-types";
import { User } from "firebase/auth";
import { collection, doc, FirestoreDataConverter } from "firebase/firestore";
import { createContext, useEffect, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { GiDiceTwentyFacesTwenty } from "react-icons/gi";
import { Params, useLocation } from "wouter";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { converter, FirestoreDoc } from "../../services/converter";
import { diceBox } from "../../services/dice";
import { handleError } from "../../services/errors";
import { auth, firestore } from "../../services/firebase";
import { DMDashboard } from "./dashboards/DMDashboard";
import { PlayerDashboard } from "./dashboards/PlayerDashboard";

type CampaignUserContextType = {
  user: User;
  userRole: "dm" | "player";
  campaign: Campaign & FirestoreDoc;
  playerCharacter?: Character & FirestoreDoc;
};
export const CampaignUserContext = createContext<CampaignUserContextType>(
  undefined!,
);

export default function CampaignDashboardPage({ params }: { params: Params }) {
  const [location, setLocation] = useLocation();
  const toast = useToast();
  let { campaignId } = params;

  const [user, isUserLoading, userError] = useAuthState(auth);

  // Firestore data
  const [campaignDoc, isCampaignDocLoading, campaignDocError] = useDocumentData(
    doc(collection(firestore, "campaigns"), campaignId).withConverter(
      converter as FirestoreDataConverter<Campaign & FirestoreDoc>,
    ),
  );

  // Attempt to find the user's character only if they are a player and not a DM
  const [playerCharacter, isPlayerCharacterLoading, playerCharacterError] =
    useDocumentData(
      doc(
        firestore,
        "campaigns",
        campaignId!,
        "characters",
        user!.uid,
      ).withConverter(
        converter as FirestoreDataConverter<Character & FirestoreDoc>,
      ),
    );

  // We memoize this value since otherwise it would change every time this parent component rerenders,
  // and trigger way too many renders in child components that use it
  const campaignUserContextValue = useMemo<CampaignUserContextType>(() => {
    if (!user || !campaignDoc || isPlayerCharacterLoading) return null!;
    return {
      user,
      userRole: campaignDoc.playerUserIds?.includes(user.uid) ? "player" : "dm",
      campaign: campaignDoc,
      playerCharacter,
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
      setLocation("/campaigns");
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
      setLocation("/campaigns");
      toast({
        title: "Access Denied!",
        description:
          "You aren't a DM or player in that campaign. Check for pending invites.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [
    user,
    isCampaignDocLoading,
    campaignDoc,
    setLocation,
    toast,
    isUserLoading,
  ]);

  // If anything is missing or loading, render a loading spinner
  if (!campaignUserContextValue) {
    return (
      <Center pos="fixed" top={0} left={0} w="100%" minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  } else {
    return (
      <CampaignUserContext.Provider value={campaignUserContextValue}>
        <ErrorBoundary
          FallbackComponent={() => (
            <ErrorAlert
              title="Oops!"
              description="A fatal error occured... Please try again later."
            />
          )}
          onError={handleError}
        >
          <Container
            maxW="100%"
            px="3"
            id="main-dashboard"
            height="calc(100vh - 150px)"
          >
            {campaignUserContextValue.userRole === "dm" ? (
              <DMDashboard />
            ) : (
              <PlayerDashboard />
            )}
          </Container>
        </ErrorBoundary>

        <Box position="fixed" right="50px" bottom="50px">
          <Button
            leftIcon={<GiDiceTwentyFacesTwenty />}
            size="lg"
            onClick={() => diceBox.roll("1d20")}
          >
            Roll
          </Button>
        </Box>
      </CampaignUserContext.Provider>
    );
  }
}
