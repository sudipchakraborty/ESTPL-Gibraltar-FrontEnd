import api from "../services/apiService";

export interface InspectionRecord {
    id: string;
    timestamp: string;
    camera_id: string;
    event_type: string | null;
    status: string;
    confidence: string | number | null;
    evidence_link: string | null;
    comments: string | null;
    remarks: string | null;
}

interface InspectionResponse {
    success: boolean;
    count: number;
    data: InspectionRecord[];
}

class ReportRepository {
    async getInspections(limit = 5000): Promise<InspectionResponse> {
        return await api.get(`/api/inspections?limit=${limit}`) as InspectionResponse;
    }
}

export default new ReportRepository();
