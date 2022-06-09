import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link as WouterLink, useLocation } from "wouter";
import { auth } from "../../services/firebase";
import { Logo } from "../Logo/Logo";

export default function TopNavbar() {
  const [user, isUserLoading] = useAuthState(auth);
  const [location, setLocation] = useLocation();

  const [isLogoOpen, setIsLogoOpen] = useState<boolean>(false);
  async function handleSignOut() {
    await auth.signOut();
    setLocation("/");
  }

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      p={8}
    >
      <Box mr="5">
        <HStack
          onMouseEnter={() => setIsLogoOpen(true)}
          onMouseLeave={() => setIsLogoOpen(false)}
          cursor="pointer"
          onClick={() => {
            if (location !== "/" && location !== "/campaigns") setLocation("/");
          }}
        >
          <Logo isOpen={isLogoOpen} />
          <Text fontSize={"lg"} fontWeight="bold">
            DDTools
          </Text>
        </HStack>
      </Box>
      {!isUserLoading && user && !location.startsWith("/campaigns/") && (
        <HStack>
          <Link as={WouterLink} href="/profile">
            Profile
          </Link>
          <Link as={WouterLink} href="/campaigns">
            Campaigns
          </Link>
        </HStack>
      )}

      <Spacer />

      {user ? (
        <>
          <Text display="block" mx="2">
            Logged in as <strong>{user.displayName ?? user.email}</strong>
          </Text>
          <Button colorScheme="teal" onClick={handleSignOut}>
            Sign out
          </Button>
        </>
      ) : (
        location !== "/" && (
          <>
            <Text display={"block"} mx="2">
              Not signed in
            </Text>
            <Button colorScheme="teal" onClick={() => setLocation("/")}>
              Sign in
            </Button>
          </>
        )
      )}
    </Flex>
  );
}
