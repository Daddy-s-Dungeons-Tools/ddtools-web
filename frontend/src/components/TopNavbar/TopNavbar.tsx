import {
  Flex,
  Box,
  Text,
  Button,
  Spacer,
  Link,
  HStack,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";

import { Link as ReactRouterLink } from "react-router-dom";
import { Logo } from "../Logo/Logo";
import { useState } from "react";

export default function TopNavbar() {
  const [user, isUserLoading] = useAuthState(auth);
  const location = useLocation();
  const navigate = useNavigate();

  const [isLogoOpen, setIsLogoOpen] = useState<boolean>(false);

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
          onClick={() => navigate("/")}
        >
          <Logo isOpen={isLogoOpen} />
          <Text fontSize={"lg"} fontWeight="bold">
            DDTools
          </Text>
        </HStack>
      </Box>
      {!isUserLoading && user && !location.pathname.startsWith("/campaigns/") && (
        <HStack>
          <Link as={ReactRouterLink} to="/profile">
            Profile
          </Link>
          <Link as={ReactRouterLink} to="/campaigns">
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
          <Button colorScheme="teal" onClick={() => auth.signOut()}>
            Sign out
          </Button>
        </>
      ) : (
        location.pathname !== "/" && (
          <>
            <Text display={"block"} mx="2">
              Not signed in
            </Text>
            <Button colorScheme="teal" onClick={() => navigate("/")}>
              Sign in
            </Button>
          </>
        )
      )}
    </Flex>
  );
}
