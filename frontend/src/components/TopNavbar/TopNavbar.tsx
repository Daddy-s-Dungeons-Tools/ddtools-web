import { Flex, Box, Text, Button, Spacer, Link } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";

import { Link as ReactRouterLink } from "react-router-dom";

export default function TopNavbar() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={8}
    >
      <Box mr="10">
        <Text fontSize={"lg"} fontWeight="bold">
          DDTools
        </Text>
      </Box>
      <Link as={ReactRouterLink} to="/campaigns">
        Campaigns
      </Link>

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
        <>
          <Text display={"block"} mx="2">
            Not signed in
          </Text>
          <Button colorScheme="teal" onClick={() => navigate("/")}>
            Sign in
          </Button>
        </>
      )}
    </Flex>
  );
}
