import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Container,
  Heading,
  Tooltip,
} from "@chakra-ui/react";

export function CharacterCreator() {
  // const toast = useToast();
  // const { campaign } = useContext(CampaignUserContext);
  // const [user] = useAuthState(auth);

  // const [races, isRacesLoading, racesError] = useDataSource<Race>("races");
  // const [classes, isClassesLoading, classesError] =
  //   useDataSource<Class>("classes");

  return (
    <Container maxW="container.md">
      <Tooltip label="Character creator? I hardly even know 'er!">
        <Heading size="2xl">Character Creator</Heading>
      </Tooltip>

      <Alert status="warning" my="5">
        <AlertIcon />
        <AlertTitle>In Progress</AlertTitle>
        <AlertDescription>
          The character creator is in progress.
        </AlertDescription>
      </Alert>
    </Container>
  );
}
