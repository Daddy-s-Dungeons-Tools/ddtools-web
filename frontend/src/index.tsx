import React from "react";
import { createRoot } from "react-dom/client";

import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";

// Initializes Firebase and emulators
import "./services/firebase";
import "./services/dice";

import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import CampaignIndexPage from "./pages/CampaignPages/CampaignIndexPage";
import theme from "./services/theme";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import CampaignDashboardPage from "./pages/CampaignPages/CampaignDashboardPage";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<LoginPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="campaigns">
              <Route index element={<CampaignIndexPage />} />
              <Route path=":campaignId" element={<CampaignDashboardPage />} />
            </Route>
            <Route path="*" element={<p>Page not found!</p>} />
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  </React.StrictMode>,
);
