import { ComponentStory, ComponentMeta } from "@storybook/react";

import StatDisplay from "../components/StatDisplay/StatDisplay";
import {StatModifier} from "../components/StatDisplay/ModifierDisplay";
import type {ModifierDisplayPropTypes} from "../components/StatDisplay/ModifierDisplay";
import {StatTab} from "../components/StatDisplay/StatPopover";
import ModifierDisplay from "../components/StatDisplay/ModifierDisplay";

export default {
    title: "DDTools/StatDisplay",
    component: StatDisplay,
} as ComponentMeta<typeof StatDisplay>;

const Template: ComponentStory<typeof StatDisplay> = (args) => (
    <StatDisplay {...args} />
);

export const Default = Template.bind({});



const a:StatModifier = {
    name: "Armor",
    value: -1,
    desc: "Chafing armor causes slight damage to your health.",
}

const b:StatModifier = {
    name: "Healthy",
    value: 2,
    desc: "A healthy lifestyle increases your maximum HP!",
}

const c:StatModifier[] = [a, b];


Default.args = {
    statName: "HP",
    baseValue: 10,
    statLabel: "Hit Points",
    modifiers: c,
    popoverTabs: [
        {
            name: "Info",
            content: <p>Eat my shorts</p>
        },
        {
            name: "Modifiers",
            content:  <ModifierDisplay mods={c} baseVal={10} />
        }
]
};
 