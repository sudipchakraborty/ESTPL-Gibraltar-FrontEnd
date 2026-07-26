import CameraCard from "../Card_Camera/CameraCard";

import "./CameraDashboard.css";

function CameraDashboard() {
  return (
    <main className="camera-dashboard">

      <div className="camera-dashboard-header">

        <div>
          <h1>
            Industrial Visual AI
          </h1>

          <p>
            Real-time camera monitoring
            and AI inspection
          </p>
        </div>

      </div>

      <section className="camera-grid">

        <CameraCard
          cameraName="Camera 01"
          stream={null}
          status="OFFLINE"
        />

      </section>

    </main>
  );
}

export default CameraDashboard;