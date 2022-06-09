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
} from "@chakra-ui/react";
import { Note } from "ddtools-types";
import { arrayUnion } from "firebase/firestore";
import { useContext, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { CampaignUserContext } from "../pages/CampaignDashboardPage/CampaignDashboardPage";
import { NoteAPI } from "../services/api";
import { FirestoreDoc } from "../services/converter";
import { noteTags } from "../utils/consts";
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

  return (
    <Box minW="100%" borderWidth="1px" borderRadius="lg" p="3">
      <HStack>
        <Editable
          defaultValue={note.title || "Untitled Note"}
          isDisabled={!isEditable}
          color="gray.500"
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

      <Editable defaultValue={note.body} isDisabled={!isEditable}>
        <EditablePreview />
        <EditableTextarea noOfLines={4} rows={5} />
      </Editable>

      {!isEditingBody && (
        <Text
          color="gray.500"
          onClick={() => setIsShowingFullText(!isShowingFullText)}
        >
          Show {isShowingFullText ? "less" : "more"}...
        </Text>
      )}

      <Flex>
        <HStack spacing="3" my="2" flex="1">
          {note.tags &&
            note.tags.length &&
            note.tags.map((tag, tagIndex) => (
              <Tag key={tagIndex} size="sm">
                {tag}
              </Tag>
            ))}
          <TagAddPopover
            suggestedTags={noteTags.filter((tag) => !note.tags?.includes(tag))}
            onAddTag={(newTag) =>
              NoteAPI.update(campaign.id, note.id, { tags: arrayUnion(newTag) })
            }
          />
        </HStack>
        <Text color="gray.500" size="sm" fontWeight="semibold">
          {note.createdAt.toLocaleString()}
        </Text>
      </Flex>
    </Box>
  );
}
