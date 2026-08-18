// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL = "http://127.0.0.1:8000";


// =========================================================
// GENERIC API REQUEST
// =========================================================

async function apiRequest(endpoint, options = {}) {

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        }
    );


    let data = null;

    try {

        data = await response.json();

    } catch {

        data = null;

    }


    if (!response.ok) {

        const errorMessage =
            data?.detail ||
            `Request failed with status ${response.status}`;

        throw new Error(errorMessage);

    }


    return data;
}


// =========================================================
// DASHBOARD
// =========================================================

async function getDashboardData() {

    return await apiRequest(
        "/api/dashboard/summary"
    );

}


// =========================================================
// PRODUCTS
// =========================================================

async function getProducts() {

    return await apiRequest(
        "/api/products/"
    );

}


// =========================================================
// SALES
// =========================================================

async function createSale(sale) {

    return await apiRequest(
        "/api/sales/",
        {
            method: "POST",

            body: JSON.stringify(sale)
        }
    );

}


// =========================================================
// EXPENSES
// =========================================================

async function createExpense(expense) {

    return await apiRequest(
        "/api/expenses/",
        {
            method: "POST",

            body: JSON.stringify(expense)
        }
    );

}


// =========================================================
// GET EXPENSES
// =========================================================

async function getExpenses() {

    return await apiRequest(
        "/api/expenses/"
    );

}