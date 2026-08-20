import { NavLink } from "react-router-dom";
import "./AppNavigation.css";

const navigationItems = [
  { label: "Home", path: "/", icon: "⌂" },
  { label: "Dashboard", path: "/dashboard", icon: "▦" },
  { label: "Live View", path: "/live-monitoring", icon: "●" },
  { label: "Report", path: "/reports", icon: "▤" },
];

function AppNavigation() {
  return (
    <nav className="app-navigation" aria-label="Primary application navigation">
      <div className="app-navigation-inner">
        {navigationItems.map((item) => (
          <NavLink key={item.path} to={item.path} end={item.path === "/"} className={({ isActive }) => `app-navigation-link${isActive ? " active" : ""}`}>
            <span className="app-navigation-icon" aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default AppNavigation;
