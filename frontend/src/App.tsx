import { Outlet } from "react-router-dom";
import { auth } from "./services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Box, Flex, Text } from "@chakra-ui/react";
import { signOut } from "firebase/auth";

function App() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          wrap="wrap"
          w="100%"
          mb={8}
          p={8}
        >
          <Box>
            <Text fontSize={"lg"} fontWeight="bold">
              DDTools
            </Text>
          </Box>

          {user ? (
            <>
              <Text display={"block"} onClick={() => signOut(auth)}>
                Logged in as <strong>{user.displayName ?? user.email}</strong> |
                Sign-out
              </Text>
            </>
          ) : (
            <Text display={"block"}>Not signed in</Text>
          )}
        </Flex>
      </header>
      <Outlet />
    </div>
  );
}

export default App;
