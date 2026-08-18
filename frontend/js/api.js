// =========================================================
// BIZANALYTICS API CONNECTION
// =========================================================

const API_BASE_URL = "https://python2-nr3e.onrender.com";


// =========================================================
// GENERIC REQUEST
// =========================================================

async function apiRequest(endpoint, options = {}) {

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        }
    );


    let data;

    try {

        data = await response.json();

    }

    catch {

        data = {};

    }


    if (!response.ok) {

        throw new Error(
            data.detail ||
            data.message ||
            `Server error: ${response.status}`
        );

    }


    return data;

}


// =========================================================
// GET DASHBOARD DATA
// =========================================================

async function getDashboardData() {

    return await apiRequest(
        "/dashboard"
    );

}


// =========================================================
// GET PRODUCTS
// =========================================================

async function getProducts() {

    return await apiRequest(
        "/products"
    );

}


// =========================================================
// CREATE SALE
// =========================================================

async function createSale(sale) {

    return await apiRequest(
        "/sales",
        {
            method: "POST",

            body: JSON.stringify(sale)
        }
    );

}


// =========================================================
// CREATE EXPENSE
// =========================================================

async function createExpense(expense) {

    return await apiRequest(
        "/expenses",
        {
            method: "POST",

            body: JSON.stringify(expense)
        }
    );

}


// =========================================================
// TEST API CONNECTION
// =========================================================

async function testAPI() {

    try {

        const response =
            await fetch(API_BASE_URL);

        const data =
            await response.json();

        console.log(
            "BizAnalytics API:",
            data
        );

        return data;

    }

    catch (error) {

        console.error(
            "API connection failed:",
            error
        );

        return null;

    }

}


// =========================================================
// API LOADED
// =========================================================

console.log(
    "BizAnalytics API connected:",
    API_BASE_URL
);
