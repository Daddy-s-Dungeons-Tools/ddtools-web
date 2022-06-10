import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  EditableTextarea,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Campaign } from "ddtools-types";
import { PartialWithFieldValue } from "firebase/firestore";
import { useContext } from "react";
import { CampaignAPI } from "services/api";
import { CampaignUserContext } from "../context";

export function Settings() {
  const { campaign } = useContext(CampaignUserContext);
  const toast = useToast();

  const updateCampaign = async (
    updates: PartialWithFieldValue<
      Pick<Campaign, "name" | "description" | "color">
    >,
  ) => {
    try {
      await CampaignAPI.updateDetails(campaign.id, updates);
    } catch (error) {
      console.error(error);
      toast({
        title: "Yikes!",
        description: "There was an error while saving...",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <VStack>
        <Box minW="100%">
          <Text color="gray.500" fontWeight="semibold">
            Name
          </Text>
          <Editable
            defaultValue={campaign.name}
            placeholder={campaign.name}
            onSubmit={(name) => updateCampaign({ name })}
          >
            <EditablePreview />
            <EditableInput />
          </Editable>
        </Box>

        <Box minW="100%">
          <Text color="gray.500" fontWeight="semibold">
            Description
          </Text>
          <Editable
            defaultValue={campaign.description}
            placeholder={campaign.description || "No description set..."}
            onSubmit={(description) => updateCampaign({ description })}
          >
            <EditablePreview />
            <EditableTextarea />
          </Editable>
        </Box>
      </VStack>
    </Box>
  );
}
