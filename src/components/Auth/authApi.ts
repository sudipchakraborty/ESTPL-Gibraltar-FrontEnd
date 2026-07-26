const PROFILE_API_URL =
  "http://localhost:3000/api/signin/profile";

export interface AuthenticatedUser {
  userId: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

interface ProfileResponse {
  success: boolean;
  message: string;
  user?: AuthenticatedUser;
}

export async function verifyAccessToken(
  token: string
): Promise<ProfileResponse> {
  const response = await fetch(
    PROFILE_API_URL,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result: ProfileResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Authentication failed."
    );
  }

  return result;
}