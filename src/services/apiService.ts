// ==========================================================
// Industrial Visual AI Platform
// Generic REST API Service
// ==========================================================

// In development, Vite proxies /api requests to the backend. Production can
// either serve both applications from one origin or set VITE_API_BASE_URL.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

class ApiService {

    // ======================================================
    // COMMON REQUEST
    // ======================================================

    private async request(
        endpoint: string,
        options: RequestInit = {}
    ) {

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {})
                },
                // The API currently uses wildcard CORS and does not use cookies.
                // Including credentials would make browsers reject its response.
                credentials: "same-origin",
                ...options
            }
        );

        const contentType = response.headers.get("content-type") || "";
        const isJsonResponse = contentType.includes("application/json");
        const responseBody = isJsonResponse ? await response.json() : await response.text();

        if (!response.ok) {
            const details = typeof responseBody === "string"
                ? responseBody
                : JSON.stringify(responseBody);

            throw new Error(
                `API Error: ${response.status} ${response.statusText}${details ? ` - ${details}` : ""}`
            );
        }

        return responseBody;

    }

    // ======================================================
    // GET
    // ======================================================

    async get(endpoint: string) {

        return await this.request(
            endpoint,
            {
                method: "GET"
            }
        );

    }

    // ======================================================
    // POST
    // ======================================================

    async post(
        endpoint: string,
        data: any = {}
    ) {

        return await this.request(
            endpoint,
            {
                method: "POST",
                body: JSON.stringify(data)
            }
        );

    }

    // ======================================================
    // PUT
    // ======================================================

    async put(
        endpoint: string,
        data: any
    ) {

        return await this.request(
            endpoint,
            {
                method: "PUT",
                body: JSON.stringify(data)
            }
        );

    }

    // ======================================================
    // DELETE
    // ======================================================

    async delete(endpoint: string) {

        return await this.request(
            endpoint,
            {
                method: "DELETE"
            }
        );

    }

}

export default new ApiService();
