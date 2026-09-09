import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const modules = [
  { title: "Dashboard", icon: "▦", route: "/dashboard", color: "blue", description: "Review inspection performance, matches and operational trends." },
  { title: "Live View", icon: "●", route: "/live-monitoring", color: "green", description: "Monitor all three cameras and incoming inspection events in real time." },
  { title: "Report", icon: "▤", route: "/reports", color: "cyan", description: "Filter, review and export historical inspection evidence." },
];

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="landing">
      <div className="launcher">
        <div className="launcher-title">
          <span className="launcher-eyebrow">OPERATIONS PORTAL</span>
          <h1>Welcome to Industrial Visual AI</h1>
          <p>Gibraltar Air Springs Pvt. Ltd. — choose a workspace to continue.</p>
        </div>
        <div className="launcher-grid">
          {modules.map((item) => (
            <button key={item.title} type="button" className={`launcher-card ${item.color}`} onClick={() => navigate(item.route)}>
              <div className="launcher-icon" aria-hidden="true">{item.icon}</div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <span className="launcher-action">Open workspace <span aria-hidden="true">→</span></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
