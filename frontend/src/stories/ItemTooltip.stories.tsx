import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ItemTooltip } from "../components/ItemTooltip/ItemTooltip";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "DDTools/ItemTooltip",
  component: ItemTooltip,
} as ComponentMeta<typeof ItemTooltip>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ItemTooltip> = (args) => (
  <ItemTooltip {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  item: {
    name: "Club of Warning",
    source: "DMG",
    type: "M",
    rarity: "uncommon",
    weight: 2,
    entries: [
      "This magic weapon warns you of danger. While the weapon is on your person, you have advantage on initiative rolls. In addition, you and any of your companions within 30 feet of you can't be surprised, except when {@condition incapacitated} by something other than nonmagical sleep. The weapon magically awakens you and your companions within range if any of you are sleeping naturally when combat begins.",
      {
        name: "THing 2",
        entries: ["asdasdasdasd"],
      },
    ],
    value: 2130,
    page: 213,
    createdAt: new Date(),
    ownerUserId: "sadasd",
    sharedWith: [],
  },
};
