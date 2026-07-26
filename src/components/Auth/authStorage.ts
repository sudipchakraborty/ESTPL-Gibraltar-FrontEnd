export function clearAuthentication(): void {
  localStorage.removeItem(
    "accessToken"
  );

  localStorage.removeItem(
    "currentUser"
  );
}