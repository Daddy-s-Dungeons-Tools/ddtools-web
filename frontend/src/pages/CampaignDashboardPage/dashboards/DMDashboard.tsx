import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Show,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  audioManagerWidget,
  battleMapsWidget,
  campaignSettingsWidget,
  charactersWidget,
  compendiumWidget,
  logWidget,
  manageUsersWidget,
  mapWidget,
  notesWidget,
  npcCreatureWidget,
  Widget,
} from "../widgets";
import { WidgetContainer } from "../widgets/WidgetContainer";

export function DMDashboard() {
  // Only for sidebar on mobile
  const [sidebarWidget, setSidebarWidget] = useState<Widget | null>(null);
  return (
    <>
      {/* Desktop view */}
      <Show above="lg">
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
                compendiumWidget,
                campaignSettingsWidget,
              ]}
            />
          </GridItem>
        </Grid>
      </Show>

      {/* Mobile view */}
      <Show below="lg">
        <>
          {sidebarWidget && (
            <Drawer
              isOpen
              placement="bottom"
              onClose={() => setSidebarWidget(null)}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>{sidebarWidget.label}</DrawerHeader>

                <DrawerBody>{sidebarWidget.component}</DrawerBody>
              </DrawerContent>
            </Drawer>
          )}
          <VStack h="80vh">
            <HStack>
              {[
                notesWidget,
                charactersWidget,
                npcCreatureWidget,
                logWidget,
                audioManagerWidget,
                manageUsersWidget,
                campaignSettingsWidget,
              ].map((widget) => (
                <IconButton
                  key={widget.label}
                  aria-label={widget.ariaLabel}
                  icon={<Icon as={widget.icon} />}
                  onClick={() => setSidebarWidget(widget)}
                />
              ))}
            </HStack>
            <WidgetContainer flex="1" widgets={[mapWidget, battleMapsWidget]} />
          </VStack>
        </>
      </Show>
    </>
  );
}
