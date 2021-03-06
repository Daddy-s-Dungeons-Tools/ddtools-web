import {
  Box,
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  EditableTextarea,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ErrorAlert } from "components/ErrorAlert";
import { WorldMap, WorldMapPin } from "ddtools-types";
import {
  collection,
  FirestoreDataConverter,
  PartialWithFieldValue,
  query,
} from "firebase/firestore";
import { Field, Formik, FormikHelpers } from "formik";
import { useContext, useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FaFlag, FaTrash } from "react-icons/fa";
import { GiPin, GiTreasureMap } from "react-icons/gi";
import { WorldMapAPI } from "services/api";
import { converter, FirestoreDoc } from "services/converter";
import { firestore } from "services/firebase";
import { CampaignUserContext } from "../context";

type WorldMapWithUrl = WorldMap & {
  imageURL?: string;
};

function PinPopover(props: {
  pin: WorldMapPin;
  pinKey: number;
  updatePin: (pinUpdates: PartialWithFieldValue<WorldMapPin>) => void;
  deletePin: () => void;
}) {
  const { userRole } = useContext(CampaignUserContext);
  const xPercentage = 100 * props.pin.location.xPercentage;
  const yPercentage = 100 * props.pin.location.yPercentage;

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          position="absolute"
          left={xPercentage + "%"}
          top={yPercentage + "%"}
          icon={<FaFlag color="red" size="20" />}
          aria-label="Pin"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          <Editable
            defaultValue={props.pin.name || "Unnamed Pin"}
            placeholder={props.pin.name || "Unnamed Pin"}
            isDisabled={userRole !== "dm"}
            onSubmit={(newVal) => props.updatePin({ name: newVal })}
          >
            <EditablePreview />
            <EditableInput />
          </Editable>
        </PopoverHeader>
        <PopoverBody>
          <Editable
            defaultValue={props.pin.description || "No description given..."}
            placeholder={props.pin.description || "No description given..."}
            isDisabled={userRole !== "dm"}
            onSubmit={(newVal) => props.updatePin({ description: newVal })}
          >
            <EditablePreview />
            <EditableTextarea />
          </Editable>

          {userRole === "dm" && (
            <ButtonGroup size="xs" mt="2">
              <Button>Show to Players</Button>
              <Button
                colorScheme="pink"
                leftIcon={<FaTrash />}
                onClick={props.deletePin}
              >
                Delete
              </Button>
            </ButtonGroup>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export function WorldMaps() {
  const { campaign, user, userRole } = useContext(CampaignUserContext);

  const [mapDocs, isMapDocsLoading, mapDocsError] = useCollectionData(
    query(
      collection(
        firestore,
        "campaigns",
        campaign.id,
        "worldmaps",
      ).withConverter(
        converter as FirestoreDataConverter<WorldMapWithUrl & FirestoreDoc>,
      ),
    ),
  );

  useEffect(() => {
    if (mapDocsError) {
      console.warn({
        mapDocsError,
      });
    }
  }, [mapDocsError]);

  const [isPinning, setIsPinning] = useState<boolean>(false);
  const [currentMapID, setCurrentMapID] = useState<string | null>(null);
  const currentMap = mapDocs?.find((map) => map.id === currentMapID);

  type NewMap = { name: string };
  function handleAddMap(values: NewMap, formikHelpers: FormikHelpers<NewMap>) {
    WorldMapAPI.add(user.uid, campaign.id, {
      name: values.name,
      // @ts-ignore
      imageURL:
        "https://preview.redd.it/6qoafiw0nnvz.png?width=640&crop=smart&auto=webp&s=923f5f6d1ee646f7c5f7f20e7f61cfcf51973bf2",
    });
  }

  function placePin(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (userRole !== "dm") {
      return;
    }

    if (isPinning && currentMap) {
      const map = document.getElementById("map");
      if (!map) return;
      const rect = map.getBoundingClientRect();
      const x = (
        1 -
        (rect.width - (e.clientX - rect.left - 13)) / rect.width
      ).toFixed(3);
      const y = (
        1 -
        (rect.height - (e.clientY - rect.top - 30)) / rect.height
      ).toFixed(3);
      const newPin: WorldMapPin = {
        location: { xPercentage: +x, yPercentage: +y },
      };

      const newPins = [...(currentMap.pins ?? []), newPin];
      WorldMapAPI.update(campaign.id, currentMap.id, { pins: newPins });
      setIsPinning(false);
    }
  }

  function updatePin(
    campaignId: string,
    map: WorldMap & FirestoreDoc,
    pinIndex: number,
    pinUpdates: PartialWithFieldValue<WorldMapPin>,
  ) {
    if (!map.pins) return;

    Object.assign(map.pins[pinIndex], pinUpdates);

    return WorldMapAPI.update(campaignId, map.id, map);
  }

  function deletePin(
    campaignId: string,
    map: WorldMap & FirestoreDoc,
    pinIndex: number,
  ) {
    if (!map.pins) return;

    map.pins.splice(pinIndex, 1);

    return WorldMapAPI.update(campaignId, map.id, map);
  }

  return (
    <Box>
      <VStack zIndex={5} position={"absolute"} spacing={"0"}>
        {currentMap && (
          <>
            {userRole === "dm" && (
              <IconButton
                aria-label="Add Landmark"
                onClick={() => setIsPinning(!isPinning)}
                icon={<GiPin color={isPinning ? "red" : "#63b3ed"} size={30} />}
                backgroundColor="#1a202c"
                padding="2"
                size="lg"
                margin="2"
              />
            )}

            <IconButton
              aria-label="Maps Menu"
              onClick={() => setCurrentMapID(null)}
              icon={<GiTreasureMap color={"#63b3ed"} size={30} />}
              backgroundColor="#1a202c"
              padding="2"
              size="lg"
              margin="2"
            />
          </>
        )}
      </VStack>

      {!currentMap ? (
        <Box>
          <Heading marginBottom={5}>Your Maps</Heading>

          {mapDocsError && (
            <ErrorAlert
              title="Yikes!"
              description="There was an error fetching the maps..."
            />
          )}

          <SimpleGrid columns={2} spacing={4}>
            <Box padding="6" borderWidth={1} borderRadius="lg">
              <Formik
                initialValues={{
                  name: "",
                }}
                onSubmit={handleAddMap}
              >
                {({ handleSubmit, isSubmitting }) => (
                  <form onSubmit={handleSubmit}>
                    <VStack align="start">
                      <FormControl>
                        <FormLabel htmlFor="world-map-name">
                          New World Map Name
                        </FormLabel>
                        <Field
                          as={Input}
                          name="name"
                          id="world-map-name"
                          placeholder="Cool Map"
                          required
                        />
                      </FormControl>
                      <Button
                        type="submit"
                        colorScheme="teal"
                        isLoading={isSubmitting}
                        loadingText="Adding map"
                      >
                        Add
                      </Button>
                    </VStack>
                  </form>
                )}
              </Formik>
            </Box>

            {isMapDocsLoading && (
              <>
                <Skeleton height="200px" />
                <Skeleton height="200px" />
              </>
            )}

            {!isMapDocsLoading &&
              mapDocs &&
              mapDocs.map((curMap) => (
                <Flex
                  justifyContent="center"
                  key={curMap.id}
                  onClick={() => setCurrentMapID(curMap.id)}
                  minW="100%"
                  maxH="100%"
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  mb="5"
                >
                  <Box flex={2} padding={4}>
                    <Heading>{curMap.name || "No name!"}</Heading>
                    <Text>{curMap.description || "No description!"}</Text>
                  </Box>

                  <Box
                    flex={3}
                    justifyContent="center"
                    backgroundColor={"#1a202c"}
                  >
                    <Image
                      height={200}
                      src={
                        curMap.imageURL ||
                        "https://csp-clients.s3.amazonaws.com/easttexasspa/wp-content/uploads/2021/06/no-image-icon-23485.png"
                      }
                      // width={"100%"}
                      object-fit="contain"
                    />
                  </Box>
                </Flex>
              ))}
          </SimpleGrid>
        </Box>
      ) : (
        <Box position="relative">
          {currentMap.pins &&
            currentMap.pins.map((tempPin, index) => (
              <PinPopover
                key={index}
                pin={tempPin}
                pinKey={index}
                updatePin={(pinUpdates) =>
                  updatePin(campaign.id, currentMap, index, pinUpdates)
                }
                deletePin={() => deletePin(campaign.id, currentMap, index)}
              />
            ))}

          <Image
            id="map"
            onClick={placePin}
            // src="https://preview.redd.it/6qoafiw0nnvz.png?width=640&crop=smart&auto=webp&s=923f5f6d1ee646f7c5f7f20e7f61cfcf51973bf2"   // Horizontal Map
            // src="https://usercontent.one/wp/www.wistedt.net/wp-content/uploads/2019/12/underdark_concept_web-812x1024.png"             // Vertical Map
            src={currentMap.imageURL}
            width={"100%"}
            objectFit="contain"
            zIndex={2}
            alt="Your image could not be displayed."
          />
        </Box>
      )}
    </Box>
  );
}
