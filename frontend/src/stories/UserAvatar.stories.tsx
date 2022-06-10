import { ComponentMeta, ComponentStory } from "@storybook/react";
import { UserAvatar } from "components/UserAvatar";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "DDTools/UserAvatar",
  component: UserAvatar,
} as ComponentMeta<typeof UserAvatar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserAvatar> = (args) => (
  <UserAvatar {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  userAs: "player",
  userDisplayName: "Test Player",
  userId: "fakeid",
  playerCharacterName: "Nil Agosto",
};
