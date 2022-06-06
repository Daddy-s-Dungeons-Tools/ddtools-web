import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useContext } from "react";
import { CampaignUserContext } from "../../CampaignDashboardPage";

export function Setting() {
  const { campaign } = useContext(CampaignUserContext);

  return (
    <Box>
      <VStack>
        <FormControl>
          <FormLabel htmlFor="campaignName">Campaign Name</FormLabel>
          <Input id="campaignName" type="text" />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="campaignDescription">
            Campaign Description
          </FormLabel>
          <Textarea
            id="campaignDescription"
            placeholder="Here is a sample placeholder"
            defaultValue={campaign.description}
            height={100}
            minH={100}
            maxH={100}
          />
        </FormControl>
      </VStack>
    </Box>
  );
}
