import { Character } from "ddtools-types";
import { ref } from "firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { Image } from "react-konva";
import { storage } from "services/firebase";
import useImage from "use-image";

type CharacterTokenPropTypes = {
  userId: string;
  character: Character;
};

export function CharacterToken({ userId, character }: CharacterTokenPropTypes) {
  const [downloadURL] = useDownloadURL(
    ref(storage, "/characters/avatars/" + userId + ".png"),
  );
  const [image, imageStatus] = useImage(downloadURL!);

  return <Image image={image} />;
}
