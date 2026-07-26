import api from "../services/apiService";

class DashboardRepository {

    async getDashboard() {

        return await api.get(
            "/api/dashboard"
        );

    }

}

export default new DashboardRepository();
