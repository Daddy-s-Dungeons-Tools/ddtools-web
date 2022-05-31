import { Grid, GridItem } from "@chakra-ui/react";
import { Sidebar } from "./components/Sidebar";
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
      <GridItem rowSpan={3} colSpan={{ base: 6, lg: 2 }}>
        {/* <Button
          w="100%"
          size="lg"
          colorScheme="cyan"
          mb="10"
          leftIcon={<GiBattleGear />}
          rightIcon={<GiBattleGear />}
        >
          ACTIVATE BATTLE MODE
        </Button> */}
        <Sidebar />
      </GridItem>
      <GridItem rowSpan={2} colSpan={{ base: 6, lg: 4 }} bg="papayawhip" />
      <GridItem colSpan={{ base: 6, lg: 4 }} bg="tomato" />
    </Grid>
  );
}
