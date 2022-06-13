import {
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { BattleMap, BattleMapBGImage, BattleMapToken } from "ddtools-types";
import { collection, FirestoreDataConverter, query } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { Layer as KonvaLayer } from "konva/lib/Layer";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Stage as KonvaStage } from "konva/lib/Stage";
import { CampaignUserContext } from "pages/CampaignDashboardPage/context";
import {
  ChangeEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  FaChessBoard,
  FaEdit,
  FaFileUpload,
  FaImage,
  FaTrashAlt,
} from "react-icons/fa";
import { Layer, Line, Rect, Stage } from "react-konva";
import { BattleMapAPI } from "services/api";
import { converter, FirestoreDoc } from "services/converter";
import { firestore, storage } from "services/firebase";
import { debounce } from "utils/debounce";
import { clamp } from "utils/index";
import { BackgroundImage } from "./BackgroundImage";
import { BattleMapTokenNode } from "./BattleMapToken";

type BattleMapCanvasPropTypes = {
  battleMap: BattleMap & FirestoreDoc;
  parentDiv: HTMLDivElement;
  scaleBy: number;
  scaleMin: number;
  scaleMax: number;
  stagePadding: number;
  onExit: () => void;
};
export function BattleMapCanvas({
  battleMap,
  parentDiv,
  scaleBy,
  scaleMin,
  scaleMax,
  stagePadding,
  onExit,
}: BattleMapCanvasPropTypes) {
  const toast = useToast();
  const { campaign, userRole } = useContext(CampaignUserContext);
  const backgroundLayerRef = useRef<KonvaLayer>(null);
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

  // Fetch tokens
  const [tokens, isTokensLoading, tokensError] = useCollectionData(
    query(
      collection(
        firestore,
        "campaigns",
        campaign.id,
        "battlemaps",
        battleMap.id,
        "tokens",
      ),
    ).withConverter(
      converter as FirestoreDataConverter<BattleMapToken & FirestoreDoc>,
    ),
  );

  /** The tokens that the user is allowed to see, based on their role and permissions. */
  const userVisibleTokens = tokens?.filter(
    (token) => userRole === "dm" || token.isVisible,
  );

  const uploadBGImageInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingBGImage, setIsUploadingBGImage] = useState<boolean>(false);
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

  useEffect(() => {
    if (!isEditingBG) {
      saveMapThumbail();
    }
  }, [isEditingBG]);

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
      x:
        Math.round(target.x() / battleMap.gridCellSize) *
        battleMap.gridCellSize,
      y:
        Math.round(target.y() / battleMap.gridCellSize) *
        battleMap.gridCellSize,
      duration: 0.1,
    });
  }

  /** x1,y1, x2,y2 */
  function getStageBoundingBox(): [number, number, number, number] {
    return [
      battleMap.gridTotalWidth * 0.8 * stage.scale,
      battleMap.gridTotalHeight * 0.8 * stage.scale,
      -(battleMap.gridTotalWidth * 0.8) * stage.scale,
      -(battleMap.gridTotalHeight * 0.8) * stage.scale,
    ];
  }

  async function updateMapName(newName: string) {
    try {
      await BattleMapAPI.update(campaign.id, battleMap.id, {
        name: newName,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: `An Error Occurred`,
        description: "Failed to save your changes. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  /** Updates a single background image for the battle map. */
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
      await BattleMapAPI.update(campaign.id, battleMap.id, {
        backgroundImages: battleMap.backgroundImages,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: `An Error Occurred`,
        description: "Failed to save your changes. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  /** Adds a new background image for the battle map. */
  async function addBackgroundImage(bgImage: BattleMapBGImage) {
    try {
      await BattleMapAPI.update(campaign.id, battleMap.id, {
        backgroundImages: [...(battleMap.backgroundImages ?? []), bgImage],
      });
    } catch (error) {
      console.error(error);
      toast({
        title: `Failed to Add Image`,
        description: `Failed to add background image. Please try again later.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  async function deleteBackgroundImage(bgImageIndex: number) {
    if (!battleMap.backgroundImages) return;
    try {
      await BattleMapAPI.update(campaign.id, battleMap.id, {
        backgroundImages: battleMap.backgroundImages.filter(
          (img, imgIndex) => imgIndex !== bgImageIndex,
        ),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: `Failed to Delete Image`,
        description: `Failed to delete background image. Please try again later.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  /** Handle all clicks on the stage. Used to deselect objects with transformers. */
  function handleClick(konvaEvent: KonvaEventObject<MouseEvent>) {
    // deselect when clicked on empty area
    const clickedOnEmpty = konvaEvent.target === konvaEvent.target.getStage();
    if (clickedOnEmpty) {
      setSelectedBGImageIndex(null);
    }
  }

  async function handleBGImageUpload(event: ChangeEvent<HTMLInputElement>) {
    setIsUploadingBGImage(true);

    const target = event.currentTarget;
    if (!target.files) return;

    const files = Array.from(target.files);
    target.files = null;

    for (const file of files) {
      const fileRef = ref(
        storage,
        "campaigns/" +
          campaign.id +
          "/battlemaps/" +
          battleMap.id +
          "/bgimages/" +
          file.name,
      );
      try {
        const uploadResult = await uploadBytes(fileRef, file);

        const newBGImage: BattleMapBGImage = {
          filePath: uploadResult.ref.fullPath,
          x: 0,
          y: 0,
          height: 500, // TODO: get actual image size
          width: 500,
          rotation: 0,
        };

        await addBackgroundImage(newBGImage);
      } catch (error) {
        console.error(error);
      }
    }
    setIsUploadingBGImage(false);
  }

  async function saveMapThumbail() {
    if (!backgroundLayerRef.current) {
      return;
    }
    backgroundLayerRef.current.toDataURL({
      x: stage.x,
      y: stage.y,
      height: battleMap.gridTotalHeight * stage.scale,
      width: battleMap.gridTotalWidth * stage.scale,
      pixelRatio: 1 / stage.scale / 5,
      async callback(dataUrl) {
        const blob = await (await fetch(dataUrl)).blob();
        const path =
          battleMap.thumbnailFilePath ??
          "/battlemapthumbnails/" + battleMap.id + ".png";
        const result = await uploadBytes(ref(storage, path), blob);
        await BattleMapAPI.update(campaign.id, battleMap.id, {
          thumbnailFilePath: result.ref.fullPath,
        });
      },
    });
  }

  const gridLines = useMemo(() => {
    return [...Array(battleMap.gridTotalHeight / battleMap.gridCellSize + 1)]
      .map((_, index) => (
        <Line
          key={"x" + index}
          stroke="black"
          points={[
            0,
            index * battleMap.gridCellSize,
            battleMap.gridTotalWidth,
            index * battleMap.gridCellSize,
          ]}
        />
      ))
      .concat(
        [...Array(battleMap.gridTotalWidth / battleMap.gridCellSize + 1)].map(
          (_, index) => (
            <Line
              key={"y" + index}
              stroke="black"
              points={[
                index * battleMap.gridCellSize,
                0,
                index * battleMap.gridCellSize,
                battleMap.gridTotalHeight,
              ]}
            />
          ),
        ),
      );
  }, [
    battleMap.gridTotalHeight,
    battleMap.gridTotalWidth,
    battleMap.gridCellSize,
  ]);

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
        <Layer ref={backgroundLayerRef} id="background">
          {backgroundImages}
        </Layer>

        <Layer id="grid" draggable={false} x={0} y={0}>
          {gridLines}
        </Layer>
        <Layer id="tokens">
          <Rect
            x={battleMap.gridCellSize}
            y={battleMap.gridCellSize}
            width={battleMap.gridCellSize}
            height={battleMap.gridCellSize}
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

          {userVisibleTokens?.map((token) => (
            <BattleMapTokenNode
              key={token.id}
              token={token}
              gridCellSize={battleMap.gridCellSize}
            />
          ))}
        </Layer>
        <Layer id="drawings"></Layer>
      </Stage>
      <HStack position="absolute" top={1} left={3}>
        <Button onClick={onExit} size="sm">
          Back
        </Button>
        <Editable
          defaultValue={battleMap.name}
          placeholder={battleMap.name}
          isDisabled={userRole !== "dm"}
          fontSize={"2xl"}
          fontWeight="semibold"
          onSubmit={updateMapName}
        >
          <EditablePreview />
          <EditableInput />
        </Editable>
        <ButtonGroup size="sm">
          {userRole === "dm" && [
            <Button
              leftIcon={<FaEdit />}
              onClick={() => {
                if (isEditingBG) {
                  setIsEditingBG(false);
                  setSelectedBGImageIndex(null);
                } else {
                  setIsEditingBG(true);
                }
              }}
              colorScheme={isEditingBG ? "pink" : undefined}
              variant={isEditingBG ? "outline" : undefined}
            >
              {isEditingBG ? "Done editing" : "Edit"} background
            </Button>,
            isEditingBG && (
              <Tooltip label="Add background image">
                <IconButton
                  icon={<FaFileUpload />}
                  aria-label={"add background image"}
                  colorScheme="green"
                  isLoading={isUploadingBGImage}
                  onClick={() => uploadBGImageInputRef.current?.click()}
                />
              </Tooltip>
            ),
            isEditingBG && (
              <Button leftIcon={<FaChessBoard />} colorScheme="teal">
                Edit grid
              </Button>
            ),
            <input
              type="file"
              style={{ display: "none" }}
              accept=".png,.jpg"
              ref={uploadBGImageInputRef}
              onChange={handleBGImageUpload}
            />,
            isEditingBG && selectedBGImageIndex !== null && (
              <Menu>
                <MenuButton as={Button} rightIcon={<FaImage />}>
                  Edit image
                </MenuButton>
                <MenuList>
                  <MenuItem disabled>Reset size</MenuItem>
                  <MenuItem disabled>Reset rotation</MenuItem>
                  <MenuItem
                    icon={<FaTrashAlt />}
                    onClick={() => deleteBackgroundImage(selectedBGImageIndex)}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            ),
            !isEditingBG && (
              <Menu>
                <MenuButton as={Button} rightIcon={<FaImage />}>
                  Add token
                </MenuButton>
                <MenuList>
                  <MenuItem disabled>Add Character</MenuItem>
                  <MenuItem disabled>Add NPC</MenuItem>
                  <MenuItem disabled>Add Creature</MenuItem>
                </MenuList>
              </Menu>
            ),
          ]}
        </ButtonGroup>
      </HStack>
    </>
  );
}
