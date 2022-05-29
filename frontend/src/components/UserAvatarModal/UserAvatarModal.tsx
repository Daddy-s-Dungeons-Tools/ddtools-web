import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../services/firebase";
import { UserAvatar } from "../UserAvatar";

type UserAvatarModalPropTypes = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Modal that allows the user to view their current avatar image (if set)
 * and upload a new one. Does not currently support cropping or panning the image.
 */
export function UserAvatarModal({ isOpen, onClose }: UserAvatarModalPropTypes) {
  const [user, isUserLoading] = useAuthState(auth);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Avatar</ModalHeader>
        <ModalCloseButton />
        {!isUserLoading && user && (
          <ModalBody>
            <VStack spacing="10">
              <UserAvatar
                size="2xl"
                userId={user.uid}
                userDisplayName={user.displayName}
              />

              <Box>
                <Input type="file" />
              </Box>
            </VStack>
          </ModalBody>
        )}
        <ModalFooter>
          <Button colorScheme="purple" disabled={isUserLoading}>
            Upload
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
