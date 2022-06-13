import { Box } from "@chakra-ui/react";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Stage as KonvaStage } from "konva/lib/Stage";
import { useEffect, useMemo, useRef, useState } from "react";
import { Layer, Line, Rect, Stage } from "react-konva";
import { clamp } from "utils";
import { debounce } from "utils/debounce";

/** Size of grid cell in pixels */
const GRID_CELL_SIZE = 50;
const GRID_WIDTH = 1500;
const GRID_HEIGHT = 1000;
const SCALE_BY = 1.2;
const SCALE_MAX = 3;
const SCALE_MIN = 0.5;
const STAGE_DRAG_PADDING = 500;

export function BattleMaps() {
  const boxRef = useRef<HTMLDivElement>(null);
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

  /** Set the stage size to the size of the parent container. */
  function resizeStage() {
    if (!boxRef.current) {
      return;
    }

    const { offsetWidth, offsetHeight } = boxRef.current;

    setStage({
      ...stage,
      width: offsetWidth,
      height: offsetHeight,
    });
  }

  // Resize the stage on first load
  useEffect(() => {
    resizeStage();
  }, [boxRef.current]);

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
      konvaEvent.evt.deltaY < 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;

    newScale = Math.min(Math.max(newScale, SCALE_MIN), SCALE_MAX);
    let newX =
      (curStage.getPointerPosition()!.x / newScale - mousePointTo.x) * newScale;
    let newY =
      (curStage.getPointerPosition()!.y / newScale - mousePointTo.y) * newScale;

    const stageBoundingBox = getStageBoundingBox();

    if (newScale !== oldScale) {
      setStage({
        ...stage,
        scale: clamp(newScale, SCALE_MIN, SCALE_MAX),
        x: clamp(newX, stageBoundingBox[2], stageBoundingBox[0]),
        y: clamp(newY, stageBoundingBox[3], stageBoundingBox[1]),
      });
    }
  }

  /** Update the React state for the stage's position after ending a drag. */
  function handleStageDragEnd(konvaEvent: KonvaEventObject<DragEvent>) {
    setStage({
      ...stage,
      x: konvaEvent.target.x(),
      y: konvaEvent.target.y(),
    });
  }

  /** Limit how far the stage can be dragged. */
  function handleStageDragMove(konvaEvent: KonvaEventObject<DragEvent>) {
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
      x: Math.round(target.x() / GRID_CELL_SIZE) * GRID_CELL_SIZE,
      y: Math.round(target.y() / GRID_CELL_SIZE) * GRID_CELL_SIZE,
      duration: 0.1,
    });
  }

  /** x1,y1, x2,y2 */
  function getStageBoundingBox(): [number, number, number, number] {
    return [STAGE_DRAG_PADDING, STAGE_DRAG_PADDING, -500, -400];
  }

  const gridLines = useMemo(() => {
    return [...Array(GRID_HEIGHT / GRID_CELL_SIZE + 1)]
      .map((_, index) => (
        <Line
          key={"x" + index}
          stroke="black"
          points={[
            0,
            index * GRID_CELL_SIZE,
            GRID_WIDTH,
            index * GRID_CELL_SIZE,
          ]}
        />
      ))
      .concat(
        [...Array(GRID_WIDTH / GRID_CELL_SIZE + 1)].map((_, index) => (
          <Line
            key={"y" + index}
            stroke="black"
            points={[
              index * GRID_CELL_SIZE,
              0,
              index * GRID_CELL_SIZE,
              GRID_HEIGHT,
            ]}
          />
        )),
      );
  }, []);

  return (
    <Box ref={boxRef} minW="100%" minH="100%">
      <Stage
        x={stage.x}
        y={stage.y}
        width={stage.width}
        height={stage.height}
        scaleX={stage.scale}
        scaleY={stage.scale}
        onWheel={handleScrollWheel}
        draggable
        onDragMove={handleStageDragMove}
        onDragEnd={handleStageDragEnd}
      >
        <Layer id="grid" draggable={false} x={0} y={0}>
          {gridLines}
        </Layer>
        <Layer>
          <Rect
            x={GRID_CELL_SIZE}
            y={GRID_CELL_SIZE}
            width={GRID_CELL_SIZE}
            height={GRID_CELL_SIZE}
            fill="red"
            onDragEnd={(e) => {
              e.cancelBubble = true;
              snapToGrid(e.target);
            }}
            draggable
          />
        </Layer>
      </Stage>
    </Box>
  );
}
