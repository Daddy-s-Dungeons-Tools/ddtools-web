import {
  Box,
  Flex,
  Heading,
  Hide,
  HStack,
  Tag,
  Image,
  Tooltip,
  VStack,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { Character } from "ddtools-types";
import {
  characterHealthStatus,
  characterPhysicalDescription,
  characterRaceAndClasses,
} from "../../utils/characters";
import { ABILITIES } from "../../utils/consts";

type CampaignPlayerBoxPropTypes = {
  userDisplayName: string;
  character: Character;
};
export function CampaignPlayerBox({
  character,
  userDisplayName,
}: CampaignPlayerBoxPropTypes) {
  return (
    <Box minW="100%" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Flex>
        <Hide below="sm">
          <Tooltip
            label={characterPhysicalDescription(character)}
            placement="right"
          >
            <Image
              w={{ base: "32" }}
              // TODO: replace with real image
              src="https://i0.wp.com/www.hireanillustrator.com/i/images/2021/02/DnD1.jpg?resize=600%2C849&ssl=1"
              alt={`${userDisplayName}'s character ${character.name}`}
            />
          </Tooltip>
        </Hide>
        <Box p="6">
          <VStack align="flex-start">
            <Tooltip placement="right" label={`Played by ${userDisplayName}`}>
              <Heading size="lg">
                {character.name}{" "}
                {character.nickname && `(${character.nickname})`}
              </Heading>
            </Tooltip>
            <Heading size="md">{characterRaceAndClasses(character)}</Heading>

            <StatGroup minW="100%">
              {ABILITIES.map((ability) => (
                <Stat>
                  <StatLabel
                    fontWeight="semibold"
                    textTransform="uppercase"
                    color="gray.500"
                  >
                    {ability}
                  </StatLabel>
                  <StatNumber>{character.abilityScores[ability]}</StatNumber>
                </Stat>
              ))}
            </StatGroup>

            <HStack>
              <Tag colorScheme="green">{characterHealthStatus(character)}</Tag>
              <Tag colorScheme="blue">{character.alignment}</Tag>
            </HStack>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}
