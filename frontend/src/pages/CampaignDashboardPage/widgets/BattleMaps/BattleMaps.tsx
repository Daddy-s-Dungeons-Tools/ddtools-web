import { Box, SimpleGrid } from "@chakra-ui/react";
import { BattleMap } from "ddtools-types";
import { collection, FirestoreDataConverter, query } from "firebase/firestore";
import { CampaignUserContext } from "pages/CampaignDashboardPage/context";
import { useContext, useEffect, useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { converter, FirestoreDoc } from "services/converter";
import { firestore } from "services/firebase";
import { BattleMapCanvas } from "./BattleMapCanvas";

export function BattleMaps() {
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

  return (
    <Box ref={boxRef} minW="100%" minH="100%">
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
          {battleMaps?.map((map) => (
            <Box
              key={map.id}
              cursor="pointer"
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
