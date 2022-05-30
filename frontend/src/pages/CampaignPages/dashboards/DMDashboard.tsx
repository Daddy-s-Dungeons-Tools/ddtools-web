import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useContext } from "react";
import { CampaignUserContext } from "../CampaignDashboardPage";

export function DMDashboard() {
  const {} = useContext(CampaignUserContext);
  return (
    <>
      <Alert status="warning" mb="3">
        <AlertIcon />
        <AlertTitle>Coming Soon!</AlertTitle>
        <AlertDescription>The DM dashboard is in progress.</AlertDescription>
      </Alert>
      <Grid
        height="100%"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(5, 1fr)"
        gap="3"
      >
        <GridItem rowSpan={2} colSpan={1} bg="tomato" />
        <GridItem colSpan={2} bg="papayawhip" />
        <GridItem colSpan={2} bg="papayawhip" />
        <GridItem colSpan={4} bg="tomato" />
      </Grid>
    </>
  );
}
