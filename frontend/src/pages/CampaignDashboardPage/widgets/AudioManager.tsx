import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Audio } from "ddtools-types";
import {
  collection,
  FirestoreDataConverter,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { ref } from "firebase/storage";
import { useContext, useEffect, useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { FaBroadcastTower, FaPlay, FaRedo } from "react-icons/fa";
// import { addCampaignAudioFiles } from "../../../../services/api";
import { converter, FirestoreDoc } from "services/converter";
import { firestore, storage } from "services/firebase";
import { CampaignUserContext } from "../CampaignDashboardPage";

function AudioBox({ audioDoc }: { audioDoc: Audio & FirestoreDoc }) {
  const [downloadURL, isDownloadURLLoading, downloadURLError] = useDownloadURL(
    ref(storage, audioDoc.filePath),
  );
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startPreview = () => {
    setIsPreviewing(true);
    audioRef.current?.play();
  };
  const stopPreview = () => {
    setIsPreviewing(false);
    audioRef.current?.pause();
    audioRef.current?.load();
  };

  const startBroadcast = () => {
    stopPreview();
    updateDoc(audioDoc.ref, {
      isPlaying: true,
    });
  };

  const stopBroadcast = () => {
    updateDoc(audioDoc.ref, {
      isPlaying: false,
    });
  };
  useEffect(() => {
    if (!audioDoc.isPlaying) {
      stopPreview();
    }
  }, [audioDoc.isPlaying]);

  return (
    <Box
      minW="100%"
      borderWidth="1px"
      borderRadius="lg"
      p="3"
      mb="3"
      borderColor={audioDoc.isPlaying ? "pink" : undefined}
    >
      <VStack>
        <Editable defaultValue={audioDoc.name}>
          <EditablePreview />
          <EditableInput />
        </Editable>

        <audio ref={audioRef} src={downloadURL} loop={audioDoc.isLooped} />
        {isDownloadURLLoading ? (
          <Skeleton height="50px" />
        ) : (
          <ButtonGroup minW="100%" isAttached size="sm" variant="outline">
            {isPreviewing ? (
              <Button
                flex="0.6"
                leftIcon={<FaPlay />}
                onClick={stopPreview}
                disabled={audioDoc.isPlaying}
              >
                Stop preview
              </Button>
            ) : (
              <Button
                flex="0.6"
                leftIcon={<FaPlay />}
                onClick={startPreview}
                disabled={audioDoc.isPlaying}
              >
                Preview
              </Button>
            )}

            {audioDoc.isPlaying ? (
              <Button
                flex="1"
                leftIcon={<FaBroadcastTower />}
                colorScheme="red"
                onClick={stopBroadcast}
              >
                Stop broadcast
              </Button>
            ) : (
              <Button
                flex="1"
                colorScheme="red"
                leftIcon={<FaBroadcastTower />}
                onClick={startBroadcast}
              >
                Broadcast
              </Button>
            )}

            {audioDoc.isLooped ? (
              <Button flex="0.6" leftIcon={<FaRedo />}>
                Looping
              </Button>
            ) : (
              <Button flex="0.6">No Loop</Button>
            )}
          </ButtonGroup>
        )}
        <p>{downloadURLError?.message}</p>
      </VStack>
    </Box>
  );
}

export function AudioManager() {
  const { campaign } = useContext(CampaignUserContext);

  const [audioDocs, isAudioDocsLoading, audioDocsError] = useCollectionData(
    query(
      collection(firestore, "campaigns", campaign.id, "audio").withConverter(
        converter as FirestoreDataConverter<Audio & FirestoreDoc>,
      ),
      orderBy("createdAt", "desc"),
    ),
  );

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    ev,
  ) => {
    const target = ev.currentTarget;
    if (!target.files) return;

    const files = Array.from(target.files);
    // await addCampaignAudioFiles(campaign.id, files);
    target.files = null;
  };

  return (
    <Box>
      <Text mb="5">
        Play audio for the whole adventuring party with the click of a button!
        Previewing will just play the audio for you, while broadcasting will
        play it for everybody currently online.
      </Text>

      <VStack alignItems="flex-start">
        <Heading size="sm">Campaign Audio</Heading>

        {audioDocsError && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Yikes!</AlertTitle>
            <AlertDescription>
              Something went wrong when loading the audio files for this
              campaign...
            </AlertDescription>
          </Alert>
        )}
        <Flex flexDirection="column" minW="100%">
          {!isAudioDocsLoading &&
            audioDocs &&
            audioDocs.map((audioDoc) => (
              <AudioBox key={audioDoc.id} audioDoc={audioDoc} />
            ))}
        </Flex>
      </VStack>
      <Divider my="6" />
      <Box>
        <VStack alignItems="flex-start">
          <Heading size="sm">Upload Audio</Heading>
          <input
            type="file"
            accept=".mp3,.ogg,.m4a"
            onChange={handleFileChange}
            multiple
          />
        </VStack>
      </Box>
    </Box>
  );
}
