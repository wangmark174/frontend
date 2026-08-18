// =========================================================
// BIZANALYTICS - CHARTS.JS
// =========================================================

let salesChartInstance = null;
let expenseChartInstance = null;


// =========================================================
// START CHARTS
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("BizAnalytics charts.js started.");

    initializeCharts();

});


// =========================================================
// INITIALIZE CHARTS
// =========================================================

async function initializeCharts() {

    // Make sure Chart.js has loaded
    if (typeof Chart === "undefined") {

        console.error(
            "Chart.js has not loaded."
        );

        return;

    }

    console.log(
        "Chart.js detected:",
        Chart.version
    );


    await loadSalesChart();

    await loadExpenseChart();

}


// =========================================================
// SALES CHART
// =========================================================

async function loadSalesChart() {

    const canvas =
        document.getElementById("salesChart");

    if (!canvas) {

        console.error(
            "salesChart canvas not found."
        );

        return;

    }


    try {

        const data =
            await apiRequest(
                "/api/dashboard/sales-chart"
            );


        console.log(
            "Sales chart data:",
            data
        );


        let labels = [];
        let values = [];


        // Support different backend response formats

        if (Array.isArray(data)) {

            labels =
                data.map(item =>
                    item.date ||
                    item.label ||
                    item.day ||
                    ""
                );

            values =
                data.map(item =>
                    Number(
                        item.amount ||
                        item.total ||
                        item.sales ||
                        0
                    )
                );

        }

        else if (data && Array.isArray(data.labels)) {

            labels = data.labels;

            values =
                data.values ||
                data.data ||
                [];

        }


        // If backend has no chart endpoint/data,
        // display an empty chart instead of crashing.

        if (!labels.length) {

            labels = [
                "No data"
            ];

            values = [
                0
            ];

        }


        if (salesChartInstance) {

            salesChartInstance.destroy();

        }


        salesChartInstance =
            new Chart(
                canvas,
                {
                    type: "line",

                    data: {

                        labels: labels,

                        datasets: [

                            {
                                label: "Sales",

                                data: values,

                                borderWidth: 3,

                                tension: 0.4,

                                fill: false,

                                pointRadius: 4

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {
                                display: true
                            }

                        },

                        scales: {

                            y: {

                                beginAtZero: true,

                                ticks: {

                                    callback:
                                        function (value) {

                                            return (
                                                "UGX " +
                                                Number(value)
                                                    .toLocaleString()
                                            );

                                        }

                                }

                            }

                        }

                    }

                }
            );


        console.log(
            "Sales chart created successfully."
        );

    }

    catch (error) {

        console.error(
            "Sales chart error:",
            error
        );

        createEmptyChart(
            canvas,
            "Sales"
        );

    }

}


// =========================================================
// EXPENSE CHART
// =========================================================

async function loadExpenseChart() {

    const canvas =
        document.getElementById("expenseChart");

    if (!canvas) {

        console.error(
            "expenseChart canvas not found."
        );

        return;

    }


    try {

        const data =
            await apiRequest(
                "/api/dashboard/expense-chart"
            );


        console.log(
            "Expense chart data:",
            data
        );


        let labels = [];
        let values = [];


        if (Array.isArray(data)) {

            labels =
                data.map(item =>
                    item.category ||
                    item.label ||
                    ""
                );

            values =
                data.map(item =>
                    Number(
                        item.amount ||
                        item.total ||
                        item.expenses ||
                        0
                    )
                );

        }

        else if (data && Array.isArray(data.labels)) {

            labels = data.labels;

            values =
                data.values ||
                data.data ||
                [];

        }


        if (!labels.length) {

            labels = [
                "No expenses"
            ];

            values = [
                0
            ];

        }


        if (expenseChartInstance) {

            expenseChartInstance.destroy();

        }


        expenseChartInstance =
            new Chart(
                canvas,
                {
                    type: "doughnut",

                    data: {

                        labels: labels,

                        datasets: [

                            {
                                label: "Expenses",

                                data: values,

                                borderWidth: 1

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {

                                display: true,

                                position: "bottom"

                            }

                        }

                    }

                }
            );


        console.log(
            "Expense chart created successfully."
        );

    }

    catch (error) {

        console.error(
            "Expense chart error:",
            error
        );

        createEmptyChart(
            canvas,
            "Expenses"
        );

    }

}


// =========================================================
// EMPTY CHART
// =========================================================

function createEmptyChart(canvas, label) {

    if (!canvas) {
        return;
    }


    if (label === "Sales") {

        if (salesChartInstance) {

            salesChartInstance.destroy();

        }


        salesChartInstance =
            new Chart(
                canvas,
                {
                    type: "line",

                    data: {

                        labels: [
                            "No data"
                        ],

                        datasets: [

                            {
                                label: "Sales",

                                data: [0],

                                borderWidth: 2,

                                tension: 0.4

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false

                    }

                }
            );

    }

    else {

        if (expenseChartInstance) {

            expenseChartInstance.destroy();

        }


        expenseChartInstance =
            new Chart(
                canvas,
                {
                    type: "doughnut",

                    data: {

                        labels: [
                            "No data"
                        ],

                        datasets: [

                            {
                                data: [1],

                                borderWidth: 1

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false

                    }

                }
            );

    }

}