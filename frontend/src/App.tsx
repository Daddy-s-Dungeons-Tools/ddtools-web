import { Box, Center, Container, Spinner } from "@chakra-ui/react";
import { ErrorAlert } from "components/ErrorAlert";
import TopNavbar from "components/TopNavbar";
import UserNameAlert from "components/UserNameAlert";
import CampaignDashboardPage from "pages/CampaignDashboardPage/CampaignDashboardPage";
import CampaignsPage from "pages/CampaignsPage/CampaignsPage";
import LoginPage from "pages/LoginPage/LoginPage";
import { ProfilePage } from "pages/ProfilePage/ProfilePage";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useAuthState } from "react-firebase-hooks/auth";
import { handleError } from "services/errors";
import { auth } from "services/firebase";
import { Redirect, Route, Switch } from "wouter";

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
              {user ? (
                <Switch>
                  <Route path="/">
                    <Redirect to="/campaigns" />
                  </Route>
                  <Route path="/campaigns" component={CampaignsPage} />
                  <Route path="/profile" component={ProfilePage} />
                  <Route
                    path="/campaigns/:campaignId"
                    component={CampaignDashboardPage}
                  />
                  <Route>
                    <p>Page not found!</p>
                  </Route>
                </Switch>
              ) : (
                <LoginPage />
              )}
            </>
          )}
        </Box>
      </ErrorBoundary>

      {/* <BottomFooter /> */}
    </Box>
  );
}

export default App;
