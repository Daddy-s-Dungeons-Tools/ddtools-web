import React from "react";
import { createRoot } from "react-dom/client";

import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";

// Initializes Firebase and emulators
import "./services/firebase";

import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<p>Home</p>} />
            <Route path="*" element={<p>Page not found!</p>} />
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  </React.StrictMode>
);
