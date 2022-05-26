import {
  Box,
  Button,
  ButtonGroup,
  Skeleton,
  Stack,
  Text,
  Badge,
} from "@chakra-ui/react";
import { Audio } from "ddtools-types";
import { collection, updateDoc } from "firebase/firestore";
import { ref } from "firebase/storage";
import { useContext, useEffect, useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { FaBroadcastTower, FaPlay, FaRedo } from "react-icons/fa";
import { addCampaignAudioFiles } from "../../../../services/api";
import { audioConverter } from "../../../../services/converter";
import { firestore, storage } from "../../../../services/firebase";
import { CampaignContext } from "../../CampaignDashboardPage";

function AudioBox({ audioDoc }: { audioDoc: Audio }) {
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
    <Box>
      <Text>
        {audioDoc.name}{" "}
        {audioDoc.isPlaying && <Badge colorScheme="pink">LIVE</Badge>}
      </Text>
      <audio ref={audioRef} src={downloadURL} loop={audioDoc.isLooped} />
      {isDownloadURLLoading ? (
        <Skeleton height="50px" />
      ) : (
        <ButtonGroup isAttached size="sm" variant="outline">
          {isPreviewing ? (
            <Button
              leftIcon={<FaPlay />}
              onClick={stopPreview}
              disabled={audioDoc.isPlaying}
            >
              Stop preview
            </Button>
          ) : (
            <Button
              leftIcon={<FaPlay />}
              onClick={startPreview}
              disabled={audioDoc.isPlaying}
            >
              Preview
            </Button>
          )}

          {audioDoc.isPlaying ? (
            <Button
              leftIcon={<FaBroadcastTower />}
              colorScheme="red"
              onClick={stopBroadcast}
            >
              Stop broadcast
            </Button>
          ) : (
            <Button
              colorScheme="red"
              leftIcon={<FaBroadcastTower />}
              onClick={startBroadcast}
            >
              Broadcast
            </Button>
          )}

          {audioDoc.isLooped ? (
            <Button leftIcon={<FaRedo />}>Looping</Button>
          ) : (
            <Button>No Loop</Button>
          )}
        </ButtonGroup>
      )}
      <p>{downloadURLError?.message}</p>
    </Box>
  );
}

export function AudioManager() {
  const campaign = useContext(CampaignContext);

  const [audioDocs, isAudioDocsLoading, audioDocsError] = useCollectionData(
    collection(firestore, "campaigns", campaign.id, "audio").withConverter(
      audioConverter,
    ),
  );

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    ev,
  ) => {
    const target = ev.currentTarget;
    if (!target.files) return;

    const files = Array.from(target.files);
    await addCampaignAudioFiles(campaign.id, files);
    target.files = null;
  };

  return (
    <Box>
      <Stack>
        {!isAudioDocsLoading &&
          audioDocs &&
          audioDocs.map((audioDoc) => (
            <AudioBox key={audioDoc.id} audioDoc={audioDoc} />
          ))}
      </Stack>
      <input
        type="file"
        accept=".mp3,.ogg,.m4a"
        onChange={handleFileChange}
        multiple
      />
    </Box>
  );
}
