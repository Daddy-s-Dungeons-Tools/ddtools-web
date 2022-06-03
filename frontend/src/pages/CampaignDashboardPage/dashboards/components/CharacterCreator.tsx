import {
  Box,
  Button,
  Checkbox,
  Container,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tag,
  Text,
  Tooltip,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  ABILITIES,
  ALIGNMENTS,
  Character,
  Class,
  Race,
  SKILLS,
  SKILLS_TO_ABILITIES,
} from "ddtools-types";
import { Field, Formik, FormikHelpers } from "formik";
import { useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDataSource } from "../../../../hooks/useDataSource";
import { setCampaignPlayerCharacter } from "../../../../services/api";
import { auth } from "../../../../services/firebase";
import { abilityScoreModifier } from "../../../../utils/characters";
import { emptyCharacter } from "../../../../utils/consts";
import { CampaignUserContext } from "../../CampaignDashboardPage";

export function CharacterCreator() {
  const toast = useToast();
  const { campaign } = useContext(CampaignUserContext);
  const [user] = useAuthState(auth);

  const [races, isRacesLoading, racesError] = useDataSource<Race>("races");
  const [classes, isClassesLoading, classesError] =
    useDataSource<Class>("classes");

  const handleSubmit = async (
    character: Character,
    formikHelpers: FormikHelpers<Character>,
  ): Promise<void> => {
    formikHelpers.setSubmitting(true);
    try {
      await setCampaignPlayerCharacter(campaign.id, user!.uid, character);
      toast({
        title: "Created Player",
        description: (
          <p>
            Welcome to the campaign, <strong>{character.name}</strong>
          </p>
        ),
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Yikes!",
        description: (
          <p>
            There was an error creating your character. Please check that all
            fields look correct.
          </p>
        ),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      formikHelpers.setSubmitting(true);
    }
  };

  return (
    <Container maxW="container.md">
      <Tooltip label="Character creator? I hardly even know 'er!">
        <Heading size="2xl">Character Creator</Heading>
      </Tooltip>
      <Text mb="10" color="gray.500" fontWeight="semibold" fontSize="xl">
        Enter in all of your character details once to get started.
      </Text>
      <Formik initialValues={emptyCharacter} onSubmit={handleSubmit}>
        {({
          handleSubmit,
          setFieldValue,
          errors,
          touched,
          handleChange,
          isSubmitting,
          values,
        }) => (
          <form onSubmit={handleSubmit}>
            <VStack spacing="5">
              <FormControl>
                <FormLabel htmlFor="characterName">Name</FormLabel>
                <Field
                  as={Input}
                  id="characterName"
                  name="name"
                  type="text"
                  required
                />
              </FormControl>

              <HStack w="100%">
                <FormControl flex="1">
                  <FormLabel htmlFor="characterRace">Race</FormLabel>
                  <Select
                    placeholder="Select race"
                    onChange={(ev) => setFieldValue("race", undefined!)}
                    required
                  >
                    {races.map((race, raceIndex) => (
                      <option key={raceIndex} value={raceIndex}>
                        {race.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl flex="1">
                  <FormLabel htmlFor="characterClass">Class</FormLabel>
                  <Select placeholder="Select class" required>
                    {classes.map((cls, clsIndex) => (
                      <option key={clsIndex} value={clsIndex}>
                        {cls.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl flex="1">
                  <FormLabel htmlFor="characterAlignment">Alignment</FormLabel>
                  <Select
                    placeholder="Select alignment"
                    name="alignment"
                    onChange={handleChange}
                    required
                  >
                    {ALIGNMENTS.map((alignment) => (
                      <option key={alignment} value={alignment}>
                        {alignment}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>

              <Heading size="lg">Abilities</Heading>
              <StatGroup w="100%">
                {ABILITIES.map((ability) => (
                  <Stat key={ability}>
                    <StatLabel
                      fontWeight="semibold"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      {ability}
                    </StatLabel>
                    <StatNumber>
                      <Editable
                        defaultValue={emptyCharacter.abilityScores[
                          ability
                        ].toString()}
                      >
                        <EditablePreview />
                        <EditableInput
                          min={0}
                          max={20}
                          value={values.abilityScores[ability]}
                          name={`abilityScores.${ability}`}
                          type="number"
                          onChange={handleChange}
                          required
                        />
                      </Editable>
                    </StatNumber>
                    <StatHelpText>
                      <StatArrow
                        type={
                          abilityScoreModifier(values.abilityScores[ability]) >=
                          0
                            ? "increase"
                            : "decrease"
                        }
                      />
                      {abilityScoreModifier(values.abilityScores[ability])}
                    </StatHelpText>
                  </Stat>
                ))}
              </StatGroup>

              <Heading size="lg">Skills</Heading>
              <Wrap>
                {SKILLS.map((skill) => (
                  <WrapItem key={skill}>
                    <Box borderWidth="1px" borderRadius="lg" p="3">
                      <VStack>
                        <Heading size="md" textTransform="capitalize">
                          {skill}{" "}
                          <Text
                            as="span"
                            color="gray.500"
                            textTransform="uppercase"
                          >
                            {SKILLS_TO_ABILITIES[skill]}
                          </Text>
                        </Heading>
                        <HStack>
                          <Checkbox>Proficient</Checkbox>
                          <Checkbox>Expertise</Checkbox>
                        </HStack>
                        <NumberInput
                          size="xs"
                          placeholder="Misc. modifier"
                          defaultValue={0}
                          step={1}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>

                        <Text>
                          Overall modifier = <Tag colorScheme="purple">+3</Tag>
                        </Text>
                      </VStack>
                    </Box>
                  </WrapItem>
                ))}
              </Wrap>

              <Heading size="lg">Saving Throws</Heading>
              <Wrap>
                {ABILITIES.map((ability) => (
                  <WrapItem key={ability}>
                    <Box borderWidth="1px" borderRadius="lg" p="3">
                      <VStack>
                        <Heading size="md" textTransform="capitalize">
                          {ability}
                        </Heading>
                        <HStack>
                          <Checkbox>Proficient</Checkbox>
                          <NumberInput
                            size="xs"
                            placeholder="Misc. modifier"
                            defaultValue={0}
                            step={1}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </HStack>

                        <Text>
                          Overall modifier = <Tag colorScheme="purple">+3</Tag>
                        </Text>
                      </VStack>
                    </Box>
                  </WrapItem>
                ))}
              </Wrap>

              <Button
                type="submit"
                colorScheme="purple"
                minW="100%"
                size="lg"
                mt="5"
                isLoading={isSubmitting}
                loadingText="Adding character..."
              >
                Enter {campaign.name} as {values.name}
              </Button>
            </VStack>
            <pre>
              <code>{JSON.stringify(values, null, 2)}</code>
            </pre>
          </form>
        )}
      </Formik>
    </Container>
  );
}
