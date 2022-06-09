import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Textarea,
  VStack,
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
import { useContext, useEffect, useMemo, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FaPlus, FaSearch } from "react-icons/fa";
import { ErrorAlert } from "../../../../../components/ErrorAlert/ErrorAlert";
import { NoteBox } from "../../../../../components/NoteBox";
import { NoteAPI } from "../../../../../services/api";
import { converter, FirestoreDoc } from "../../../../../services/converter";
import { firestore } from "../../../../../services/firebase";
import { CampaignUserContext } from "../../../CampaignDashboardPage";

function NewNoteBox({ afterAdd }: { afterAdd?: () => void }) {
  type TagInput = {
    title: string;
    body: string;
    tagsStr: string;
  };
  const { campaign, user } = useContext(CampaignUserContext);

  async function handleAddNote(
    values: TagInput,
    formikHelpers: FormikHelpers<TagInput>,
  ) {
    try {
      await NoteAPI.add(user.uid, campaign.id, {
        title: values.title,
        body: values.body,
        tags: values.tagsStr
          ?.toLowerCase()
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag),
      } as Note);
      formikHelpers.resetForm();
      if (afterAdd) {
        afterAdd();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box minW="100%">
      <Formik
        initialValues={{ title: "", body: "", tagsStr: "" } as TagInput}
        onSubmit={handleAddNote}
      >
        {({ handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <Field name="title" as={Input} placeholder="Note title" />
            <Field name="body" as={Textarea} placeholder="Note body" required />
            <Field
              as={Input}
              name="tagsStr"
              placeholder="Comma-separated tags"
            />
            <Button type="submit" minW="100%">
              Add
            </Button>
          </form>
        )}
      </Formik>
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
  const [isAddingNewNote, setIsAddingNewNote] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (notesError) {
      console.warn(notesError);
    }
  }, [notesError]);

  async function deleteNote(noteId: FirestoreDoc["id"]) {
    try {
      await NoteAPI.delete(campaign.id, noteId);
    } catch (error) {
      console.error(error);
    }
  }

  const searchResults = useMemo(
    () =>
      notes?.filter(
        (note) =>
          !searchTerm.length ||
          note.tags?.includes(searchTerm.toLowerCase()) ||
          note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.body.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [notes, searchTerm],
  );

  return (
    <Box>
      <VStack spacing="3">
        <HStack minW="100%">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaSearch />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search for notes by text or tag"
              value={searchTerm}
              onChange={(ev) => setSearchTerm(ev.currentTarget.value)}
            />
          </InputGroup>
          <IconButton
            aria-label="New note"
            icon={<FaPlus />}
            onClick={() => setIsAddingNewNote(!isAddingNewNote)}
            colorScheme={isAddingNewNote ? "teal" : undefined}
          />
        </HStack>

        {notesError && (
          <ErrorAlert
            title="Yikes!"
            description="Failed to fetch your notes."
          />
        )}
        {isAddingNewNote && (
          <NewNoteBox afterAdd={() => setIsAddingNewNote(false)} />
        )}
        {isNotesLoading && (
          <>
            <Skeleton height="200px" />
            <Skeleton height="200px" />
            <Skeleton height="200px" />
          </>
        )}
        {searchResults?.map((note) => (
          <NoteBox
            key={note.id}
            note={note}
            isEditable={true}
            onDelete={() => deleteNote(note.id)}
          />
        ))}
      </VStack>
    </Box>
  );
}
