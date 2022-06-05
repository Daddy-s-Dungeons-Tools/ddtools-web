import { Box, Image, Text, IconButton, Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Editable, EditableInput, EditablePreview, EditableTextarea, VStack, Heading } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { FaFlag } from "react-icons/fa";
import { GiPin, GiTreasureMap } from "react-icons/gi";
import { CampaignUserContext } from "../../CampaignDashboardPage";
import { MapPin, Map } from "ddtools-types"
import { firestore } from "../../../../services/firebase";
import { query, collection, orderBy } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { converterFactory } from "../../../../services/converter";

const mapConverter = converterFactory<Map>();

type MapUpdated = Map & {
  imageURL?: string;
  pins?: MapPin[];
};

export function WorldMaps() {
    const { campaign } = useContext(CampaignUserContext);

    const [mapDocs, isMapDocsLoading, mapDocsError] = useCollectionData(
    query(
      collection(firestore, "campaigns", campaign.id, "maps").withConverter(
        mapConverter,
      ),
      orderBy("name"),
    ),
  );

    const [pins, setPins] = useState<MapPin[]>([]);
    const [isPinning, setIsPinning] = useState<boolean>(false);
    const [currentMapID, setCurrentMapID] = useState<Map|null>(null);

    function placePin(e: React.MouseEvent<HTMLDivElement, MouseEvent>){
      if (isPinning){
        const map = document.getElementById('map');
        if (!map) return;
        var rect = map.getBoundingClientRect();
        var x = (1 - ((rect.width - (e.clientX - rect.left)) / rect.width)).toFixed(3);
        var y = (1 - ((rect.height - (e.clientY - rect.top)) / rect.height)).toFixed(3);
        // console.log("Left: " + x + " Top: " + y);
        const newPin: MapPin = {
          // name: "New Pin",
          location: {xPercentage: +x, yPercentage: +y}
        };
        const newPins = [...pins, newPin];
        setPins(newPins);
        setIsPinning(false);
      }
    } 
    
    function PinPopover(props: { pin: MapPin, pinKey: number }) {
      const xPercentage = 100*props.pin.location.xPercentage;
      const yPercentage = 100*props.pin.location.yPercentage;

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
              onClick={currentMapID !== null? () => setIsPinning(!isPinning): undefined}
              icon={<GiPin color={isPinning ? "red": "#63b3ed"}  size={30} />}
              backgroundColor="#1a202c"
              
              padding='2'
              size="lg"
              margin='2'
          />

          <IconButton
              aria-label='Maps Menu'
              onClick={() => {setCurrentMapID(null)}}
              icon={<GiTreasureMap color={"#63b3ed"}  size={30} />}
              backgroundColor="#1a202c"
              
              padding='2'
              size="lg"
              margin='2'
          />

        </VStack>

        {currentMapID === null?
        (
          <Box>
            <Heading onClick={() => console.log(mapDocs)} >Your Maps</Heading>
            {mapDocs?.map((curMap) => (
              <Box onClick={() => setCurrentMapID(curMap)} >
                <Heading>{curMap.name}</Heading>
                <Image src={(curMap as MapUpdated).imageURL}/>
                {/* <Text>{curMap.description}</Text> */}
              </Box>

            ))}
            
          </Box>
        
        ) :
        
        
        
        
        
          <Box position='relative'>
            { pins.map((tempPin, index)=> <PinPopover key={index} pin={tempPin} pinKey={index}/>)}
            <Image 
              id="map"
              onClick={placePin} 
              // src="https://preview.redd.it/6qoafiw0nnvz.png?width=640&crop=smart&auto=webp&s=923f5f6d1ee646f7c5f7f20e7f61cfcf51973bf2"   // Horizontal Map
              // src="https://usercontent.one/wp/www.wistedt.net/wp-content/uploads/2019/12/underdark_concept_web-812x1024.png"             // Vertical Map
              src={(currentMapID as MapUpdated).imageURL}
             
              width={'100%'}
              objectFit='contain'
              zIndex={2}
              alt="Your image could not be displayed."
            />




          </Box>
        }
      </Box>
    );



  }