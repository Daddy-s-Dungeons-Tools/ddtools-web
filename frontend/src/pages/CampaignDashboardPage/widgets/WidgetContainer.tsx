import {
  ButtonGroup,
  Icon,
  IconButton,
  PlacementWithLogical,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  TabsProps,
  Tooltip,
} from "@chakra-ui/react";
import { ErrorAlert } from "components/ErrorAlert";
import { useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FaCompressAlt, FaExpand } from "react-icons/fa";
import { handleError } from "services/errors";
import { CampaignUserContext } from "../context";
import { Widget } from "./index";

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
      position="relative"
      {...props}
    >
      <ButtonGroup size="xs" position="absolute" right={1} top={1} spacing={1}>
        <IconButton
          icon={<Icon as={FaCompressAlt} />}
          aria-label={"Minimize"}
          size="xs"
        />
        <IconButton
          icon={<Icon as={FaExpand} />}
          aria-label={"Maximize"}
          size="xs"
        />
      </ButtonGroup>
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
      <TabPanels h="93%" overflow="auto">
        {userWidgets.map((widget) => (
          <TabPanel key={widget.label} h="100%" minW="100%">
            <ErrorBoundary
              FallbackComponent={() => (
                <ErrorAlert description="A fatal error occured... Please try again later." />
              )}
              onError={handleError}
            >
              {widget.component}
            </ErrorBoundary>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
