import { BattleMapToken } from "ddtools-types";
import { ref } from "firebase/storage";
import { CampaignUserContext } from "pages/CampaignDashboardPage/context";
import { useContext } from "react";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { Image } from "react-konva";
import { storage } from "services/firebase";
import useImage from "use-image";

type CharacterTokenPropTypes = {
  token: BattleMapToken;
  gridCellSize: number;
};

export function BattleMapTokenNode({
  gridCellSize,
  token,
}: CharacterTokenPropTypes) {
  const { user } = useContext(CampaignUserContext);
  const [downloadURL] = useDownloadURL(ref(storage, token.thumbnailFilePath));
  const [image, imageStatus] = useImage(downloadURL!);

  return (
    <Image
      image={image}
      width={gridCellSize}
      height={gridCellSize}
      x={token.x}
      y={token.y}
      draggable={user.uid === token.sourceId}
    />
  );
}
