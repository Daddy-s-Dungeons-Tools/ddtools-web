import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Character } from "ddtools-types";
import { Field, Formik, FormikHelpers } from "formik";
import { useContext } from "react";
import { emptyCharacter } from "../../../../utils/consts";
import { CampaignUserContext } from "../../CampaignDashboardPage";

export function CharacterCreator() {
  const { campaign } = useContext(CampaignUserContext);

  const handleSubmit = (
    values: Character,
    formikHelpers: FormikHelpers<Character>,
  ): void | Promise<void> => {
    console.log(values);
  };

  return (
    <Container maxW="container.md">
      <Heading size="2xl">Character Creator</Heading>
      <Text color="gray.500" fontWeight="semibold" fontSize="xl">
        Enter in all of your character details once to get started.
      </Text>
      <Formik initialValues={emptyCharacter} onSubmit={handleSubmit}>
        {({ handleSubmit, errors, touched, values }) => (
          <form onSubmit={handleSubmit}>
            <VStack>
              <FormControl>
                <FormLabel htmlFor="characterName">Character Name</FormLabel>
                <Field as={Input} id="characterName" name="name" type="text" />
              </FormControl>

              <Button
                type="submit"
                colorScheme="purple"
                minW="100%"
                size="lg"
                mt="5"
              >
                Enter {campaign.name} as {values.name}
              </Button>
            </VStack>
          </form>
        )}
      </Formik>
    </Container>
  );
}
