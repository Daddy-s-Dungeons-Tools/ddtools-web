import { Box, Image, Text, IconButton, Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Editable, EditableInput, EditablePreview, EditableTextarea, VStack, Heading, SimpleGrid, Flex } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { FaFlag, FaPlus } from "react-icons/fa";
import { GiPin, GiTreasureMap } from "react-icons/gi";
import { CampaignUserContext } from "../../CampaignDashboardPage";
import { MapPin, Map } from "ddtools-types"
import { firestore } from "../../../../services/firebase";
import { query, collection, orderBy, updateDoc, doc } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { converterFactory } from "../../../../services/converter";

const mapConverter = converterFactory<Map>();

type MapUpdated = Map & {
  imageURL?: string;
};

export function WorldMaps() {
    const { campaign } = useContext(CampaignUserContext);

    const [mapDocs, isMapDocsLoading, mapDocsError] = useCollectionData(
    query(
      collection(firestore, "campaigns", campaign.id, "maps").withConverter(
        mapConverter,
      ),
      
    ),
  );

  useEffect(() => {
    
      console.log({
        mapDocs,
        mapDocsError
    });
    
  }, [mapDocs, mapDocsError]);

    // const [pins, setPins] = useState<MapPin[]>([]);
    const [isPinning, setIsPinning] = useState<boolean>(false);
    const [currentMapID, setCurrentMapID] = useState<Map["id"]|null>(null);
    const currentMap = mapDocs?.find(map=>map.id === currentMapID);

    function placePin(e: React.MouseEvent<HTMLDivElement, MouseEvent>){
      if (isPinning && currentMap){
        const map = document.getElementById('map');
        if (!map) return;
        var rect = map.getBoundingClientRect();
        var x = (1 - ((rect.width - (e.clientX - rect.left -13)) / rect.width)).toFixed(3);
        var y = (1 - ((rect.height - (e.clientY - rect.top -30)) / rect.height)).toFixed(3);
        // console.log("Left: " + x + " Top: " + y);
        const newPin: MapPin = {
          location: {xPercentage: +x, yPercentage: +y}
        };
        
        const newPins = [...currentMap.pins ?? [], newPin];
        updateMap(currentMap.id, {pins:newPins});
        setIsPinning(false);
      }
    } 

    function updateMap(mapID: string, mapUpdates: Partial<Map>){
      updateDoc(doc(collection(firestore, "campaigns", campaign.id, "maps"), mapID), mapUpdates);
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
        {currentMap && 
          
        <>
          <IconButton
              aria-label='Add Landmark'
              onClick={currentMap !== null? () => setIsPinning(!isPinning): undefined}
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
        </>
        }
        </VStack>
        

        {!currentMap?
        (
          <Box>
            <Heading marginBottom={5}>Your Maps</Heading>

            <SimpleGrid columns = {2} spacing={4}>
              <Flex 
                  minW="100%"
                  height={200}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  mb="5"
                />
            {mapDocs?.map((curMap) => (
              <Flex 
                justifyContent="center"
                key={curMap.id} 
                onClick={() => setCurrentMapID(curMap.id)} 
                minW="100%"
                maxH="100%"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                mb="5"
              >
                <Box flex={2} padding={4}>
                  <Heading>{curMap.name || "No name!"}</Heading>
                  <Text>{curMap.description || "No description!"}</Text>
                </Box>

                <Box flex={3} justifyContent="center" backgroundColor={"#1a202c"}>
                  <Image 
                    height={200}
                    src={(curMap as MapUpdated).imageURL || "https://csp-clients.s3.amazonaws.com/easttexasspa/wp-content/uploads/2021/06/no-image-icon-23485.png"}
                    // width={"100%"}
                    object-fit="contain"
                  />
                </Box>
                
              </Flex>

            ))}
            </SimpleGrid>
          </Box>
        
        ) :
        
          <Box position='relative'>
            {currentMap.pins ? currentMap.pins.map((tempPin, index)=> <PinPopover key={index} pin={tempPin} pinKey={index}/>): null}
            <Image 
              id="map"
              onClick={placePin} 
              // src="https://preview.redd.it/6qoafiw0nnvz.png?width=640&crop=smart&auto=webp&s=923f5f6d1ee646f7c5f7f20e7f61cfcf51973bf2"   // Horizontal Map
              // src="https://usercontent.one/wp/www.wistedt.net/wp-content/uploads/2019/12/underdark_concept_web-812x1024.png"             // Vertical Map
              src={(currentMap as MapUpdated).imageURL}
             
              width={'100%'}
              objectFit='contain'
              zIndex={2}
              alt="Your image could not be displayed."
            />
            {/* <Heading marginTop={2} >Poop</Heading>
            <Text marginTop={2} marginBottom={2}>smells bad.</Text> */}
          </Box>
        }
      </Box>
    );



  }