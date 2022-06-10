import { ComponentMeta, ComponentStory } from "@storybook/react";
import UserNameAlert from "../components/UserNameAlert";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "DDTools/UserNameAlert",
  component: UserNameAlert,
} as ComponentMeta<typeof UserNameAlert>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserNameAlert> = (args) => (
  <UserNameAlert {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {};
