import {
  Image,
  Text,
  Box,
  Container,
  Flex,
  Heading,
  VStack,
  Button,
} from "@chakra-ui/react";
import { useProtectedRoute } from "../../hooks/routes";

function PlayerCampaignBox() {
  return (
    <Box minW="100%" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Flex>
        <Image
          w={"32"}
          src="https://cdn.vox-cdn.com/thumbor/ShgZ3-pi6BnxczAG1ycmmk3l8uE=/0x23:1513x1032/1400x1400/filters:focal(0x23:1513x1032):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/33511669/905825_10152396043776071_8883312392855826763_o.0.jpg"
          alt=""
        />
        <Box p={6}>
          <Text>Silly Campaign Title</Text>
          <Heading size="md" mb="8">
            Atreyu, Level 9 Human Monk
          </Heading>

          <Box
            color="gray.500"
            fontWeight="semibold"
            fontSize="xs"
            textTransform="uppercase"
          >
            8 players | 30 sessions | DMed by Aaron Reers
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default function CampaignsPage() {
  useProtectedRoute();

  return (
    <Container maxW="container.lg">
      <Flex w="100%">
        <VStack flex={"1"} align="flex-start" p={3}>
          <Heading mb="8">Your Player Campaigns</Heading>

          <PlayerCampaignBox />

          <Button minW="100%" disabled>
            No Pending Invites
          </Button>
        </VStack>
        <VStack flex={"1"} align="flex-start" p={3}>
          <Heading mb="8">Your DM Campaigns</Heading>
          <Button minW="100%">Start Campaign</Button>
        </VStack>
      </Flex>
    </Container>
  );
}
