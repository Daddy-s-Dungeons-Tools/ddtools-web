import {
  Box,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  EditableTextarea,
  Flex,
  Heading,
  HStack,
  IconButton,
  Tag,
  Text,
  useEditableControls,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Note } from "ddtools-types";
import {
  arrayRemove,
  arrayUnion,
  PartialWithFieldValue,
} from "firebase/firestore";
import { CampaignUserContext } from "pages/CampaignDashboardPage/CampaignDashboardPage";
import { useContext, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { NoteAPI } from "services/api";
import { FirestoreDoc } from "services/converter";
import { noteTags } from "utils/consts";
import { TagAddPopover } from "./TagAddPopover";

type NoteBoxPropTypes = {
  note: Note & FirestoreDoc;
  isEditable: boolean;
  onDelete?: () => void;
};

export function NoteBox({ note, onDelete, isEditable }: NoteBoxPropTypes) {
  const { campaign } = useContext(CampaignUserContext);
  const [isShowingFullText, setIsShowingFullText] = useState<boolean>(false);
  const [isEditingBody, setIsEditingBody] = useState<boolean>(false);

  async function updateNote(updates: PartialWithFieldValue<Note>) {
    try {
      await NoteAPI.update(campaign.id, note.id, updates);
    } catch (error) {
      console.error(error);
    }
  }

  function EditableControls() {
    const { isEditing, getEditButtonProps, getSubmitButtonProps } =
      useEditableControls();

    return <Text {...getEditButtonProps()}>Edit</Text>;
  }

  return (
    <Box minW="100%" borderWidth="1px" borderRadius="lg" p="3">
      <HStack>
        <Editable
          defaultValue={note.title}
          placeholder={note.title || "Untitled Note"}
          isDisabled={!isEditable}
          color="gray.500"
          onSubmit={(newTitle) => updateNote({ title: newTitle })}
          flex="1"
        >
          <EditablePreview as={Heading} size="md" fontWeight="semibold" />
          <EditableInput />
        </Editable>

        <ButtonGroup size="xs">
          {onDelete && (
            <IconButton
              aria-label="Delete note"
              title="Delete note"
              icon={<FaTrashAlt />}
              colorScheme="pink"
              variant="ghost"
              onClick={onDelete}
            />
          )}
        </ButtonGroup>
      </HStack>

      <Editable
        defaultValue={note.body}
        isDisabled={!isEditable}
        onSubmit={(newBody) => updateNote({ body: newBody })}
        placeholder={note.title || "No content"}
      >
        <EditablePreview />
        <EditableTextarea rows={5} />
        {/* <EditableControls /> */}
      </Editable>

      {/* {!isEditingBody && (
        <Text
          color="gray.500"
          onClick={() => setIsShowingFullText(!isShowingFullText)}
        >
          Show {isShowingFullText ? "less" : "more"}...
        </Text>
      )} */}

      <Flex>
        <HStack spacing="3" my="2" flex="1">
          {note.tags && note.tags.length && (
            <Wrap>
              {note.tags.map((tag, tagIndex) => (
                <WrapItem key={tagIndex}>
                  <Tag
                    size="sm"
                    cursor="pointer"
                    onClick={() =>
                      updateNote({
                        tags: arrayRemove(tag),
                      })
                    }
                  >
                    {tag}
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          )}
          <TagAddPopover
            suggestedTags={noteTags.filter((tag) => !note.tags?.includes(tag))}
            onAddTag={(newTag) => updateNote({ tags: arrayUnion(newTag) })}
          />
        </HStack>
        <Text color="gray.500" size="sm" fontWeight="semibold">
          {note.createdAt.toLocaleDateString()}
        </Text>
      </Flex>
    </Box>
  );
}
