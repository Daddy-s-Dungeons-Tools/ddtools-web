import {
  HStack,
  IconButton,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tag,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

type TagAddPopoverPropTypes = {
  suggestedTags: string[];
  onAddTag: (tag: string) => Promise<void> | void;
};

export function TagAddPopover({
  onAddTag,
  suggestedTags,
}: TagAddPopoverPropTypes) {
  const [customTag, setCustomTag] = useState<string>("");

  return (
    <Popover placement="right" closeOnBlur={true}>
      <PopoverTrigger>
        <IconButton size="xs" icon={<FaPlus />} aria-label={""} />
      </PopoverTrigger>
      <PopoverContent p={5}>
        <VStack>
          <HStack>
            {suggestedTags.map((tag) => (
              <Tag key={tag} cursor="pointer" onClick={() => onAddTag(tag)}>
                {tag}
              </Tag>
            ))}
          </HStack>

          <Input
            placeholder="Other"
            size="sm"
            value={customTag}
            onChange={(ev) =>
              setCustomTag(ev.currentTarget.value.trim().toLowerCase())
            }
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.code === "Enter") {
                onAddTag(customTag);
                setCustomTag("");
              }
            }}
            required
          />
        </VStack>
      </PopoverContent>
    </Popover>
  );
}
