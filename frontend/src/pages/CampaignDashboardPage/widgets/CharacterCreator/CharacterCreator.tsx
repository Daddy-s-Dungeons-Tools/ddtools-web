import {
  Box,
  Container,
  Heading,
  HStack,
  Icon,
  Progress,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { Character } from "ddtools-types";
import { Formik } from "formik";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { stages } from "./stages";

type CharacterCreatorType = Pick<
  Character,
  "name" | "nickname" | "size" | "alignment" | "physical" | "personality"
> & {
  selectedClass: any;
  selectedRace: any;
};

export function CharacterCreator() {
  // const toast = useToast();
  // const { campaign } = useContext(CampaignUserContext);
  // const [user] = useAuthState(auth);

  // const [races, isRacesLoading, racesError] = useDataSource<Race>("races");
  // const [classes, isClassesLoading, classesError] =
  //   useDataSource<Class>("classes");
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);

  const currentStage = stages[currentStageIndex];

  return (
    <Container maxW="container.md">
      <Tooltip label="Character creator? I hardly even know 'er!">
        <Heading size="2xl">Character Creator</Heading>
      </Tooltip>

      <VStack my="5" borderWidth="1px" borderRadius="lg" p="6" align="start">
        <HStack minW="100%" spacing="5">
          <Icon fontSize="2xl" as={FaChevronLeft} />
          <Box flex="1">
            <Heading>
              Stage {currentStageIndex + 1}: {currentStage.name}
            </Heading>
            <Text>{currentStage.description}</Text>
            <Progress w="100%" value={currentStageIndex} max={stages.length} />
          </Box>
          <Icon fontSize="2xl" as={FaChevronRight} />
        </HStack>
      </VStack>

      <Formik initialValues={{}} onSubmit={() => {}}>
        {({}) => currentStage.component}
      </Formik>
    </Container>
  );
}
