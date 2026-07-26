const LOGOUT_API_URL =
  "http://localhost:3000/api/sessions/logout";

interface LogoutResponse {
  success: boolean;
  message: string;
}

export async function logoutUser(
  token: string
): Promise<LogoutResponse> {
  const response = await fetch(
    LOGOUT_API_URL,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result: LogoutResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Logout failed."
    );
  }

  return result;
}