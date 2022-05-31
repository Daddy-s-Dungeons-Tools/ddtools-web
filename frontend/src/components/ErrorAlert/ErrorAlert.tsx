import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertProps,
  AlertTitle,
} from "@chakra-ui/react";

/** Wrapper around Chakra UI's Alert with error status.  */
export function ErrorAlert({
  title,
  description,
  ...props
}: { title: string; description: string } & AlertProps) {
  return (
    <Alert status="error" {...props}>
      <AlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
