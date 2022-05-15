import {
  Center,
  Container,
  Heading,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { collection, doc } from "firebase/firestore";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { useProtectedRoute } from "../../hooks/routes";
import { campaignConverter } from "../../services/converter";
import { auth, firestore } from "../../services/firebase";

export default function CampaignDashboardPage() {
  useProtectedRoute();
  const navigate = useNavigate();
  const toast = useToast();
  let { campaignId } = useParams();
  const [user, isUserLoading, userError] = useAuthState(auth);
  const [campaignDoc, isCampaignDocLoading, campaignDocError] = useDocumentData(
    doc(collection(firestore, "campaigns"), campaignId).withConverter(
      campaignConverter
    )
  );

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
      <Container maxW="container.xl">
        <Heading>{campaignDoc.name}</Heading>
      </Container>
    );
  }
}
