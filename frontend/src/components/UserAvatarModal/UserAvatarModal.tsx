import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../services/firebase";

/**
 * Modal that allows the user to view their current avatar image (if set)
 * and upload a new one. Does not currently support cropping or panning the image.
 */
export function UserAvatarModal() {
  const [user, isUserLoading, userError] = useAuthState(auth);

  return (
    <Modal isOpen={true} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Avatar</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* TODO: Display image */}
          {/* TODO: File input for new image */}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="purple">Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
