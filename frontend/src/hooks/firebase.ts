import { useEffect, useState } from "react";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";

export function useSignInWithEmailLink() {
  const navigate = useNavigate();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // Email should've been stored in localStorage when first entered
      // Ask user for it if not found in localStorage
      const savedEmail =
        window.localStorage.getItem("emailForSignIn") ||
        window.prompt("Please provide your email for confirmation.");

      if (!savedEmail) {
        setError(new Error("No email provided."));
      } else {
        // Attempt to sign-in
        // Will trigger authChanged handlers
        signInWithEmailLink(auth, savedEmail, window.location.href)
          .then((user) => {
            window.localStorage.removeItem("emailForSignIn");
            setError(null);

            // Attempt to redirect to desired page after login
            const redirectAfterLogin =
              window.localStorage.getItem("redirectAfterLogin");

            navigate(
              redirectAfterLogin
                ? redirectAfterLogin
                : { pathname: "/campaigns", search: "" }
            );
            window.localStorage.removeItem("redirectAfterLogin");
          })
          .catch((error) => {
            console.error(error);
            setError(error);
          });
      }
    }
  }, [navigate]);

  return error;
}
