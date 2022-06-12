import { Box } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Layer, Line, Rect, Stage } from "react-konva";
import { debounce } from "utils/debounce";

/** Size of grid cell in pixels */
const GRID_CELL_SIZE = 50;
const GRID_WIDTH = 1000;
const GRID_HEIGHT = 1000;

export function BattleMaps() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [stageDimensions, setStageDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 500,
    height: 500,
  });

  /** Set the stage size to the size of the parent container. */
  function resizeStage() {
    console.log("resizing");
    if (!boxRef.current) {
      return;
    }

    const { offsetWidth, offsetHeight } = boxRef.current;

    setStageDimensions({
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
        width={stageDimensions.width}
        height={stageDimensions.height}
        draggable
      >
        <Layer id="grid" draggable={false} x={0} y={0}>
          {gridLines}
        </Layer>
        <Layer>
          <Rect
            x={20}
            y={50}
            width={100}
            height={100}
            fill="red"
            shadowBlur={10}
          />
        </Layer>
      </Stage>
    </Box>
  );
}
