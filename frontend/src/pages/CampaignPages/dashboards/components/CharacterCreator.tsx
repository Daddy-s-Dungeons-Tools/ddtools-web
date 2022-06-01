import {
  Button,
  Container,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Character } from "ddtools-types";
import { Field, Formik, FormikHelpers } from "formik";
import { useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { setCampaignPlayerCharacter } from "../../../../services/api";
import { auth } from "../../../../services/firebase";
import { abilityScoreModifier } from "../../../../utils/characters";
import {
  ABILITIES,
  ALIGNMENTS,
  emptyCharacter,
} from "../../../../utils/consts";
import { CampaignUserContext } from "../../CampaignDashboardPage";

export function CharacterCreator() {
  const toast = useToast();
  const { campaign } = useContext(CampaignUserContext);
  const [user] = useAuthState(auth);

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
                  ></Select>
                </FormControl>
                <FormControl flex="1">
                  <FormLabel htmlFor="characterClass">Class</FormLabel>
                  <Select placeholder="Select class" required>
                    <option value="human">Fighter</option>
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
