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
  Text,
} from "@chakra-ui/react";
import { Note } from "ddtools-types";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Tag } from "react-konva";
import { FirestoreDoc } from "../services/converter";

type NoteBoxPropTypes = {
  note: Note & FirestoreDoc;
  isEditable: boolean;
  onDelete?: () => void;
};

export function NoteBox({ note, onDelete, isEditable }: NoteBoxPropTypes) {
  const [isShowingFullText, setIsShowingFullText] = useState<boolean>(false);
  return (
    <Box minW="100%" borderWidth="1px" borderRadius="lg" p="3">
      <ButtonGroup size="xs" float="right">
        {onDelete && (
          <IconButton
            aria-label="Delete note"
            title="Delete note"
            icon={<FaTrashAlt />}
            colorScheme="pink"
            onClick={onDelete}
          />
        )}
      </ButtonGroup>
      <Editable
        float="left"
        defaultValue={note.title || "Untitled Note"}
        isDisabled={!isEditable}
        color="gray.500"
      >
        <EditablePreview as={Heading} size="md" fontWeight="semibold" />
        <EditableInput />
      </Editable>

      <Editable defaultValue={note.body} isDisabled={!isEditable}>
        <EditablePreview />
        <EditableTextarea noOfLines={4} rows={5} />
      </Editable>
      <Text
        color="gray.500"
        onClick={() => setIsShowingFullText(!isShowingFullText)}
      >
        Show {isShowingFullText ? "less" : "more"}...
      </Text>
      <Flex>
        <HStack spacing="3" my="2" flex="1">
          {note.tags &&
            note.tags.length &&
            note.tags.map((tag, tagIndex) => (
              <Tag key={tagIndex} size="sm">
                {tag}
              </Tag>
            ))}
        </HStack>
        <Text color="gray.500" size="sm" fontWeight="semibold">
          {note.createdAt.toLocaleString()}
        </Text>
      </Flex>
    </Box>
  );
}
