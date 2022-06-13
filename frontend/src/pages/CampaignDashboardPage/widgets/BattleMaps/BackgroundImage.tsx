import { BattleMapBGImage } from "ddtools-types";
import { PartialWithFieldValue } from "firebase/firestore";
import { ref } from "firebase/storage";
import { Image as ImageType } from "konva/lib/shapes/Image";
import { useEffect, useRef } from "react";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { Image, Transformer } from "react-konva";
import { storage } from "services/firebase";
import useImage from "use-image";

type BackgroundImagePropTypes = {
  bgImage: BattleMapBGImage;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (changes: PartialWithFieldValue<BattleMapBGImage>) => void;
};
export function BackgroundImage({
  bgImage,
  onSelect,
  onChange,
  isSelected,
}: BackgroundImagePropTypes) {
  const shapeRef = useRef<ImageType>(null);
  const transformerRef = useRef<Transformer>(null);
  const [downloadURL] = useDownloadURL(ref(storage, bgImage.filePath));
  const [image, imageStatus] = useImage(downloadURL!);

  useEffect(() => {
    if (isSelected && transformerRef.current) {
      // @ts-ignore
      transformerRef.current.nodes([shapeRef.current]);
    }
  }, [isSelected]);

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
        onDragMove={(e) => {
          e.cancelBubble = true;
        }}
        onDragEnd={(e) => {
          e.cancelBubble = true;
          onChange({ x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={(e) => {
          e.cancelBubble = true;

          const node = shapeRef.current;
          if (!node) {
            return;
          }
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // Convert from scale to width and height
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
        draggable
      />
      {isSelected && (
        <Transformer
          /** @ts-ignore */
          ref={transformerRef}
        />
      )}
    </>
  );
}
