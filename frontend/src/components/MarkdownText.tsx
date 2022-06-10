import { Box, Code } from "@chakra-ui/react";
import { SpecialComponents } from "react-markdown/lib/ast-to-react";
import { NormalComponents } from "react-markdown/lib/complex-types";
import {
  ReactMarkdown,
  ReactMarkdownOptions,
} from "react-markdown/lib/react-markdown";

const components: Partial<
  Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents
> = {
  code: ({ node, inline, ...props }) => <Code {...props} />,
};

export function MarkdownText({ ...props }: ReactMarkdownOptions) {
  return (
    <Box minW="100%">
      <ReactMarkdown components={components} {...props} />
    </Box>
  );
}
