import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";

/**
 * Redirects to / if the user is not logged in.
 * Sets the current URL in localStorage so it can be redirected to after login.
 **/
export function useProtectedRoute() {
  const [user, isUserLoading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoading && !user) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/");
    }
  }, [isUserLoading, navigate, user]);
}
