import { useEffect, useState } from "react";

import DashboardRepository
  from "../../repositories/DashboardRepository";

import CameraCard
  from "../../components/Card_Camera/CameraCard";

import "./Dashboard.css";

function Dashboard({
  cameras = [],
}) {

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    async function loadDashboard() {

      try {

        const response =
          await DashboardRepository.getDashboard();

        setDashboard(
          response.dashboard
        );

      }
      catch (err) {

        console.error(err);

        setError(
          "Unable to load dashboard."
        );

      }
      finally {

        setLoading(false);

      }

    }

    loadDashboard();

  }, []);

  return (

    <section className="camera-dashboard-container">

      {/* ===========================
            KPI SECTION
      =========================== */}

      {loading && (

        <div className="dashboard-loading">

          Loading Dashboard...

        </div>

      )}

      {error && (

        <div className="dashboard-error">

          {error}

        </div>

      )}

      {dashboard && (

        <section className="dashboard-summary">

          <div className="summary-card">

            <h2>

              {dashboard.totalInspection}

            </h2>

            <p>Total Inspection</p>

          </div>

          <div className="summary-card pass">

            <h2>

              {dashboard.pass}

            </h2>

            <p>PASS</p>

          </div>

          <div className="summary-card fail">

            <h2>

              {dashboard.fail}

            </h2>

            <p>FAIL</p>

          </div>

          <div className="summary-card confidence">

            <h2>

              {dashboard.confidence} %

            </h2>

            <p>Confidence</p>

          </div>

        </section>

      )}

      {/* ===========================
            CAMERA SECTION
      =========================== */}

      <section className="camera-dashboard">

        {cameras.map((camera) => (

          <CameraCard
            key={camera.id}

            cameraName={
              camera.name
            }

            stream={
              camera.stream
            }

            status={
              camera.status
            }
          />

        ))}

      </section>

    </section>

  );

}

export default Dashboard;