import { useMemo, useState } from "react";

import ReportRepository from "../../repositories/ReportRepository";
import "./ReportPage.css";

const formatStatus = (status) =>
    status === "PASS" ? "Matched" : status === "FAIL" ? "Mismatch" : status;

const formatConfidence = (confidence) => {
    if (confidence === null || confidence === undefined) return "-";

    const value = Number(confidence);
    return Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : "-";
};

function ReportPage() {
    const [period, setPeriod] = useState("all");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [camera, setCamera] = useState("all");
    const [module, setModule] = useState("all");
    const [status, setStatus] = useState("all");
    const [records, setRecords] = useState([]);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const filteredRecords = useMemo(() => {
        const now = new Date();
        let periodStart = null;
        let periodEnd = null;

        if (period === "today") {
            periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            periodEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        } else if (period === "yesterday") {
            periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            periodEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
        } else if (period === "7") {
            periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
            periodEnd = now;
        } else if (period === "30") {
            periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
            periodEnd = now;
        }

        return records.filter((record) => {
            const timestamp = new Date(record.timestamp);
            const matchesPeriod = (!periodStart || timestamp >= periodStart)
                && (!periodEnd || timestamp <= periodEnd);
            const matchesFrom = !fromDate || timestamp >= new Date(`${fromDate}T00:00:00`);
            const matchesTo = !toDate || timestamp <= new Date(`${toDate}T23:59:59`);
            const matchesCamera = camera === "all" || record.camera_id === camera;
            const matchesModule = module === "all" || record.event_type === module;
            const matchesStatus = status === "all" || record.status === status;

            return matchesPeriod && matchesFrom && matchesTo
                && matchesCamera && matchesModule && matchesStatus;
        });
    }, [records, period, fromDate, toDate, camera, module, status]);

    const cameras = [...new Set(records.map((record) => record.camera_id))];
    const modules = [...new Set(records.map((record) => record.event_type).filter(Boolean))];

    async function generateReport() {
        setLoading(true);
        setError("");

        try {
            const response = await ReportRepository.getInspections();
            setRecords(response.data);
            setHasGenerated(true);
        } catch (requestError) {
            console.error("Unable to generate report:", requestError);
            setError("Unable to generate the report.");
            setHasGenerated(false);
        } finally {
            setLoading(false);
        }
    }

    async function exportReport() {
        if (!hasGenerated || filteredRecords.length === 0) return;

        const XLSX = await import("xlsx");
        const rows = filteredRecords.map((record) => ({
            Date: new Date(record.timestamp).toLocaleDateString(),
            Time: new Date(record.timestamp).toLocaleTimeString(),
            Device: record.camera_id,
            Module: record.event_type || "",
            Status: formatStatus(record.status),
            Confidence: formatConfidence(record.confidence),
            Comments: record.comments || "",
            Remarks: record.remarks || "",
            Evidence: record.evidence_link || "",
        }));

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inspections");
        XLSX.writeFile(workbook, `inspection-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
    }

    return (
        <div className="report-page">
            <h2>Inspection Reports</h2>

            <div className="report-filters">
                <select value={period} onChange={(event) => setPeriod(event.target.value)}>
                    <option value="all">All Records</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                </select>

                <input
                    type="date"
                    value={fromDate}
                    onChange={(event) => setFromDate(event.target.value)}
                    aria-label="From date"
                />
                <input
                    type="date"
                    value={toDate}
                    onChange={(event) => setToDate(event.target.value)}
                    aria-label="To date"
                />

                <select value={camera} onChange={(event) => setCamera(event.target.value)}>
                    <option value="all">All Devices</option>
                    {cameras.map((item) => <option key={item}>{item}</option>)}
                </select>

                <select value={module} onChange={(event) => setModule(event.target.value)}>
                    <option value="all">All Modules</option>
                    {modules.map((item) => <option key={item}>{item}</option>)}
                </select>

                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                    <option value="all">All Status</option>
                    <option value="PASS">Matched</option>
                    <option value="FAIL">Mismatch</option>
                </select>

                <button onClick={generateReport} disabled={loading}>
                    {loading ? "Generating..." : "Generate"}
                </button>
                <button
                    onClick={exportReport}
                    disabled={!hasGenerated || filteredRecords.length === 0}
                >
                    Export Excel
                </button>
            </div>

            {error && <p className="report-error" role="alert">{error}</p>}

            {hasGenerated && (
                <div className="report-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Device</th>
                                <th>Module</th>
                                <th>Status</th>
                                <th>Confidence</th>
                                <th>Comments</th>
                                <th>Remarks</th>
                                <th>Evidence</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map((record) => (
                                <tr key={record.id}>
                                    <td>{new Date(record.timestamp).toLocaleDateString()}</td>
                                    <td>{new Date(record.timestamp).toLocaleTimeString()}</td>
                                    <td>{record.camera_id}</td>
                                    <td>{record.event_type || "-"}</td>
                                    <td className={record.status === "PASS" ? "pass" : "fail"}>
                                        {formatStatus(record.status)}
                                    </td>
                                    <td>{formatConfidence(record.confidence)}</td>
                                    <td>{record.comments || "-"}</td>
                                    <td>{record.remarks || "-"}</td>
                                    <td>
                                        {record.evidence_link
                                            ? <a href={record.evidence_link} target="_blank" rel="noreferrer">View</a>
                                            : "-"}
                                    </td>
                                </tr>
                            ))}
                            {filteredRecords.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="report-empty">
                                        No inspection records match the selected filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ReportPage;
