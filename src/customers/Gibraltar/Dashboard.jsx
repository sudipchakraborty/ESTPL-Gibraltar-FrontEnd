import { useEffect, useState } from "react";
import "./Dashboard.css";
import PassFailChart from "../../components/charts/PassFailChart/PassFailChart";
import DashboardRepository from "../../repositories/DashboardRepository";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    plant: "Gibraltar Air Spring",
    section: "Assembly Line - 01",
    totalInspection: 0,
    pass: 0,
    fail: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const response = await DashboardRepository.getDashboard();

        if (isMounted) {
          setDashboard((current) => ({
            ...current,
            ...response.dashboard,
          }));
        }
      } catch (requestError) {
        console.error("Unable to load dashboard:", requestError);

        if (isMounted) {
          setError("Unable to load dashboard data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="dashboard">

      {/* ===========================
            HERO SECTION
      =========================== */}

      <section className="hero">

        <div>

          <h1>{dashboard.plant}</h1>

          <p>{dashboard.section}</p>

          <span>
            AI Powered Industrial Inspection Platform
          </span>

        </div>

      </section>

      {/* ===========================
              KPI SECTION
      =========================== */}

      {loading && <p>Loading dashboard data...</p>}
      {error && <p role="alert">{error}</p>}

      <section className="kpiGrid">
        <div className="kpiCard">

          <h2>{dashboard.totalInspection}</h2>

          <p>Total Inspection</p>

        </div>

        <div className="kpiCard success">

          <h2>{dashboard.pass}</h2>

          <p>Matched</p>

        </div>

        <div className="kpiCard danger">

          <h2>{dashboard.fail}</h2>

          <p>Mismatch</p>

        </div>

      </section>

      {/* ===========================
            CHART PLACEHOLDER
      =========================== */}

      <section className="chartGrid">

        <PassFailChart
          data={[
            { name: "Matched", value: dashboard.pass },
            { name: "Mismatch", value: dashboard.fail },
          ]}
        />

      </section>

    </div>
  );
}

export default Dashboard;





// function Dashboard() {
//   return (
//     <div
//       style={{
//         background: "yellow",
//         color: "red",
//         padding: "50px",
//         fontSize: "40px",
//       }}
//     >
//       Dashboard Working
//     </div>
//   );
// }

// export default Dashboard;
