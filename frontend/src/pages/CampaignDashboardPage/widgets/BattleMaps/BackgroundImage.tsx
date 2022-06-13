import { BattleMapBGImage } from "ddtools-types";
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
  onChange: (changes: Partial<BattleMapBGImage>) => void;
  isEditable: boolean;
};
export function BackgroundImage({
  bgImage,
  onSelect,
  onChange,
  isSelected,
  isEditable,
}: BackgroundImagePropTypes) {
  const shapeRef = useRef<ImageType>(null);
  const transformerRef = useRef<Transformer>(null);
  const [downloadURL] = useDownloadURL(ref(storage, bgImage.filePath));
  const [image, imageStatus] = useImage(downloadURL!, "anonymous");

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
        rotation={bgImage.rotation}
        onTap={onSelect}
        onClick={onSelect}
        image={image}
        onDragStart={() => onSelect()}
        onDragEnd={(e) => {
          onChange({ x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={(e) => {
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
            width: Math.max(5, node.width() * scaleX), // determine min
            height: Math.min(node.height() * scaleY), // determine max
            rotation: node.rotation(),
          });
        }}
        draggable={isEditable}
      />
      {isSelected && isEditable && (
        <Transformer
          /** @ts-ignore */
          ref={transformerRef}
          rotationSnaps={[0, 90, 180, 270]}
        />
      )}
    </>
  );
}
