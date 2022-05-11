import { Center, Spinner } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Outlet } from "react-router-dom";
import TopNavbar from "./components/TopNavbar/TopNavbar";
import { auth } from "./services/firebase";

function App() {
  const [user, isUserLoading, userError] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <TopNavbar />
      </header>
      {isUserLoading ? (
        <Center pos={"fixed"} top={0} left={0} w={"100%"} h="100vh">
          <Spinner size={"xl"} />
        </Center>
      ) : (
        <Outlet />
      )}
    </div>
  );
}

export default App;
