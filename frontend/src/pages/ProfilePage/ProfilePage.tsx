import {
  Container,
  Heading,
  FormControl,
  Input,
  Button,
  VStack,
  FormLabel,
  useToast,
  ButtonGroup,
} from "@chakra-ui/react";
import { updateProfile } from "firebase/auth";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useProtectedRoute } from "../../hooks/routes";
import { auth } from "../../services/firebase";

export function ProfilePage() {
  useProtectedRoute();

  const [user, isUserLoading, userError] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toast = useToast();

  const handleProfileFormSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const name: string = event.currentTarget.userName.value.trim();

    setIsLoading(true);

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
      }
      toast({
        title: "Updated profile!",
        description:
          "You have successfully updated your profile. Changes will be reflected after a page refresh.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Oopsy!",
        description:
          "Something went wrong when updating your profile. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md">
      <Heading mb="5">Your Profile</Heading>

      <form id="login-form" onSubmit={handleProfileFormSubmit}>
        <VStack align="flex-start">
          <FormControl>
            <FormLabel htmlFor="name">Your Name</FormLabel>

            <Input
              name="userName"
              type="text"
              id="name"
              placeholder="Please enter your real name"
              defaultValue={user?.displayName ?? ""}
              isReadOnly={isLoading}
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="email">Your Email</FormLabel>

            <Input
              name="email"
              type="email"
              id="email"
              value={user?.email ?? ""}
              isReadOnly
            />
          </FormControl>

          <ButtonGroup>
            <Button
              colorScheme="teal"
              type="submit"
              isLoading={isLoading}
              loadingText="Saving..."
            >
              Save
            </Button>
            <Button colorScheme="red" disabled>
              Delete Accont
            </Button>
          </ButtonGroup>
        </VStack>
      </form>
    </Container>
  );
}