const SIGNIN_API_URL =
  "http://localhost:3000/api/signin";

export interface SigninRequest {
  email: string;
  password: string;
}

export interface SigninUser {
  id: number;
  fullName: string;
  company: string;
  email: string;
  role: string;
  status: string;
}

export interface SigninResponse {
  success: boolean;
  message: string;

  data?: {
    token: string;
    user: SigninUser;
  };

  errors?: string[];
}

export async function signinUser(
  credentials: SigninRequest
): Promise<SigninResponse> {
  const response = await fetch(
    SIGNIN_API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(credentials),
    }
  );

  const result: SigninResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        result.errors?.join(", ") ||
        "Signin failed."
    );
  }

  return result;
}