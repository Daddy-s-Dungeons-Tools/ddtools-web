import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  VStack,
} from "@chakra-ui/react";
import { BattleMap } from "ddtools-types";
import { Formik } from "formik";
import { FaChessBoard } from "react-icons/fa";
import { FirestoreDoc } from "services/converter";

type MapGrid = Pick<
  BattleMap,
  "gridCellSize" | "gridTotalHeight" | "gridTotalWidth"
>;

type EditGridPopoverPropTypes = {
  map: BattleMap & FirestoreDoc;
  handleMapUpdate: (updates: MapGrid) => void;
};
export function EditGridPopover({
  map,
  handleMapUpdate,
}: EditGridPopoverPropTypes) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button leftIcon={<FaChessBoard />} colorScheme="teal">
          Edit grid
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Formik
            initialValues={{
              gridCellSize: map.gridCellSize,
              gridTotalHeight: map.gridTotalHeight,
              gridTotalWidth: map.gridTotalWidth,
            }}
            onSubmit={handleMapUpdate}
          >
            {({ values, handleSubmit, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <VStack>
                  <FormControl>
                    <FormLabel htmlFor="gridCellSize">Cell Size</FormLabel>
                    <NumberInput
                      id="gridCellSize"
                      defaultValue={map.gridCellSize}
                      min={25}
                      max={500}
                      step={5}
                      onChange={(str, cellSize) => {
                        setFieldValue("gridCellSize", cellSize);
                        // Clamp width and height now to a multiple of cell size
                        setFieldValue(
                          "gridTotalWidth",
                          cellSize *
                            Math.ceil(values.gridTotalWidth / cellSize),
                        );
                        setFieldValue(
                          "gridTotalHeight",
                          cellSize *
                            Math.ceil(values.gridTotalHeight / cellSize),
                        );
                      }}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <HStack>
                    <FormControl>
                      <FormLabel htmlFor="gridTotalWidth">Grid Width</FormLabel>
                      <NumberInput
                        id="gridTotalWidth"
                        defaultValue={map.gridCellSize}
                        min={values.gridCellSize}
                        max={500 * values.gridCellSize}
                        step={values.gridCellSize}
                        onChange={(str, num) =>
                          setFieldValue("gridTotalWidth", num)
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    <FormControl>
                      <FormLabel htmlFor="gridTotalHeight">
                        Grid Height
                      </FormLabel>
                      <NumberInput
                        id="gridTotalHeight"
                        defaultValue={map.gridTotalHeight}
                        min={values.gridCellSize}
                        max={500 * values.gridCellSize}
                        step={values.gridCellSize}
                        onChange={(str, num) =>
                          setFieldValue("gridTotalHeight", num)
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </HStack>
                  <Button type="submit" colorScheme="purple">
                    Update Grid
                  </Button>
                </VStack>
              </form>
            )}
          </Formik>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
