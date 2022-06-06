import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Campaign } from "ddtools-types";
import { Field, Formik, FormikHelpers } from "formik";
import { useContext, useState } from "react";
import { CampaignAPI } from "../../../../services/api";
import { CampaignUserContext } from "../../CampaignDashboardPage";

type CampaignUpdate = Pick<Campaign, "name" | "description" | "color">;

export function Settings() {
  const { campaign } = useContext(CampaignUserContext);

  const handleUpdateSettings = async (
    values: CampaignUpdate,
    formikHelpers: FormikHelpers<CampaignUpdate>,
  ) => {
    try {
      await CampaignAPI.updateDetails(campaign.id, values);
    } catch (error) {
      console.error(error);
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
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <VStack spacing="3">
              <FormControl>
                <FormLabel htmlFor="campaignName">Campaign Name</FormLabel>
                <Field id="campaignName" type="text" name="name" as={Input} />
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
                />
              </FormControl>

              <Button type="submit" minW="100%">
                Update
              </Button>
            </VStack>
          </form>
        )}
      </Formik>
    </Box>
  );
}
