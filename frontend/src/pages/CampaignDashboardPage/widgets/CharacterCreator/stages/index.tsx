import { ReactNode } from "react";
import { RaceStage } from "./RaceStage";

type CharacterCreatorStage = {
  name: string;
  description: string;
  component: ReactNode;
};
export const stages: CharacterCreatorStage[] = [
  {
    name: "Choose Race",
    description:
      "Choose a race for your character. Your DM(s) have selected the available sources.",
    component: <RaceStage />,
  },
  {
    name: "Choose Class(es)",
    description:
      "Choose one or more classes for your character. Your DM(s) have selected the available sources.",
    component: <p>Coming soon...</p>,
  },
];
