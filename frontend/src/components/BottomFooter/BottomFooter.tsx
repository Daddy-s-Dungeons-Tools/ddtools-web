import {
  ButtonGroup,
  Container,
  Text,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

export function BottomFooter() {
  return (
    <Container
      as="footer"
      role="contentinfo"
      minW="100%"
      p={8}
      bgColor="gray.700"
      mt="10"
    >
      <HStack justifyContent="space-between">
        <Text color="gray.500">
          {new Date().getFullYear()} Daddy's Dungeon Tools, No rights reserved.
        </Text>
        <ButtonGroup variant="ghost">
          <IconButton
            as="a"
            target="_blank"
            href="https://github.com/Daddy-s-Dungeons-Tools/ddtools-web"
            aria-label="LinkedIn"
            icon={<FaGithub />}
          ></IconButton>
        </ButtonGroup>
      </HStack>
    </Container>
  );
}
