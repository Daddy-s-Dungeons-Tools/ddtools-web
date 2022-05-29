import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CampaignPlayerBox } from "../components/CampaignPlayerBox/CampaignPlayerBox";
import { testCampaign, testCharacter } from "../utils/consts";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "DDTools/CampaignPlayerBox",
  component: CampaignPlayerBox,
} as ComponentMeta<typeof CampaignPlayerBox>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CampaignPlayerBox> = (args) => (
  <CampaignPlayerBox {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  character: testCharacter,
  userDisplayName: "Frank Matranga",
};
