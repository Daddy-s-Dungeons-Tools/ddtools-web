import { Flex, Box, VStack, Tooltip, IconButton } from "@chakra-ui/react";
import { FaUsers } from "react-icons/fa";
import { GiScrollQuill, GiScrollUnfurled } from "react-icons/gi";

export function Sidebar() {
  return (
    <Flex align="center">
      <Box
        as="nav"
        p="3"
        bgColor="gray.500"
        borderTopRightRadius="base"
        borderBottomRightRadius="base"
      >
        <VStack>
          <Tooltip label="Notes" placement="right">
            <IconButton icon={<GiScrollQuill />} aria-label={"notes"} />
          </Tooltip>
          <Tooltip label="Event Log" placement="right">
            <IconButton icon={<GiScrollUnfurled />} aria-label={"event log"} />
          </Tooltip>
          <Tooltip label="Party" placement="right">
            <IconButton icon={<FaUsers />} aria-label={"party"} />
          </Tooltip>
        </VStack>
      </Box>
      <Box></Box>
    </Flex>
  );
}
