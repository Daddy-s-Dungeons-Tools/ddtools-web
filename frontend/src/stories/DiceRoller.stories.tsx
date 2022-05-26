import { ComponentStory, ComponentMeta } from "@storybook/react";
import { DiceRoller } from "../components/DiceRoller/DiceRoller";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "DDTools/DiceRoller",
  component: DiceRoller,
} as ComponentMeta<typeof DiceRoller>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DiceRoller> = (args) => <DiceRoller />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {};
