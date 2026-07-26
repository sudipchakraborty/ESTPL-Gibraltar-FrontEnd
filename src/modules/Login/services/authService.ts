import api from "../../../services/apiService";

const registerPath = import.meta.env.VITE_AUTH_REGISTER_PATH || "/api/auth/register";
const loginPath = import.meta.env.VITE_AUTH_LOGIN_PATH || "/api/auth/login";

export interface RegisterUserData {
    name: string;
    company?: string;
    email: string;
    password: string;
}

export async function loginUser(data: {
    email: string;
    password: string;
}) {
    return await api.post(loginPath, data);
}

export async function registerUser(data: RegisterUserData) {
    return await api.post(registerPath, data);
}
