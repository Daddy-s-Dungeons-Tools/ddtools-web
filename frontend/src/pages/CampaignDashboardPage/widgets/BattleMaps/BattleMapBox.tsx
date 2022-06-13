import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { BattleMap } from "ddtools-types";
import { ref } from "firebase/storage";
import { CampaignUserContext } from "pages/CampaignDashboardPage/context";
import { useContext } from "react";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FirestoreDoc } from "services/converter";
import { storage } from "services/firebase";

type BattleMapBoxPropTypes = {
  map: BattleMap & FirestoreDoc;
  onSelect: () => void;
};
export function BattleMapBox({ map, onSelect }: BattleMapBoxPropTypes) {
  const { userRole } = useContext(CampaignUserContext);

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
      bgImage={downloadURL}
      backgroundSize="cover"
      backgroundPosition="center"
      minH={"250px"}
    >
      <Flex justify="space-between" h="100%">
        <Heading size="md">{map.name}</Heading>
        {userRole === "dm" && (
          <Box>
            <Button
              size="sm"
              leftIcon={map.isActive ? <FaEye /> : <FaEyeSlash />}
              colorScheme={map.isActive ? "green" : "pink"}
              onClick={(e) => e.stopPropagation()}
            >
              {map.isActive ? "Visible" : "Invisible"} to Players
            </Button>
          </Box>
        )}
      </Flex>
    </Box>
  );
}
