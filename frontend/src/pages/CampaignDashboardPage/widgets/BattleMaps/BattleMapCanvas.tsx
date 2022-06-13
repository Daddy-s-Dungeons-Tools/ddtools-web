import { ButtonGroup, Icon, IconButton, Tooltip } from "@chakra-ui/react";
import { BattleMap, BattleMapBGImage } from "ddtools-types";
import {
  collection,
  doc,
  FirestoreDataConverter,
  updateDoc,
} from "firebase/firestore";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Stage as KonvaStage } from "konva/lib/Stage";
import { CampaignUserContext } from "pages/CampaignDashboardPage/context";
import { useContext, useEffect, useMemo, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Layer, Line, Rect, Stage } from "react-konva";
import { converter, FirestoreDoc } from "services/converter";
import { firestore } from "services/firebase";
import { debounce } from "utils/debounce";
import { clamp } from "utils/index";
import { BackgroundImage } from "./BackgroundImage";

const GRID_WIDTH = 1500;
const GRID_HEIGHT = 1000;

type BattleMapCanvasPropTypes = {
  battleMap: BattleMap & FirestoreDoc;
  parentDiv: HTMLDivElement;
  scaleBy: number;
  scaleMin: number;
  scaleMax: number;
  gridCellSize: number;
  stagePadding: number;
};
export function BattleMapCanvas({
  battleMap,
  parentDiv,
  scaleBy,
  scaleMin,
  scaleMax,
  gridCellSize,
  stagePadding,
}: BattleMapCanvasPropTypes) {
  const { campaign, userRole } = useContext(CampaignUserContext);
  const [stage, setStage] = useState<{
    x: number;
    y: number;
    scale: number;
    width: number;
    height: number;
  }>({
    x: 0,
    y: 0,
    width: 500,
    height: 500,
    scale: 1,
  });

  const [isEditingBG, setIsEditingBG] = useState<boolean>(false);
  const [selectedBGImageIndex, setSelectedBGImageIndex] = useState<
    number | null
  >(null);

  /** Set the stage size to the size of the parent container. */
  function resizeStage() {
    const { offsetWidth, offsetHeight } = parentDiv;

    setStage({
      ...stage,
      width: offsetWidth,
      height: offsetHeight,
    });
  }

  // Resize the stage on first load
  useEffect(() => {
    resizeStage();
  }, [parentDiv]);

  // Resize the stage whenever the window is resized, which probably results in container resize
  useEffect(() => {
    const debouncedResizer = debounce(resizeStage, 1000);

    window.addEventListener("resize", debouncedResizer);
    return () => window.removeEventListener("resize", debouncedResizer);
  }, []);

  /** Given a scroll event, apply scaling to the stage. */
  function handleScrollWheel(konvaEvent: KonvaEventObject<WheelEvent>) {
    konvaEvent.evt.preventDefault();

    const curStage = konvaEvent.target.getStage()!;
    const oldScale = curStage.scaleX();
    const mousePointTo = {
      x: curStage.getPointerPosition()!.x / oldScale - curStage.x() / oldScale,
      y: curStage.getPointerPosition()!.y / oldScale - curStage.y() / oldScale,
    };

    let newScale =
      konvaEvent.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    newScale = Math.min(Math.max(newScale, scaleMin), scaleMax);
    let newX =
      (curStage.getPointerPosition()!.x / newScale - mousePointTo.x) * newScale;
    let newY =
      (curStage.getPointerPosition()!.y / newScale - mousePointTo.y) * newScale;

    const stageBoundingBox = getStageBoundingBox();

    if (newScale !== oldScale) {
      setStage({
        ...stage,
        scale: clamp(newScale, scaleMin, scaleMax),
        x: clamp(newX, stageBoundingBox[2], stageBoundingBox[0]),
        y: clamp(newY, stageBoundingBox[3], stageBoundingBox[1]),
      });
    }
  }

  /** Update the React state for the stage's position after ending a drag. */
  function handleStageDragEnd(konvaEvent: KonvaEventObject<DragEvent>) {
    if (konvaEvent.target !== konvaEvent.target.getStage()) {
      return;
    }
    setStage({
      ...stage,
      x: konvaEvent.target.x(),
      y: konvaEvent.target.y(),
    });
  }

  /** Limit how far the stage can be dragged. */
  function handleStageDragMove(konvaEvent: KonvaEventObject<DragEvent>) {
    if (konvaEvent.target !== konvaEvent.target.getStage()) {
      return;
    }
    console.log("stage dragged");

    const boundingBox = getStageBoundingBox();
    if (konvaEvent.target.x() > boundingBox[0]) {
      konvaEvent.target.x(boundingBox[0]);
    }

    if (konvaEvent.target.y() > boundingBox[1]) {
      konvaEvent.target.y(boundingBox[1]);
    }

    // TODO: add limits for other directions based on image size
    if (konvaEvent.target.x() < boundingBox[2]) {
      konvaEvent.target.x(boundingBox[2]);
    }

    if (konvaEvent.target.y() < boundingBox[3]) {
      konvaEvent.target.y(boundingBox[3]);
    }
  }

  /** Snape the target shape to the nearest grid cell. */
  function snapToGrid(target: Shape<ShapeConfig> | KonvaStage) {
    target.to({
      x: Math.round(target.x() / gridCellSize) * gridCellSize,
      y: Math.round(target.y() / gridCellSize) * gridCellSize,
      duration: 0.1,
    });
  }

  /** x1,y1, x2,y2 */
  function getStageBoundingBox(): [number, number, number, number] {
    return [
      stagePadding * stage.scale,
      stagePadding * stage.scale,
      -2000 * stage.scale,
      -1000 * stage.scale,
    ];
  }

  async function updateBackgroundImage(
    imageIndex: number,
    updates: Partial<BattleMapBGImage>,
  ) {
    if (!battleMap.backgroundImages) return;

    battleMap.backgroundImages[imageIndex] = {
      ...battleMap.backgroundImages[imageIndex],
      ...updates,
    };
    try {
      await updateDoc(
        doc(
          collection(firestore, "campaigns", campaign.id, "battlemaps"),
          battleMap.id,
        ).withConverter(converter as FirestoreDataConverter<BattleMap>),
        {
          backgroundImages: battleMap.backgroundImages,
        },
      );
    } catch (error) {
      console.error(error);
    }
  }

  const handleClick = (konvaEvent: KonvaEventObject<MouseEvent>) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = konvaEvent.target === konvaEvent.target.getStage();
    if (clickedOnEmpty) {
      setSelectedBGImageIndex(null);
    }
  };

  const gridLines = useMemo(() => {
    return [...Array(GRID_HEIGHT / gridCellSize + 1)]
      .map((_, index) => (
        <Line
          key={"x" + index}
          stroke="black"
          points={[0, index * gridCellSize, GRID_WIDTH, index * gridCellSize]}
        />
      ))
      .concat(
        [...Array(GRID_WIDTH / gridCellSize + 1)].map((_, index) => (
          <Line
            key={"y" + index}
            stroke="black"
            points={[
              index * gridCellSize,
              0,
              index * gridCellSize,
              GRID_HEIGHT,
            ]}
          />
        )),
      );
  }, []);

  const backgroundImages = useMemo(() => {
    return (
      battleMap.backgroundImages?.map((bgImg, index) => (
        <BackgroundImage
          key={index}
          bgImage={bgImg}
          isSelected={index === selectedBGImageIndex}
          onSelect={() => {
            if (userRole === "dm" && isEditingBG) {
              setSelectedBGImageIndex(index);
            }
          }}
          onChange={(changes) => updateBackgroundImage(index, changes)}
          isEditable={userRole === "dm" && isEditingBG}
        />
      )) ?? []
    );
  }, [userRole, battleMap, selectedBGImageIndex, isEditingBG]);

  return (
    <>
      <Stage
        x={stage.x}
        y={stage.y}
        width={stage.width}
        height={stage.height}
        scaleX={stage.scale}
        scaleY={stage.scale}
        onClick={handleClick}
        onTap={handleClick}
        onWheel={handleScrollWheel}
        onDragMove={handleStageDragMove}
        onDragEnd={handleStageDragEnd}
        draggable
      >
        <Layer id="background">{backgroundImages}</Layer>

        <Layer id="grid" draggable={false} x={0} y={0}>
          {gridLines}
        </Layer>
        <Layer>
          <Rect
            x={gridCellSize}
            y={gridCellSize}
            width={gridCellSize}
            height={gridCellSize}
            fill="red"
            onDragMove={(e) => {
              e.cancelBubble = true;
            }}
            onDragEnd={(e) => {
              e.cancelBubble = true;
              snapToGrid(e.target);
            }}
            draggable
          />
        </Layer>
      </Stage>

      <ButtonGroup
        flexDir="column"
        size="sm"
        position="absolute"
        top={3}
        left={3}
      >
        {userRole === "dm" && (
          <Tooltip label="Edit battle map" placement="right">
            <IconButton
              icon={<Icon as={FaEdit} />}
              aria-label={"edit battle map"}
              colorScheme="pink"
              onClick={() => setIsEditingBG(!isEditingBG)}
            />
          </Tooltip>
        )}
      </ButtonGroup>
    </>
  );
}
