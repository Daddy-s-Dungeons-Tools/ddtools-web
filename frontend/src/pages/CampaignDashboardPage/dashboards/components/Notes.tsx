import { Box, Heading, Skeleton, VStack, Text } from "@chakra-ui/react";
import { Note } from "ddtools-types";
import {
  collection,
  FirestoreDataConverter,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { ErrorAlert } from "../../../../components/ErrorAlert/ErrorAlert";
import { converter, FirestoreDoc } from "../../../../services/converter";
import { firestore } from "../../../../services/firebase";
import { CampaignUserContext } from "../../CampaignDashboardPage";

function NoteBox({ note }: { note: Note }) {
  return (
    <Box>
      {note.title && <Heading size="md">{note.title}</Heading>}
      <Text>{note.body}</Text>
      <Text color="gray.500" size="sm" fontWeight="semibold">
        {JSON.stringify(note.createdAt)}
      </Text>
    </Box>
  );
}

/** Notes Widget */
export function Notes() {
  const { campaign, user } = useContext(CampaignUserContext);
  const [notes, isNotesLoading, notesError] = useCollectionData(
    query(
      collection(firestore, "campaigns", campaign.id, "notes"),
      where("ownerUserId", "==", user.uid),
    ).withConverter(converter as FirestoreDataConverter<Note & FirestoreDoc>),
  );

  useEffect(() => {
    if (notesError) {
      console.warn(notesError);
    }
  }, [notesError]);

  return (
    <Box>
      {notesError && (
        <ErrorAlert title="Yikes!" description="Failed to fetch your notes." />
      )}

      <VStack spacing="3">
        {isNotesLoading && (
          <>
            <Skeleton height="200px" />
            <Skeleton height="200px" />
            <Skeleton height="200px" />
          </>
        )}
        {notes?.map((note) => (
          <NoteBox key={note.id} note={note} />
        ))}
      </VStack>
    </Box>
  );
}
