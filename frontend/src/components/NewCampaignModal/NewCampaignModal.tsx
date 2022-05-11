import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { addCampaign } from "../../services/api";

type NewCampaignModalPropTypes = {
  isOpen: boolean;
  onClose: () => void;
};
export function NewCampaignModal(props: NewCampaignModalPropTypes) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const handleNewCampaignFormSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }
    setIsLoading(true);

    // Grab the email and trim whitespace
    const campaignName: string = event.currentTarget.campaignName.value.trim();
    const campaignDMInviteEmails: string[] =
      event.currentTarget.campaignDMInviteEmails.value.trim().split(",");

    try {
      await addCampaign(campaignName, campaignDMInviteEmails);

      props.onClose();
      toast({
        title: (
          <span>
            Created campaign <strong>{campaignName}</strong>
          </span>
        ),
        description: (
          <p>
            You have created a new campaign
            {campaignDMInviteEmails.length
              ? ` and have invited ${campaignDMInviteEmails.join(
                  ", "
                )} to co-DM.`
              : "."}
          </p>
        ),
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Yikes!",
        description:
          "Something went wrong when creating the campaign. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Campaign</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleNewCampaignFormSubmit}>
          <ModalBody>
            <FormControl mt={4} isRequired>
              <FormLabel>Campaign Name</FormLabel>
              <Input
                name="campaignName"
                placeholder="Cooky Name Here"
                isReadOnly={isLoading}
                required
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel htmlFor="email">Other DM(s)</FormLabel>
              <Input
                id="email"
                type="email"
                name="campaignDMInviteEmails"
                placeholder="DM email addresses"
                isReadOnly={isLoading}
              />
              <FormHelperText>
                Optional. You can add DMs later as well.
              </FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme={"purple"}
              type="submit"
              isLoading={isLoading}
              loadingText="Creating..."
            >
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
