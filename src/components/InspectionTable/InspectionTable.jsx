import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./InspectionTable.css";
import InspectionDetailsModal from "../InspectionDetails/InspectionDetailsModal";

const SOCKET_SERVER = "http://localhost:3000";

const formatCapturedData = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
};

function InspectionTable() {
  const [inspections, setInspections] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [selectedInspectionId, setSelectedInspectionId] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_SERVER, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Frontend Socket.IO connected:", socket.id);
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Frontend Socket.IO disconnected");
      setSocketConnected(false);
    });

    // Must exactly match Node.js:
    // io.emit("inspection_update", testInspection);

    socket.on("inspection_update", (data) => {
      console.log("Inspection received in frontend:", data);

      const inspection = {
        id: data.id || `${Date.now()}-${Math.random()}`,
        dateTime: data.timestamp || new Date().toISOString(),
        siteId: data.site_id || data.siteId || "-",
        sectionId: data.section_id || data.sectionId || "-",
        cameraId: data.camera_id || data.cameraId || "-",
        capturedData:
          data.captured_data ||
          data.detected_text ||
          data.capturedData ||
          "-",
        eventId:
          data.event_id ||
          data.event_type ||
          data.eventId ||
          "-",
        status: data.status || "UNKNOWN",
        evidenceLink:
          data.evidence_link ||
          data.evidenceLink ||
          "",
        comments:
          data.comments ||
          data.message ||
          "-",
        remarks: data.remarks || "-",
      };

      setInspections((previousInspections) => {
        return [
          inspection,
          ...previousInspections,
        ].slice(0, 100);
      });
    });

    return () => {
      socket.off("inspection_update");
      socket.disconnect();
    };
  }, []);

  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return "-";
    }

    const date = new Date(dateTime);

    if (Number.isNaN(date.getTime())) {
      return dateTime;
    }

    return date.toLocaleString();
  };

  return (
    <section className="inspection-section">
      <div className="inspection-header">
        <div>
          <h2>Live Inspection Data</h2>

          <p>
            Real-time inspection events received from the Edge Node
          </p>
        </div>

        <div
          className={
            socketConnected
              ? "socket-status connected"
              : "socket-status disconnected"
          }
        >
          <span className="socket-status-dot" />

          {socketConnected
            ? "LIVE"
            : "DISCONNECTED"}
        </div>
      </div>

      <div className="inspection-table-container">
        <table className="inspection-table">
          <thead>
            <tr>
              <th>Sl. No.</th>
              <th>Date-Time</th>
              <th>Site-Id</th>
              <th>Section-Id</th>
              <th>Camera-Id</th>
              <th>Captured-Data</th>
              <th>Event-Id</th>
              <th>Status</th>
              <th>Evidence-Link</th>
              <th>Comments</th>
              <th>Remarks</th>
            </tr>
          </thead>

          <tbody>
            {inspections.length === 0 ? (
              <tr>
                <td
                  colSpan="11"
                  className="empty-inspection"
                >
                  Waiting for inspection data...
                </td>
              </tr>
            ) : (
              inspections.map((inspection, index) => (
                <tr key={inspection.id} onClick={() => setSelectedInspectionId(inspection.id)} className="inspection-clickable-row">
                  <td>{index + 1}</td>

                  <td>
                    {formatDateTime(
                      inspection.dateTime
                    )}
                  </td>

                  <td>{inspection.siteId}</td>

                  <td>
                    {inspection.sectionId}
                  </td>

                  <td>{inspection.cameraId}</td>

                  <td className="captured-data">
                    {formatCapturedData(inspection.capturedData)}
                  </td>

                  <td>{inspection.eventId}</td>

                  <td>
                    <span
                      className={`inspection-result ${inspection.status.toLowerCase()}`}
                    >
                      {inspection.status}
                    </span>
                  </td>

                  <td>
                    {inspection.evidenceLink ? (
                      <button className="inspection-view-button" type="button">
                        View
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    {inspection.comments}
                  </td>

                  <td>
                    {inspection.remarks}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {selectedInspectionId && (
        <InspectionDetailsModal inspectionId={selectedInspectionId} onClose={() => setSelectedInspectionId(null)} />
      )}
    </section>
  );
}

export default InspectionTable;
