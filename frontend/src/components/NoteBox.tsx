import { Box, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { Note } from "ddtools-types";
import { useState } from "react";
import { Tag } from "react-konva";
import { FirestoreDoc } from "../../../../../../services/converter";

type NoteBoxPropTypes = {
  note: Note & FirestoreDoc;
};

export function NoteBox({ note }: NoteBoxPropTypes) {
  const [isShowingFullText, setIsShowingFullText] = useState<boolean>(false);
  return (
    <Box minW="100%" borderWidth="1px" borderRadius="lg" p="3">
      {note.title && <Heading size="md">{note.title}</Heading>}
      <Text noOfLines={isShowingFullText ? undefined : 4}>{note.body}</Text>
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
