import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Dashboard",
      icon: "📊",
      route: "/dashboard",
      color: "blue",
    },
    {
      title: "Live Monitoring",
      icon: "🎥",
      route: "/live-monitoring",
      color: "green",
    },
    {
      title: "Reports",
      icon: "📄",
      route: "/reports",
      color: "cyan",
    },
  ].filter((item) => item.title !== "Live Monitoring");

  return (
    <div className="landing">

      <div className="launcher">

        <div className="launcher-title">

          <p>
            Gibraltar Air Springs Pvt. Ltd.
          </p>

        </div>

        <div className="launcher-grid">

          {modules.map((item) => (

            <div
              key={item.title}
              className={`launcher-card ${item.color}`}
              onClick={() => navigate(item.route)}
            >

              <div className="launcher-icon">

                {item.icon}

              </div>

              <h2>

                {item.title}

              </h2>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default LandingPage;
