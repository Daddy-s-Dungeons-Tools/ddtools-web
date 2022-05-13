import React from "react";
import { createRoot } from "react-dom/client";

import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";

// Initializes Firebase and emulators
import "./services/firebase";

import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import CampaignsPage from "./pages/CampaignsPage/CampaignsPage";
import theme from "./services/theme";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";

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
              <Route index element={<CampaignsPage />} />
            </Route>
            <Route path="*" element={<p>Page not found!</p>} />
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  </React.StrictMode>
);
