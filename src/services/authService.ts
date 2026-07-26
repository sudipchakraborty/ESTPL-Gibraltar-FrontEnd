import api from "./apiService";

const registerPath = import.meta.env.VITE_AUTH_REGISTER_PATH || "/api/auth/register";
const loginPath = import.meta.env.VITE_AUTH_LOGIN_PATH || "/api/auth/login";

export interface RegisterUserData {
  name: string;
  company?: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterUserData) => {
  return await api.post(registerPath, data);
};

export const loginUser = async (data: any) => {
  return await api.post(loginPath, data);
};
