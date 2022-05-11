import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
} from "@chakra-ui/react";
import { Campaign } from "ddtools-types";

type PlayerCampaignInvitesModalPropTypes = {
  isOpen: boolean;
  onClose: () => void;
  campaignInvites: Campaign[];
};
export function PlayerCampaignInvitesModal(
  props: PlayerCampaignInvitesModalPropTypes
) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Your Campaign Invites</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {props.campaignInvites.map((campaign) => (
            <Box key={campaign.id}>{campaign.name}</Box>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
