import { Alert, AlertIcon, Input, Text, useToast } from "@chakra-ui/react";
import { updateProfile } from "firebase/auth";
import { auth } from "../../services/firebase";

type UserNameAlertPropTypes = {
  /** Close handler */
  close: () => void;
};
export default function UserNameAlert({ close }: UserNameAlertPropTypes) {
  const toast = useToast();

  /** Attempt to update the user's displayName and show a success or error toast. */
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();

    /** Entered name from form, trimmed of whitespace */
    const name: string = event.currentTarget.userName.value.trim();

    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        toast({
          title: `Welcome, ${name.split(" ")[0]}!`,
          description: "You successfully set your user name.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: `Yikes, ${name.split(" ")[0]}!`,
          description:
            "There was an issue updating your name. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }

    if (close) {
      close();
    }
  };

  return (
    <Alert
      status="warning"
      textAlign="center"
      flexDirection={{
        base: "column",
        md: "row",
      }}
    >
      <AlertIcon />
      <Text mr="3">
        <strong>We need your name!</strong> Please enter it now.
      </Text>
      <form style={{ flex: 1 }} onSubmit={handleSubmit}>
        <Input placeholder="Real Name" name="userName" required />
      </form>
    </Alert>
  );
}
