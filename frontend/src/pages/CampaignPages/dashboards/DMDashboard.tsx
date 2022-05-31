import { Grid, GridItem } from "@chakra-ui/react";
// import { useContext } from "react";
// import { CampaignUserContext } from "../CampaignDashboardPage";

export function DMDashboard() {
  // const {} = useContext(CampaignUserContext);
  return (
    <Grid
      height="100%"
      templateRows="repeat(3, 1fr)"
      templateColumns="repeat(6, 1fr)"
      gap="3"
    >
      <GridItem rowSpan={3} colSpan={2} bg="tomato" />
      <GridItem rowSpan={2} colSpan={4} bg="papayawhip" />
      <GridItem colSpan={4} bg="tomato" />
    </Grid>
  );
}
