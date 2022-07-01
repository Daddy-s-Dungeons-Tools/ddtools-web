import {
    Popover, PopoverTrigger, PopoverHeader, PopoverContent, PopoverArrow, PopoverCloseButton,
    Portal,
    Tabs, TabList, TabPanels, Tab, TabPanel,
    Button,
    Flex,
} from '@chakra-ui/react';

// Each tab element is a react component, rendered in the popover tab panel
export interface StatTab {
    name: string;
    content: JSX.Element;
}

export type StatPopoverPropTypes = {
    tabs: StatTab[];
    placement?: 'top' | 'bottom' | 'left' | 'right';
}

export default function StatPopover(props: StatPopoverPropTypes) {
    var tabList = props.tabs.map((tab: StatTab) => {
        return (<Tab>{tab.name}</Tab>);
    });

    var tabContent = props.tabs.map((tab: StatTab) => {
        return (<TabPanel>{tab.content}</TabPanel>);
    });


    return (
        <Popover placement={props.placement}>
            <PopoverTrigger>
                <Button bg='lightgray'>+</Button>    
            </PopoverTrigger>
            <Portal>
                <PopoverContent>
                <PopoverCloseButton />
                    <Tabs>
                        <PopoverArrow />
                        <PopoverHeader>
                            <TabList>
                                {tabList}
                            </TabList>
                        </PopoverHeader>
                        
                        <TabPanels>
                            {tabContent}
                        </TabPanels>
                    </Tabs>
                </PopoverContent>
            </Portal>
        </Popover>
    )
}