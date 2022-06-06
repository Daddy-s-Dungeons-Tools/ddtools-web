import { Box, Center, Spinner, Container } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Outlet } from "react-router-dom";
import TopNavbar from "./components/TopNavbar/TopNavbar";
import UserNameAlert from "./components/UserNameAlert/UserNameAlert";
import { auth } from "./services/firebase";
import { ErrorBoundary } from "react-error-boundary";
import { handleError } from "./services/errors";
import { ErrorAlert } from "./components/ErrorAlert/ErrorAlert";

function App() {
  const [user, isUserLoading] = useAuthState(auth);
  const [isUserNameAlertShown, setIsUserNameAlertShown] =
    useState<boolean>(false);

  // Show the user name alert modal when displayName is empty or missing
  useEffect(() => {
    if (user) {
      setIsUserNameAlertShown(!user.displayName);
    } else {
      setIsUserNameAlertShown(false);
    }
  }, [user]);

  return (
    <Box className="App">
      <header>
        <TopNavbar />
      </header>
      <ErrorBoundary
        FallbackComponent={() => (
          <ErrorAlert
            title="Oops!"
            description="A fatal error occured... Please try again later."
          />
        )}
        onError={handleError}
      >
        <Box as="main">
          {isUserLoading ? (
            <Center pos="fixed" top={0} left={0} w={"100%"} h="100vh">
              <Spinner size="xl" />
            </Center>
          ) : (
            <>
              {isUserNameAlertShown && (
                <Container maxW="container.md" mb="8">
                  <UserNameAlert close={() => setIsUserNameAlertShown(false)} />
                </Container>
              )}
              <Outlet />
            </>
          )}
        </Box>
      </ErrorBoundary>

      {/* <BottomFooter /> */}
    </Box>
  );
}

export default App;
