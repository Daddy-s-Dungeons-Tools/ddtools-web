import { Box, Image } from "@chakra-ui/react";
import { BattleMap } from "ddtools-types";
import { ref } from "firebase/storage";
import { CampaignUserContext } from "pages/CampaignDashboardPage/context";
import { useContext } from "react";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { FirestoreDoc } from "services/converter";
import { storage } from "services/firebase";

type BattleMapBoxPropTypes = {
  map: BattleMap & FirestoreDoc;
  onSelect: () => void;
};
export function BattleMapBox({ map, onSelect }: BattleMapBoxPropTypes) {
  const { campaign, user } = useContext(CampaignUserContext);

  const [downloadURL] = useDownloadURL(
    map.thumbnailFilePath && map.thumbnailFilePath.length
      ? ref(storage, map.thumbnailFilePath)
      : null,
  );
  return (
    <Box
      key={map.id}
      cursor="pointer"
      padding="6"
      borderWidth={1}
      borderRadius="lg"
      onClick={onSelect}
    >
      {map.name}
      <Image src="" alt="Map preview" />
    </Box>
  );
}
