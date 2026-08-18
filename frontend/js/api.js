// API connection to the live Python backend
const API_BASE_URL = "https://python2-nr3e.onrender.com";

// Generic API request helper
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("API request failed:", error);
        throw error;
    }
}

// GET request
async function apiGet(endpoint) {
    return apiRequest(endpoint, {
        method: "GET"
    });
}

// POST request
async function apiPost(endpoint, data = {}) {
    return apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

// PUT request
async function apiPut(endpoint, data = {}) {
    return apiRequest(endpoint, {
        method: "PUT",
        body: JSON.stringify(data)
    });
}

// DELETE request
async function apiDelete(endpoint) {
    return apiRequest(endpoint, {
        method: "DELETE"
    });
}
