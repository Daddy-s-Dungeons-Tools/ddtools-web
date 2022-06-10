import { ComponentMeta, ComponentStory } from "@storybook/react";
import TopNavbar from "components/TopNavbar";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "DDTools/TopNavbar",
  component: TopNavbar,
} as ComponentMeta<typeof TopNavbar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TopNavbar> = (args) => <TopNavbar />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {};
