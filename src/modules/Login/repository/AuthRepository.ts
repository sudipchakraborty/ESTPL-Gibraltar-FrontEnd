import api from "../../services/apiService";

class AuthRepository {

    login(data: any) {

        return api.post("/api/auth/login", data);

    }

    register(data: any) {

        return api.post("/api/auth/register", data);

    }

}

export default new AuthRepository();