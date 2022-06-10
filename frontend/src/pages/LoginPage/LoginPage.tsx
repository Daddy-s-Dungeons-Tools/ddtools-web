import { Button, Container, Heading, useToast, VStack } from "@chakra-ui/react";
import { Logo } from "components/Logo/Logo";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaGoogle } from "react-icons/fa";
import { auth } from "services/firebase";
import "./LoginPage.css";

const provider = new GoogleAuthProvider();

export default function LoginPage() {
  const [user] = useAuthState(auth);
  const toast = useToast();

  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  /** Login handler that sends sign-in email with Firebase */
  const handleSignIn = async () => {
    if (isSigningIn) {
      return;
    }

    setIsSigningIn(true);

    try {
      await signInWithPopup(auth, provider);

      // Show success message
      toast({
        title: "Signed in!",
        description: <p>Welcome</p>,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);

      // Show error message
      toast({
        title: "Yikes!",
        description: "Something went wrong. Try signing in again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <Container maxW="container.md" className="login-page">
      <VStack spacing="5">
        <Logo width="300px" isOpen={isSigningIn} />

        <Heading textAlign="center">Daddy's Dungeon Tools</Heading>

        <Button
          colorScheme="purple"
          onClick={handleSignIn}
          leftIcon={<FaGoogle />}
          isLoading={isSigningIn}
        >
          Sign in with Google
        </Button>
      </VStack>
    </Container>
  );
}
