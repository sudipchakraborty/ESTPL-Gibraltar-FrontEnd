export function validateLogin(email: string, password: string) {

    if (!email) return "Email is required";

    if (!password) return "Password is required";

    return null;
}