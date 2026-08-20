import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ReportRepository from "../../repositories/ReportRepository";
import "./InspectionDetailsModal.css";

const displayValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
};

const evidenceUrl = (link) => {
  if (!link || /^https?:\/\//i.test(link)) return link;
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  return `${apiBaseUrl}${link.startsWith("/") ? link : `/${link}`}`;
};

function InspectionDetailsModal({ inspectionId, onClose }) {
  const [record, setRecord] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setRecord(null);
    setError("");
    ReportRepository.getInspection(inspectionId)
      .then((response) => active && setRecord(response.data))
      .catch(() => active && setError("Unable to load inspection details."));
    return () => { active = false; };
  }, [inspectionId]);

  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return createPortal(
    <div className="inspection-modal-backdrop" onMouseDown={onClose} role="presentation">
      <section className="inspection-modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="inspection-details-title">
        <header className="inspection-modal-header">
          <h2 id="inspection-details-title">Inspection Evidence</h2>
          <button className="inspection-modal-close" type="button" onClick={onClose} aria-label="Close evidence window">
            <span aria-hidden="true">×</span> Close
          </button>
        </header>
        <div className="inspection-modal-content">
          {error && <p className="inspection-modal-error">{error}</p>}
          {!record && !error && <p>Loading inspection...</p>}
          {record && (
            <>
            {record.evidence_link ? (
              <img className="inspection-evidence-image" src={evidenceUrl(record.evidence_link)} alt={`Evidence for ${record.event_id}`} />
            ) : <div className="inspection-no-evidence">No evidence image available</div>}
            <dl className="inspection-details-grid">
              <div><dt>Date-Time</dt><dd>{new Date(record.timestamp).toLocaleString()}</dd></div>
              <div><dt>Camera</dt><dd>{displayValue(record.camera_id)}</dd></div>
              <div><dt>Event</dt><dd>{displayValue(record.event_id)}</dd></div>
              <div><dt>Status</dt><dd>{displayValue(record.status)}</dd></div>
              <div><dt>Confidence</dt><dd>{displayValue(record.confidence)}</dd></div>
              <div><dt>Captured Data</dt><dd><pre>{displayValue(record.captured_data)}</pre></dd></div>
              <div><dt>Comments</dt><dd>{displayValue(record.comments)}</dd></div>
              <div><dt>Remarks</dt><dd>{displayValue(record.remarks)}</dd></div>
            </dl>
            </>
          )}
        </div>
      </section>
    </div>,
    document.body
  );
}

export default InspectionDetailsModal;
