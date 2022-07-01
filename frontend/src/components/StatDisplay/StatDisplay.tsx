import {
    Icon,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
    Flex,
} from "@chakra-ui/react";




import {StatModifier} from "./ModifierDisplay";
import StatPopover from "./StatPopover";
import {StatTab} from "./StatPopover";


type StatDisplayPropTypes = {
    statName: string;           // Name of the stat being displayed
    baseValue: any;             // Corresponding value- can be number or string
    statLabel?: string;         // Optional label for statChange (if specified) or just a subtitle (if not)
    statIcon?: typeof Icon;    // Optional icon to display behind element
    popoverTabs?: StatTab[];
    modifiers: StatModifier[];  // modifiers to apply to the stat
}

export default function StatDisplay({
    statName,
    baseValue,
    statLabel,
    statIcon,
    popoverTabs,
    modifiers,
}: StatDisplayPropTypes) {

    var statChange = 0;
    for (var mod of modifiers) {
        statChange += mod.value;
    }
    const newValue = baseValue + statChange;



    return (
        <Stat maxW='200px' border='1px' borderColor='gray.200' p={2}>
            <StatLabel
                fontWeight="semibold"
                textTransform="uppercase"
                color="gray.500"
            >
                {statName}
            </StatLabel>
            <Flex direction="row" justifyContent='space-between'>
                <StatNumber>{newValue}</StatNumber>
                {popoverTabs ? <StatPopover tabs={popoverTabs} placement='right' />: null }
                
            </Flex>
            <StatHelpText>
                { statChange && <StatArrow>{statChange > 0 ? "▲" : "▼"}</StatArrow> }
                {statChange && statChange + " "}
                {statLabel}
            </StatHelpText>
            
        </Stat>
    )
}