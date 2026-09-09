import CameraCard from "../Card_Camera/CameraCard";
import InspectionTable from "../InspectionTable/InspectionTable";
import useWebRTC from "../../hooks/useWebRTC";
import "./LiveView.css";

const cameras = [
  { id: "camera-1", name: "OCR Camera" },
  { id: "camera-2", name: "Object Detection Camera 1" },
  { id: "camera-3", name: "Object Detection Camera 2" },
];

const WEBRTC_SERVER = import.meta.env.VITE_WEBRTC_SERVER_URL || `http://${window.location.hostname}:8000`;

function LiveCamera({ camera }) {
  const { stream, status } = useWebRTC(camera.id, WEBRTC_SERVER);
  return <CameraCard cameraName={camera.name} stream={stream} status={status} />;
}

function LiveView() {
  return (
    <main className="live-view-page">
      <header className="live-view-header">
        <div>
          <span className="live-view-eyebrow">REAL-TIME OPERATIONS</span>
          <h1>Three-Camera Live View</h1>
          <p>Low-latency processed RTSP streams delivered through WebRTC.</p>
        </div>
        <span className="live-view-system-status">LIVE MONITORING</span>
      </header>

      <section className="live-view-grid" aria-label="Live camera streams">
        {cameras.map((camera) => (
          <LiveCamera key={camera.id} camera={camera} />
        ))}
      </section>

      <InspectionTable />
    </main>
  );
}

export default LiveView;
