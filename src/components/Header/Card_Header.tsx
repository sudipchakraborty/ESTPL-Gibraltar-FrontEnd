import "./Card_Header.css";

import companyLogo1 from "../../assets/CompanyLogo_1.jpeg";
import companyLogo2 from "../../assets/CompanyLogo_2.jpeg";
import companyLogo3 from "../../assets/CompanyLogo_3.jpg";

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { menuConfig } from "../../config/menuConfig";
import LoginModal from "../Login/LoginModal";

// ==========================================================
// DEMO CONFIGURATION
// ==========================================================

const SHOW_NAVIGATION = false;
const SHOW_LOGIN = false;

// ==========================================================
// HEADER COMPONENT
// ==========================================================

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogin, setShowLogin] = useState(false);

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
            src={companyLogo1}
            alt="ELVA"
            className="header-logo logo-primary"
            onClick={goHome}
          />

          <div className="logo-divider" />

          <img
            src={companyLogo2}
            alt="Technology Partner"
            className="header-logo logo-secondary"
            onClick={goHome}
          />

          <div
            className="company-name"
            onClick={goHome}
          >
            Visual AI
          </div>
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
            <button
              className="login-btn"
              onClick={() =>
                setShowLogin(true)
              }
            >
              Login
            </button>
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
        />
      )}
    </>
  );
}

export default Header;