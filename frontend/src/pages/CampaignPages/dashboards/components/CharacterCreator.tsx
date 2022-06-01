import { Button, Container, Heading, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { CampaignUserContext } from "../../CampaignDashboardPage";

export function CharacterCreator() {
  const { campaign } = useContext(CampaignUserContext);
  return (
    <Container maxW="container.md">
      <Heading size="2xl">Character Creator</Heading>
      <Text color="gray.500" fontWeight="semibold" fontSize="xl">
        Enter in all of your character details once to get started.
      </Text>

      <Button colorScheme="purple" minW="100%" size="lg" mt="5">
        Enter {campaign.name} as {"CHARACTER"}
      </Button>
    </Container>
  );
}
