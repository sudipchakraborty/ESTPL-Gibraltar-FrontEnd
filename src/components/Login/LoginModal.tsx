import "./LoginModal.css";
import { useNavigate } from "react-router-dom";
import { signinUser } from "./signinApi";
import { useState } from "react";
import { loginUser, registerUser } from "../../services/authService";

interface Props {
  open: boolean;
  onClose: () => void;
  onLogin?: () => void;
}

function LoginModal({
  open,
  onClose,
  onLogin,
}: Props) {


  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] =
  useState(false);

  const [errorMessage, setErrorMessage] =
  useState("");

  const [showPassword, setShowPassword] =
  useState(false);



  const [mode, setMode] =
    useState<"login" | "signup">(
      "login"
    );

  const [formData, setFormData] =
    useState({
      name: "",
      company: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  setErrorMessage("");

  if (mode === "login") {
    try {
      setIsSubmitting(true);

      const result = await signinUser({
        email: formData.email,
        password: formData.password,
      });

      if (
        result.success &&
        result.data
      ) {
        localStorage.setItem(
          "accessToken",
          result.data.token
        );

        localStorage.setItem(
          "currentUser",
          JSON.stringify(
            result.data.user
          )
        );

        onClose();

        navigate("/dashboard");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign in.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }

    return;
  }

  // Keep your existing signup logic here.
};

  return (

    <div
      className="login-overlay"
      onClick={onClose}
    >

      <div
        className="login-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <h2>

          {
            mode === "login"
              ? "Login"
              : "Create Account"
          }

        </h2>

        <form
          onSubmit={handleSubmit}
        >

          {
            mode === "signup" &&
            (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={
                    formData.company
                  }
                  onChange={
                    handleChange
                  }
                />
              </>
            )
          }

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={
              formData.email
            }
            onChange={
              handleChange
            }
            required
          />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 3l18 18M10.6 10.7a2 2 0 002.7 2.7M9.9 4.2A10.8 10.8 0 0112 4c5.5 0 9 5.2 9 5.2a14.7 14.7 0 01-2.1 2.7M6.6 6.7A15.7 15.7 0 003 9.2s3.5 5.2 9 5.2c1 0 2-.2 2.8-.5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 12s3.5-5.2 9-5.2 9 5.2 9 5.2-3.5 5.2-9 5.2S3 12 3 12z" />
                  <circle cx="12" cy="12" r="2.4" />
                </svg>
              )}
            </button>
          </div>

          {
            mode === "login" &&
            (
              <button
                type="button"
                className="forgot-password-button"
                onClick={() =>
                  alert("Password reset is not available yet. Please contact your administrator.")
                }
              >
                Forgot Password?
              </button>
            )
          }

          {
            mode === "signup" &&
            (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={
                  formData.confirmPassword
                }
                onChange={
                  handleChange
                }
                required
              />
            )
          }

          {errorMessage && (
            <div
              className="login-error"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
          >

            {
              isSubmitting
                ? "Signing In..."
                : mode === "login"
                  ? "Sign In"
                  : "Create Account"
            }

          </button>

        </form>

        <div
          className="login-footer"
        >

          {
            mode === "login"
              ? (
                <>
                  Don't have an
                  account?

                  <span
                    className="auth-link"
                    onClick={() =>
                      setMode(
                        "signup"
                      )
                    }
                  >
                    {" "}
                    Sign Up
                  </span>
                </>
              )
              : (
                <>
                  Already have an
                  account?

                  <span
                    className="auth-link"
                    onClick={() =>
                      setMode(
                        "login"
                      )
                    }
                  >
                    {" "}
                    Sign In
                  </span>
                </>
              )
          }

        </div>

      </div>

    </div>
  );
}

export default LoginModal;

