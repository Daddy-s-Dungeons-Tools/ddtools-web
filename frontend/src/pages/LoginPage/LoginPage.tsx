import {
  Container,
  FormControl,
  Heading,
  Input,
  Image,
  useToast,
  VStack,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useSignInWithEmailLink } from "../../hooks/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

enum SignInLinkStatus {
  SENT,
  NOT_SENT,
  LOADING,
}

export default function LoginPage() {
  const [user, isUserLoading, userError] = useAuthState(auth);
  const toast = useToast();
  const navigate = useNavigate();

  const [signInLinkStatus, setSignInLinkStatus] = useState<SignInLinkStatus>(
    SignInLinkStatus.NOT_SENT
  );

  // Checks if URL is a sign in url (user clicked on sign in link from email and ended up here)
  const signInError = useSignInWithEmailLink();

  useEffect(() => {
    console.log("here");
    if (user) {
      navigate("/campaigns", { replace: true });
    }
  }, [navigate, user]);

  /** Login handler that sends sign-in email with Firebase */
  const handleLoginFormSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    // Prevent form from submitting and refreshing page
    event.preventDefault();

    if (signInLinkStatus !== SignInLinkStatus.NOT_SENT) {
      return;
    }

    // Grab the email and trim whitespace
    const enteredEmail: string = event.currentTarget.email.value.trim();

    setSignInLinkStatus(SignInLinkStatus.LOADING);

    try {
      await sendSignInLinkToEmail(auth, enteredEmail, {
        url: window.location.href,
        handleCodeInApp: true,
      });

      // Store email in localStorage in case we lose it
      window.localStorage.setItem("emailForSignIn", enteredEmail);
      setSignInLinkStatus(SignInLinkStatus.SENT);

      // Show success message
      toast({
        title: "Check your email!",
        description: (
          <p>
            Your sign-in link has been sent to <strong>{enteredEmail}</strong>.
            You can close this tab.
          </p>
        ),
        status: "success",
        duration: null,
        isClosable: false,
      });
    } catch (error) {
      setSignInLinkStatus(SignInLinkStatus.NOT_SENT);
      console.error(error);

      // Show error message
      toast({
        title: "Yikes!",
        description:
          "Your sign-in link failed to send. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md">
      <VStack spacing="5">
        <Image
          src="https://images.squarespace-cdn.com/content/v1/5f8a7f6ce7e6c83bd00002f4/1604782480312-TOREECY0FP29FKHWA9R4/hero_dmgscreen_0.jpg"
          borderRadius={10}
        />

        <Heading>Daddy's Dungeon Tools</Heading>

        <form id="login-form" onSubmit={handleLoginFormSubmit}>
          <FormControl>
            <Input
              name="email"
              type="email"
              id="email"
              placeholder="Please enter your email for a sign-in link"
              required
              isReadOnly={signInLinkStatus !== SignInLinkStatus.NOT_SENT}
            />
          </FormControl>
          <Button
            minW="100%"
            type="submit"
            isLoading={signInLinkStatus === SignInLinkStatus.LOADING}
            loadingText="Sending..."
            disabled={signInLinkStatus === SignInLinkStatus.SENT}
          >
            {signInLinkStatus === SignInLinkStatus.SENT
              ? "Check Your Email"
              : "Send Sign-in Email"}
          </Button>
        </form>
      </VStack>
    </Container>
  );
}
