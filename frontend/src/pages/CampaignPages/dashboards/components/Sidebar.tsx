import {
  Tooltip,
  Tabs,
  TabList,
  Tab,
  Icon,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import { useContext } from "react";
import { FaSignOutAlt, FaUsers, FaVolumeUp } from "react-icons/fa";
import {
  GiPerson,
  GiScrollQuill,
  GiScrollUnfurled,
  GiSettingsKnobs,
} from "react-icons/gi";
import { AudioManager } from "./AudioManager";
import { EventLog } from "./EventLog";
import Party from "./Party";
import { Link as ReactRouterLink } from "react-router-dom";
import { CampaignUserContext } from "../../CampaignDashboardPage";
import { IconType } from "react-icons";
import { Campaign } from "ddtools-types";

type NavbarItem = {
  label: string;
  ariaLabel: string;
  icon: IconType;
  component: JSX.Element;
  shownToUserRoles: ("dm" | "player")[];
  shownDuringCampaignMode: Campaign["mode"][];
};

const navbarItems: NavbarItem[] = [
  {
    label: "Notes",
    ariaLabel: "notes",
    icon: GiScrollQuill,
    component: <p>Notes</p>,
    shownToUserRoles: ["dm", "player"],
    shownDuringCampaignMode: ["combat", "out-of-combat"],
  },
  {
    label: "Event Log",
    ariaLabel: "event log",
    icon: GiScrollUnfurled,
    component: <EventLog />,
    shownToUserRoles: ["dm", "player"],
    shownDuringCampaignMode: ["combat", "out-of-combat"],
  },
  {
    label: "NPCs and Creatures",
    ariaLabel: "npcs and creatures",
    icon: GiPerson,
    component: <p>Coming soon...</p>,
    shownToUserRoles: ["dm"],
    shownDuringCampaignMode: ["combat", "out-of-combat"],
  },
  {
    label: "Adventuring Party",
    ariaLabel: "party",
    icon: FaUsers,
    component: <Party />,
    shownToUserRoles: ["dm", "player"],
    shownDuringCampaignMode: ["combat", "out-of-combat"],
  },
  {
    label: "Audio Manager",
    ariaLabel: "audio manager",
    icon: FaVolumeUp,
    component: <AudioManager />,
    shownToUserRoles: ["dm"],
    shownDuringCampaignMode: ["combat", "out-of-combat"],
  },
  {
    label: "Campaign Settings",
    ariaLabel: "campaign settings",
    icon: GiSettingsKnobs,
    component: <p>In progress...</p>,
    shownToUserRoles: ["dm"],
    shownDuringCampaignMode: ["combat", "out-of-combat"],
  },
];

export function Sidebar() {
  // const [activeNavbarItemIndex, setActiveNavbarItemIndex] = useState<
  //   number | null
  // >(null);

  const { campaign, userRole } = useContext(CampaignUserContext);

  const userNavbarItems = navbarItems.filter(
    (navbarItem) =>
      navbarItem.shownToUserRoles.includes(userRole) &&
      navbarItem.shownDuringCampaignMode.includes(campaign.mode),
  );

  return (
    <Tabs orientation="vertical" variant="solid-rounded">
      <TabList>
        {userNavbarItems.map((navbarItem) => (
          <Tooltip
            key={navbarItem.label}
            label={navbarItem.label}
            placement="right"
          >
            <Tab>
              <Icon aria-label={navbarItem.ariaLabel} as={navbarItem.icon} />
            </Tab>
          </Tooltip>
        ))}
      </TabList>
      <TabPanels>
        {userNavbarItems.map((navbarItem) => (
          <TabPanel key={navbarItem.label}>{navbarItem.component}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );

  /*<Flex align="center">
      <Box
        as="nav"
        p="3"
        bgColor="gray.500"
        borderTopRightRadius="base"
        borderBottomRightRadius="base"
      >
        <VStack>
          {navbarItems
            .filter((item) => item.shownToUserRoles.includes(userRole))
            .map((item, index) => (
              <Tooltip key={item.label} label={item.label} placement="right">
                <IconButton
                  icon={item.icon}
                  aria-label={item.ariaLabel}
                  onClick={() => setActiveNavbarItemIndex(index)}
                />
              </Tooltip>
            ))}
          <Tooltip label="Exit to home" placement="right">
            <IconButton
              as={ReactRouterLink}
              icon={<FaSignOutAlt />}
              aria-label="exit"
              colorScheme="pink"
              variant="ghost"
              to={"/"}
            />
          </Tooltip>
        </VStack>
      </Box>
      <Box></Box>

       {activeNavbarItemIndex !== null && navbarItems[activeNavbarItemIndex] && (
        <Drawer
          isOpen={activeNavbarItemIndex !== null}
          placement="left"
          size="md"
          onClose={() => setActiveNavbarItemIndex(null)}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader fontSize="3xl">
              {navbarItems[activeNavbarItemIndex].label}
            </DrawerHeader>

            <DrawerBody>
              {navbarItems[activeNavbarItemIndex].component}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )} 
    </Flex>*/
}
