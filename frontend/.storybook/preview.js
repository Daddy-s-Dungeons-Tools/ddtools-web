import { addDecorator } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "../src/services/theme"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

addDecorator((story) => (
  <MemoryRouter initialEntries={["/"]}>
    <ChakraProvider theme={theme}>
      {story()}
    </ChakraProvider>
    </MemoryRouter>
));
