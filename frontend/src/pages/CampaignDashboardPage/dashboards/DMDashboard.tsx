import { Grid, GridItem } from "@chakra-ui/react";
import { WidgetContainer } from "./components/WidgetContainer";
import {
  audioManagerWidget,
  battleMapsWidget,
  campaignSettingsWidget,
  charactersWidget,
  logWidget,
  manageUsersWidget,
  mapWidget,
  notesWidget,
  npcCreatureWidget,
} from "./components/widgets";

export function DMDashboard() {
  return (
    <Grid
      height="100%"
      templateRows="repeat(3, 1fr)"
      templateColumns="repeat(6, 1fr)"
      gap="3"
    >
      <GridItem rowSpan={2} colSpan={{ base: 6, lg: 2 }}>
        <WidgetContainer
          widgets={[
            notesWidget,
            charactersWidget,
            npcCreatureWidget,
            logWidget,
          ]}
        />
      </GridItem>

      <GridItem rowSpan={3} colSpan={{ base: 6, lg: 4 }}>
        <WidgetContainer widgets={[mapWidget, battleMapsWidget]} />
      </GridItem>

      <GridItem rowSpan={1} colSpan={{ base: 6, lg: 2 }}>
        <WidgetContainer
          widgets={[
            audioManagerWidget,
            manageUsersWidget,
            campaignSettingsWidget,
          ]}
        />
      </GridItem>
    </Grid>
  );
}
