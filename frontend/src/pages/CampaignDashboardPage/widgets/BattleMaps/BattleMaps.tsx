import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Skeleton,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ErrorAlert } from "components/ErrorAlert";
import { BattleMap } from "ddtools-types";
import { collection, FirestoreDataConverter, query } from "firebase/firestore";
import { Field, Formik, FormikHelpers } from "formik";
import { CampaignUserContext } from "pages/CampaignDashboardPage/context";
import { useContext, useEffect, useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { BattleMapAPI } from "services/api";
import { converter, FirestoreDoc } from "services/converter";
import { firestore } from "services/firebase";
import { BattleMapCanvas } from "./BattleMapCanvas";

type NewBattleMap = Pick<BattleMap, "name">;

export function BattleMaps() {
  const toast = useToast();
  const { campaign, user } = useContext(CampaignUserContext);
  // Firestore data
  const [battleMaps, isBattleMapsLoading, battleMapsError] = useCollectionData(
    query(
      collection(firestore, "campaigns", campaign.id, "battlemaps"),
      // where("ownerUserId", "==", user.uid),
    ).withConverter(
      converter as FirestoreDataConverter<BattleMap & FirestoreDoc>,
    ),
  );
  const boxRef = useRef<HTMLDivElement>(null);
  const [selectedBattleMapId, setSelectedBattleMapId] = useState<string | null>(
    null,
  );
  const selectedMap = battleMaps?.find((map) => map.id === selectedBattleMapId);

  useEffect(() => {
    if (battleMapsError) {
      console.warn(battleMapsError);
    }
  }, [battleMapsError]);

  /** Attempt to add new battle map. */
  async function handleAddMap(
    values: NewBattleMap,
    formikHelpers: FormikHelpers<NewBattleMap>,
  ) {
    try {
      BattleMapAPI.add(user.uid, campaign.id, values);
      toast({
        title: `Added New Battle Map`,
        description: "Click on the map to edit it.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: `An Error Occurred`,
        description: "Failed to add new battle map. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      formikHelpers.setSubmitting(false);
    }
  }

  return (
    <Box ref={boxRef} minW="100%" minH="100%" position="relative">
      {battleMapsError && (
        <ErrorAlert title="Yikes!" description="Failed to load battle maps." />
      )}
      {selectedMap ? (
        <BattleMapCanvas
          battleMap={selectedMap}
          parentDiv={boxRef.current!}
          scaleBy={1.2}
          scaleMin={0.5}
          scaleMax={4}
          gridCellSize={50}
          stagePadding={500}
        />
      ) : (
        <SimpleGrid columns={2} spacing={3}>
          {isBattleMapsLoading && (
            <>
              <Skeleton height={"200px"} />
              <Skeleton height={"200px"} />
              <Skeleton height={"200px"} />
            </>
          )}
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
                      <FormLabel htmlFor="map-name">
                        New Battle Map Name
                      </FormLabel>
                      <Field
                        as={Input}
                        name="name"
                        id="map-name"
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
          {battleMaps?.map((map) => (
            <Box
              key={map.id}
              cursor="pointer"
              padding="6"
              borderWidth={1}
              borderRadius="lg"
              onClick={() => setSelectedBattleMapId(map.id)}
            >
              {map.name}
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
