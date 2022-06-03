import { Box, Image, IconButton, Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Editable, EditableInput, EditablePreview, EditableTextarea, VStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { FaFlag } from "react-icons/fa";
import { GiPin, GiTreasureMap } from "react-icons/gi";
import { CampaignUserContext } from "../../CampaignDashboardPage";

interface Point {
  x: number;y: number};

/** individual locations on the map */
interface Pin {
  location: Point;
  name?: string;
  description?: string;
  // imageURL?: string; 
  targetMapID?: string;
};

/**  */
interface Map {
  name?: string;            
  pins?: Pin[];                 
  thumbnailImageID?: string;    
  
};

export function WorldMaps() {
    const { campaign } = useContext(CampaignUserContext);
    const [pins, setPins] = useState<Pin[]>([]);
    const [isPinning, setIsPinning] = useState<boolean>(false);

    function placePin(e: React.MouseEvent<HTMLDivElement, MouseEvent>){
      if (isPinning){
        const map = document.getElementById('map');
        if (!map) return;
        var rect = map.getBoundingClientRect();
        var x = (1 - ((rect.width - (e.clientX - rect.left)) / rect.width)).toFixed(3);
        var y = (1 - ((rect.height - (e.clientY - rect.top)) / rect.height)).toFixed(3);

        // console.log("Left: " + x + " Top: " + y);
        
        const newPin: Pin = {
          // name: "New Pin",
          location: {x: +x, y: +y}
        };
        const newPins = [...pins, newPin];
        setPins(newPins);
        setIsPinning(false);
      }
    } 
    
    
    function PinPopover(props: { pin: Pin, pinKey: number }) {
      const xPercentage = 100*props.pin.location.x;
      const yPercentage = 100*props.pin.location.y;

      return (
        <Popover>
          <PopoverTrigger>
            <IconButton position='absolute' left={xPercentage + "%"} top={yPercentage + "%"} icon={<FaFlag color='red' size='20' />} aria-label={"Pin"}/>
          </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            <Editable defaultValue={props.pin.name ?? "Pin Name"}>
              <EditablePreview />
              <EditableInput />
            </Editable>
          </PopoverHeader>
          <PopoverBody>
            <Editable defaultValue={props.pin.description ?? "Pin Description"}>
              <EditablePreview />
              <EditableTextarea />
            </Editable>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      )
    }

    return (
      <Box>
        <VStack
          zIndex={5}
          position={'absolute'}
          spacing={"0"}
        >
          <IconButton
              aria-label='Add Landmark'
              onClick={() => setIsPinning(!isPinning)}
              icon={<GiPin color={isPinning ? "red": "#63b3ed"}  size={30} />}
              backgroundColor="#1a202c"
              
              padding='2'
              size="lg"
              margin='2'
          />

          <IconButton
              aria-label='Add Landmark'
              onClick={() => {}}
              icon={<GiTreasureMap color={"#63b3ed"}  size={30} />}
              backgroundColor="#1a202c"
              
              padding='2'
              size="lg"
              margin='2'
          />

        </VStack>

        <Box position='relative'>
          { pins.map((tempPin, index)=> <PinPopover key={index} pin={tempPin} pinKey={index}/>)}
          <Image 
            id="map"
            onClick={placePin} 
            // src="https://preview.redd.it/6qoafiw0nnvz.png?width=640&crop=smart&auto=webp&s=923f5f6d1ee646f7c5f7f20e7f61cfcf51973bf2"   // Horizontal Map
            src="https://usercontent.one/wp/www.wistedt.net/wp-content/uploads/2019/12/underdark_concept_web-812x1024.png"             // Vertical Map
            width={'100%'}
            objectFit='contain'
            zIndex={2}
            alt="Your image could not be displayed."
          />

        </Box>
      </Box>
    );
  }