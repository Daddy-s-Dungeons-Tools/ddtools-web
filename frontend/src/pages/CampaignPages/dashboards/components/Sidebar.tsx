import {
  Flex,
  Box,
  VStack,
  Tooltip,
  IconButton,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaUsers } from "react-icons/fa";
import { GiScrollQuill, GiScrollUnfurled } from "react-icons/gi";
import { AudioManager } from "./AudioManager";
import Party from "./Party";

type NavbarItem = {
  label: string;
  ariaLabel: string;
  icon: JSX.Element;
  component: JSX.Element;
};

export function Sidebar() {
  const [activeNavbarItemIndex, setActiveNavbarItemIndex] = useState<
    number | null
  >(null);

  const navbarItems: NavbarItem[] = [
    {
      label: "Notes",
      ariaLabel: "notes",
      icon: <GiScrollQuill />,
      component: <p>Notes</p>,
    },
    {
      label: "Event Log",
      ariaLabel: "event log",
      icon: <GiScrollUnfurled />,
      component: <p>stuff</p>,
    },
    {
      label: "Adventuring Party",
      ariaLabel: "party",
      icon: <FaUsers />,
      component: <Party as="dm" />,
    },
    {
      label: "Audio Manager",
      ariaLabel: "audio manager",
      icon: <FaUsers />,
      component: <AudioManager />,
    },
  ];

  return (
    <Flex align="center">
      <Box
        as="nav"
        p="3"
        bgColor="gray.500"
        borderTopRightRadius="base"
        borderBottomRightRadius="base"
      >
        <VStack>
          {navbarItems.map((item, index) => (
            <Tooltip key={item.label} label={item.label} placement="right">
              <IconButton
                icon={item.icon}
                aria-label={item.ariaLabel}
                onClick={() => setActiveNavbarItemIndex(index)}
              />
            </Tooltip>
          ))}
          {/*<Tooltip label="Party" placement="right">
            <IconButton icon={<FaUsers />} aria-label={"party"} />
          </Tooltip> */}
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
            <DrawerHeader>
              {navbarItems[activeNavbarItemIndex].label}
            </DrawerHeader>

            <DrawerBody>
              {navbarItems[activeNavbarItemIndex].component}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </Flex>
  );
}
