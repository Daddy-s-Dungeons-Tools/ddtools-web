import {
  Box,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { Item } from "ddtools-types";

export function ItemTooltip({ item }: { item: Item }) {
  return (
    <Popover size="lg">
      <PopoverTrigger>
        <a
          style={{ textDecoration: "underline dotted" }}
          href="#"
          target="_self"
        >
          {item.name}
        </a>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          {item.entries.map((entry, index) =>
            typeof entry === "string" ? (
              entry
            ) : (
              <Box key={index}>
                <strong>{entry.name}</strong>
                <p>{entry.entries.join("\n")}</p>
              </Box>
            ),
          )}
          <HStack
            color="gray.500"
            fontWeight="semibold"
            fontSize="xs"
            textTransform="uppercase"
            mt="2"
          >
            <Text flex="1">worth {item.value && `${item.value} cp`}</Text>
            <Text>
              <a href="https://5e.tools/items.html" target="_5etools">
                more info
              </a>
            </Text>
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
