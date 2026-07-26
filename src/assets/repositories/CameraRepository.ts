import api from "../services/apiService";

class CameraRepository {

    async getCameras() {

        return await api.get(
            "/api/camera"
        );

    }

}

export default new CameraRepository();