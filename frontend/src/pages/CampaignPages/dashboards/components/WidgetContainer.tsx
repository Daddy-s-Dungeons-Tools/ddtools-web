import {
  Tooltip,
  Tabs,
  TabList,
  Tab,
  Icon,
  TabPanel,
  TabPanels,
  TabsProps,
  PlacementWithLogical,
} from "@chakra-ui/react";
import { useContext } from "react";
import { CampaignUserContext } from "../../CampaignDashboardPage";
import { Widget } from "./widgets";

type WidgetContainerPropTypes = {
  widgets: Widget[];
  tooltipPlacement?: PlacementWithLogical;
} & Omit<TabsProps, "children">;
export function WidgetContainer({
  widgets,
  tooltipPlacement = "right",
  ...props
}: WidgetContainerPropTypes) {
  const { campaign, userRole } = useContext(CampaignUserContext);

  const userWidgets = widgets.filter(
    (widget) =>
      widget.shownToUserRoles.includes(userRole) &&
      widget.shownDuringCampaignMode.includes(campaign.mode),
  );

  return (
    <Tabs
      w={props.w ?? "100%"}
      h={props.h ?? "100%"}
      borderWidth={props.borderWidth ?? "1px"}
      p={props.padding ?? "3"}
      borderRadius={props.borderRadius ?? "lg"}
      variant={props.variant ?? "solid-rounded"}
      bgColor="gray.700"
      {...props}
    >
      <TabList>
        {userWidgets.map((widget) => (
          <Tooltip
            key={widget.label}
            label={widget.label}
            placement={tooltipPlacement}
          >
            <Tab>
              <Icon aria-label={widget.ariaLabel} as={widget.icon} />
            </Tab>
          </Tooltip>
        ))}
      </TabList>
      <TabPanels h="90%" overflow="auto">
        {userWidgets.map((widget) => (
          <TabPanel key={widget.label}>{widget.component}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
