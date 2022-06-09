import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Tag,
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
import { TagAddPopover } from "../../../../../components/TagAddPopover";
import { NoteAPI } from "../../../../../services/api";
import { converter, FirestoreDoc } from "../../../../../services/converter";
import { firestore } from "../../../../../services/firebase";
import { noteTags } from "../../../../../utils/consts";
import { CampaignUserContext } from "../../../CampaignDashboardPage";

function NewNoteBox({ afterAdd }: { afterAdd?: () => void }) {
  type NoteInput = Pick<Note, "title" | "body" | "tags">;

  const { campaign, user } = useContext(CampaignUserContext);

  async function handleAddNote(
    values: NoteInput,
    formikHelpers: FormikHelpers<NoteInput>,
  ) {
    try {
      await NoteAPI.add(user.uid, campaign.id, values as Note);
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
        initialValues={{ title: "", body: "", tags: [] } as NoteInput}
        onSubmit={handleAddNote}
      >
        {({ values, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit} noValidate>
            <VStack align="left">
              <Field
                name="title"
                as={Input}
                placeholder="Note title"
                size="sm"
              />
              <Field
                name="body"
                as={Textarea}
                placeholder="Note body"
                size="sm"
                required
              />
              <HStack spacing="3" flex="1">
                {values.tags?.map((tag, tagIndex) => (
                  <Tag key={tagIndex} size="sm">
                    {tag}
                  </Tag>
                ))}
                <TagAddPopover
                  suggestedTags={noteTags.filter(
                    (tag) => !values.tags?.includes(tag),
                  )}
                  onAddTag={(newTag) =>
                    setFieldValue("tags", [...(values.tags ?? []), newTag])
                  }
                />
              </HStack>
              <Button type="submit" minW="100%">
                Add
              </Button>
            </VStack>
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

  const allTags = useMemo(
    () => Array.from(new Set((notes ?? []).flatMap((note) => note.tags ?? []))),
    [notes],
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
              list="current-tags"
            />
            <datalist id="current-tags">
              {allTags.map((tag) => (
                <option key={tag} value={tag} />
              ))}
            </datalist>
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
