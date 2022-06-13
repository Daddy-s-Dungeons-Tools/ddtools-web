import { BattleMapBGImage } from "ddtools-types";
import { ref } from "firebase/storage";
import { Image as ImageType } from "konva/lib/shapes/Image";
import { useRef } from "react";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { Image, Transformer } from "react-konva";
import { storage } from "services/firebase";
import useImage from "use-image";

type BackgroundImagePropTypes = {
  bgImage: BattleMapBGImage;
  isSelected: boolean;
  onSelect: () => void;
  onChange: () => void;
};
export function BackgroundImage({
  bgImage,
  onSelect,
  isSelected,
}: BackgroundImagePropTypes) {
  const shapeRef = useRef<ImageType>(null);
  const transformerRef = useRef<Transformer>(null);
  const [downloadURL] = useDownloadURL(ref(storage, bgImage.filePath));
  const [image, imageStatus] = useImage(downloadURL!);

  return (
    <>
      <Image
        ref={shapeRef}
        x={bgImage.x}
        y={bgImage.y}
        width={bgImage.width}
        height={bgImage.height}
        onTap={onSelect}
        onClick={onSelect}
        image={image}
        draggable
      />
      {/** @ts-ignore */}
      {isSelected && <Transformer ref={transformerRef} />}
    </>
  );
}
