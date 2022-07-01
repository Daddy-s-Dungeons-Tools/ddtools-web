import {
    Button,
    PopoverTrigger,
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Flex,
    Spacer,
    Center,
    Icon,
    Text,
    Box,
    Tabs, TabList, TabPanels, Tab, TabPanel,
    Portal,
} from '@chakra-ui/react';


export interface StatModifier {
    name: string;
    value: number;
    desc?: string;
}

export type ModifierDisplayPropTypes = {
    mods: StatModifier[];
    baseVal?: number;
}


export default function ModifierDisplay(props: ModifierDisplayPropTypes) {
    const mods = props.mods;
    // If there are no modifiers
    if (!mods || mods.length === 0) {
        return (<p>No mods!</p>);
    }
    else {

        // Get computed val
        var computed: number[] = [];
        if (props.baseVal) {
            computed.push(props.baseVal);
            for (var mod of props.mods) {
                computed.push(mod.value);
            }
        }

        // Toggleable accordian list of modifiers
        var modList = mods.map((value: StatModifier) => {
            return (
                <AccordionItem>
                    <AccordionButton>
                        <Flex justify='space-between' width='100%'>
                            <b>{value.value > 0 ? "+" + value.value : value.value}</b>
                            <Spacer />
                            <p>{value.name}</p>
                            <Spacer />
                            {value.desc ? <Icon name='ChevronDownIcon' alignSelf='flex-end' /> : null}
                        </Flex>
                    </AccordionButton>
                    {value.desc ? <AccordionPanel pb={4}>{value.desc}</AccordionPanel>: null}

                </AccordionItem>
            );
        });

        // Visual representation of modifier math
        var tracebackBox = null;
        if (computed) {
            tracebackBox = computed.map((value: number, index: number) => {
                var operation = null;
                if (index !== 0) {
                    // Determine if addition or subtraction
                    if (value > 0) {
                        operation = <Box bg='lightgreen' w='20%' mx={1} borderRadius={5}><Center> + </Center></Box>
                    } else if (value < 0) {
                        operation = <Box bg='pink' w='20%' mx={1} borderRadius={5}><Center> - </Center></Box>
                    }
                    // Create two boxes: one for operation and one for value
                    return (
                        <Flex direction='row' wrap='nowrap' grow={1} shrink={1}>
                            {operation}
                            <Box w='50%' mx={1} borderRadius={5} flex='1' bg={value < 0 ? 'tomato': 'green'}><Center>{Math.abs(value)}</Center></Box>
                        </Flex>
                    );
                } else {
                    return (
                        <Box bg='lightblue' mx={1} borderRadius={5} flex='1'>
                            <b><Center>{value}</Center></b>
                        </Box>
                    );
                }
                
            });
        };
            


        return (
            <div>
                <Flex direction='row' wrap='nowrap' grow={1} shrink={1} justify='space-evenly' mb={2}>
                    {tracebackBox}
                </Flex>
                <PopoverBody>
                    <Accordion allowToggle>
                        {modList}
                    </Accordion>
                </PopoverBody>
            </div>
                                
        );

    }

}