import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import CampaignDashboardPage from "./pages/CampaignDashboardPage/CampaignDashboardPage";
import CampaignsPage from "./pages/CampaignsPage/CampaignsPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import "./services/dice";
import "./services/firebase";
import theme from "./services/theme";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<LoginPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="campaigns">
              <Route index element={<CampaignsPage />} />
              <Route path=":campaignId" element={<CampaignDashboardPage />} />
            </Route>
            <Route path="*" element={<p>Page not found!</p>} />
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  </StrictMode>,
);
