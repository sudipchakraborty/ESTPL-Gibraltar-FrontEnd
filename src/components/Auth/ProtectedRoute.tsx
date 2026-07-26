import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import {
  verifyAccessToken,
} from "./authApi";

import "./ProtectedRoute.css";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const [isChecking, setIsChecking] =
    useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  useEffect(() => {
    let componentActive = true;

    async function checkAuthentication() {
      const accessToken =
        localStorage.getItem(
          "accessToken"
        );

      if (!accessToken) {
        if (componentActive) {
          setIsAuthenticated(false);
          setIsChecking(false);
        }

        return;
      }

      try {
        await verifyAccessToken(
          accessToken
        );

        if (componentActive) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error(
          "Authentication verification failed:",
          error
        );

        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "currentUser"
        );

        if (componentActive) {
          setIsAuthenticated(false);
        }
      } finally {
        if (componentActive) {
          setIsChecking(false);
        }
      }
    }

    checkAuthentication();

    return () => {
      componentActive = false;
    };
  }, []);

  if (isChecking) {
    return (
      <div className="auth-checking">
        Verifying authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
