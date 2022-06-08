import {
  Box,
  Heading,
  Skeleton,
  VStack,
  Text,
  Textarea,
  Input,
  HStack,
  Tag,
} from "@chakra-ui/react";
import { Note } from "ddtools-types";
import {
  collection,
  FirestoreDataConverter,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Field, Formik, FormikHelpers } from "formik";
import { useContext, useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { ErrorAlert } from "../../../../components/ErrorAlert/ErrorAlert";
import { NoteAPI } from "../../../../services/api";
import { converter, FirestoreDoc } from "../../../../services/converter";
import { firestore } from "../../../../services/firebase";
import { CampaignUserContext } from "../../CampaignDashboardPage";

function NewNoteBox() {
  const { campaign, user } = useContext(CampaignUserContext);

  async function handleAddNote(
    values: Note,
    formikHelpers: FormikHelpers<Note>,
  ) {
    try {
      await NoteAPI.add(user.uid, campaign.id, values);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box minW="100%">
      <Formik initialValues={{ body: "" } as Note} onSubmit={handleAddNote}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field name="title" as={Input} placeholder="Note title" />
            <Field name="body" as={Textarea} placeholder="Note body" />
          </form>
        )}
      </Formik>
    </Box>
  );
}

function NoteBox({ note }: { note: Note }) {
  const [isShowingFullText, setIsShowingFullText] = useState<boolean>(false);
  return (
    <Box minW="100%">
      {note.title && <Heading size="md">{note.title}</Heading>}
      <Text noOfLines={isShowingFullText ? undefined : 4}>{note.body}</Text>
      <Text
        color="gray.500"
        onClick={() => setIsShowingFullText(!isShowingFullText)}
      >
        Show {isShowingFullText ? "less" : "more"}...
      </Text>
      {note.tags && note.tags.length && (
        <HStack spacing="3" my="2">
          {note.tags.map((tag) => (
            <Tag size="sm">{tag}</Tag>
          ))}
        </HStack>
      )}
      <Text color="gray.500" size="sm" fontWeight="semibold">
        {note.createdAt.toLocaleString()}
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
      orderBy("createdAt", "desc"),
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
        <NewNoteBox />
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
