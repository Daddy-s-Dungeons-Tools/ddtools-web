import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CampaignPlayerBox } from "components/CampaignPlayerBox";
import { Character } from "ddtools-types";
import {
  collection,
  FirestoreDataConverter,
  orderBy,
  query,
} from "firebase/firestore";
import { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { converter, FirestoreDoc } from "services/converter";
import { firestore } from "services/firebase";
import { CampaignUserContext } from "../context";

export default function Party() {
  const { campaign } = useContext(CampaignUserContext);

  const [
    campaignCharacters,
    isCampaignCharactersLoading,
    campaignCharactersError,
  ] = useCollectionData(
    query(
      collection(firestore, "campaigns", campaign.id, "characters"),
      orderBy("name"),
    ).withConverter(
      converter as FirestoreDataConverter<Character & FirestoreDoc>,
    ),
  );

  return (
    <Box>
      <VStack align="flex-start" spacing="8">
        <VStack minW="100%">
          {campaignCharactersError && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Yikes!</AlertTitle>
              <AlertDescription>
                There was an error while fetching this campaign's characters...
              </AlertDescription>
            </Alert>
          )}
          {!isCampaignCharactersLoading &&
            campaignCharacters &&
            campaignCharacters.map((character) => (
              <CampaignPlayerBox
                key={character.id}
                userDisplayName={
                  (campaign.userSummaries &&
                    character.id in campaign.userSummaries &&
                    campaign.userSummaries[character.id].displayName) ||
                  "User"
                }
                character={character}
              />
            ))}

          {!isCampaignCharactersLoading && campaignCharacters?.length === 0 && (
            <Text>There are no adventurers in this campaign yet!</Text>
          )}

          {isCampaignCharactersLoading && (
            <VStack>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height="150px" />
              ))}
            </VStack>
          )}
        </VStack>
      </VStack>
    </Box>
  );
}
