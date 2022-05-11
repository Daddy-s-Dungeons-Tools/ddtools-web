import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";

export function useProtectedRoute() {
  const [user, isUserLoading, userError] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoading && !user) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/");
    }
  }, [isUserLoading, navigate, user]);
}
