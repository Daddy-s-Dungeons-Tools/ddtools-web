import { MemoryRouter } from "react-router";
import theme from "../src/services/theme";

export const decorators = [
  (Story) =><MemoryRouter initialEntries={["/"]}><Story /></MemoryRouter>
]

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  chakra: {
    theme,
  },
};
