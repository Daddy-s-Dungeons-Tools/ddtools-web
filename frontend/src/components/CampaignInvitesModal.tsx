import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { CampaignBox } from "components/CampaignBox";
import { Campaign } from "ddtools-types";
import { FirestoreDoc } from "services/converter";

type CampaignInvitesModalPropTypes = {
  isOpen: boolean;
  as: "player" | "dm";
  onClose: () => void;
  campaignInvites: (Campaign & FirestoreDoc)[];
};
export function CampaignInvitesModal(props: CampaignInvitesModalPropTypes) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Your {props.as === "player" ? "Player" : "DM"} Invites
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {props.campaignInvites.length > 0 ? (
            props.campaignInvites.map((campaign) => (
              <CampaignBox
                key={campaign.id}
                as={props.as}
                campaign={campaign}
                isInvite
              />
            ))
          ) : (
            <Box mb="5">
              You have no pending {props.as === "player" ? "player" : "DM"}{" "}
              campaign invitations.
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
