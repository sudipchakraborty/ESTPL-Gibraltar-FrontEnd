import "./Card_Header.css";

import companyLogo2 from "../../assets/CompanyLogo_2.jpeg";
import companyLogo3 from "../../assets/CompanyLogo_3.jpg";

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { menuConfig } from "../../../../config/menuConfig";
import { logoutUser } from "../../../../components/Auth/logoutApi";
import { clearAuthentication } from "../../../../components/Auth/authStorage";
import LoginModal from "../../../../modules/Login/LoginModal";
import { useAuth } from "../../../../modules/Login/hooks/useAuth";

// ==========================================================
// DEMO CONFIGURATION
// ==========================================================

const SHOW_NAVIGATION = false;
const SHOW_LOGIN = true;

// ==========================================================
// HEADER COMPONENT
// ==========================================================

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, login, logout } = useAuth();

  const [showLogin, setShowLogin] = useState(false);

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  const [logoutError, setLogoutError] =
    useState("");

  const handleLogin = () => {
    login();
  };

  const handleLogout = async () => {
    const accessToken =
      localStorage.getItem(
        "accessToken"
      );

    setLogoutError("");
    setIsLoggingOut(true);

    try {
      if (accessToken) {
        await logoutUser(
          accessToken
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Logout failed.";

      console.error(
        "Logout error:",
        message
      );

      setLogoutError(message);
    } finally {
      clearAuthentication();
      logout();
      setShowLogin(false);
      setIsLoggingOut(false);

      navigate("/", {
        replace: true,
      });
    }
  };

  // Go to home page
  const goHome = () => {
    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      navigate("/");
    }
  };

  // Go to contact section
  const goContact = () => {
    if (location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        document
          .getElementById("contact")
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 300);
    } else {
      document
        .getElementById("contact")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }
  };

  return (
    <>
      <header className="header-card">

        {/* LEFT LOGO SECTION */}

        <div className="header-left">
          <img
            src={companyLogo2}
            alt="Technology Partner"
            className="header-logo logo-secondary"
            onClick={goHome}
          />

        </div>

        <div
          className="company-name"
          onClick={goHome}
        >
          Industrial Visual AI Platform
        </div>

        {/* CENTER NAVIGATION */}

        {SHOW_NAVIGATION && (
          <nav className="header-center">
            <button
              className="nav-link"
              onClick={goHome}
            >
              Home
            </button>

            {menuConfig.map((menu) => (
              <div
                key={menu.title}
                className="dropdown"
              >
                <button className="nav-link">
                  {menu.title} ▼
                </button>

                <div className="dropdown-menu">
                  {menu.items.map((item) => (
                    <button
                      key={item.title}
                      className="dropdown-item"
                      onClick={() =>
                        navigate(item.url)
                      }
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              className="nav-link"
              onClick={goContact}
            >
              Contact
            </button>
          </nav>
        )}

        {/* RIGHT LOGO SECTION */}

        <div className="header-right">

          {/* LOGIN BUTTON */}

          {SHOW_LOGIN && (
            <div className="auth-actions">
              {isLoggedIn ? (
                <button
                  type="button"
                  className="logout-button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut
                    ? "Logging Out..."
                    : "Logout"}
                </button>
              ) : (
                <button
                  type="button"
                  className="login-btn"
                  onClick={() =>
                    setShowLogin(true)
                  }
                >
                  Login
                </button>
              )}

              {logoutError && (
                <div
                  className="logout-error"
                  role="alert"
                >
                  {logoutError}
                </div>
              )}
            </div>
          )}

          {/* Show divider only when Login is enabled */}

          {SHOW_LOGIN && (
            <div className="logo-divider" />
          )}

          <img
            src={companyLogo3}
            alt="Gibraltar Airsprings"
            className="header-logo logo-right"
          />
        </div>
      </header>

      {/* LOGIN MODAL */}

      {SHOW_LOGIN && (
        <LoginModal
          open={showLogin}
          onClose={() =>
            setShowLogin(false)
          }
          onLogin={handleLogin}
        />
      )}
    </>
  );
}

export default Header;
