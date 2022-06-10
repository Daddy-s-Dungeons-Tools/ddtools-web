import { ComponentMeta, ComponentStory } from "@storybook/react";
import { CampaignBox } from "components/CampaignBox";
import { testCampaign, testCharacter } from "utils/consts";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "DDTools/CampaignBox",
  component: CampaignBox,
} as ComponentMeta<typeof CampaignBox>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CampaignBox> = (args) => (
  <CampaignBox {...args} />
);

export const DM = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
DM.args = {
  as: "dm",
  campaign: testCampaign,
};

export const PlayerNoCharacter = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PlayerNoCharacter.args = {
  as: "player",
  campaign: testCampaign,
};

export const PlayerWithCharacter = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PlayerWithCharacter.args = {
  as: "player",
  campaign: testCampaign,
  character: testCharacter,
};
