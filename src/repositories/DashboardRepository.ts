import api from "../services/apiService";

export interface DashboardSummary {
    totalInspection: number;
    pass: number;
    fail: number;
    confidence: number;
}

interface DashboardResponse {
    success: boolean;
    dashboard: DashboardSummary;
}

class DashboardRepository {
    async getDashboard(): Promise<DashboardResponse> {
        return await api.get("/api/dashboard") as DashboardResponse;
    }
}

export default new DashboardRepository();
