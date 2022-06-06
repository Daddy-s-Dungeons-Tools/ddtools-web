import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Campaign } from "ddtools-types";
import { Field, Formik, FormikHelpers } from "formik";
import { useContext } from "react";
import { CampaignAPI } from "../../../../services/api";
import { CampaignUserContext } from "../../CampaignDashboardPage";

type CampaignUpdate = Pick<Campaign, "name" | "description" | "color">;

export function Settings() {
  const { campaign } = useContext(CampaignUserContext);
  const toast = useToast();

  const handleUpdateSettings = async (
    values: CampaignUpdate,
    formikHelpers: FormikHelpers<CampaignUpdate>,
  ) => {
    try {
      await CampaignAPI.updateDetails(campaign.id, values);

      toast({
        title: "Updated!",
        description: "The campaign details have been updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
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
      <Formik
        initialValues={
          {
            name: campaign.name,
            description: campaign.description ?? "",
            color: campaign.color ?? "white",
          } as CampaignUpdate
        }
        onSubmit={handleUpdateSettings}
      >
        {({ handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <VStack spacing="3">
              <FormControl>
                <FormLabel htmlFor="campaignName">Campaign Name</FormLabel>
                <Field
                  id="campaignName"
                  type="text"
                  name="name"
                  as={Input}
                  isReadOnly={isSubmitting}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="campaignDescription">
                  Campaign Description
                </FormLabel>
                <Field
                  as={Textarea}
                  id="campaignDescription"
                  placeholder="Here is a sample placeholder"
                  name="description"
                  height={100}
                  minH={100}
                  maxH={100}
                  isReadOnly={isSubmitting}
                />
              </FormControl>

              <Button type="submit" minW="100%" isLoading={isSubmitting}>
                Update
              </Button>
            </VStack>
          </form>
        )}
      </Formik>
    </Box>
  );
}
