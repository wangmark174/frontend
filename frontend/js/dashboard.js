// =========================================================
// BIZANALYTICS DASHBOARD.JS
// =========================================================


// =========================================================
// GLOBAL VARIABLES
// =========================================================

let productsCache = [];


// =========================================================
// START DASHBOARD
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("BizAnalytics dashboard.js started.");

    // Load dashboard
    loadDashboard();

    // Initialize everything
    initializeSaleEvents();
    initializeExpenseEvents();

});


// =========================================================
// DASHBOARD
// =========================================================

async function loadDashboard() {

    try {

        console.log("Loading dashboard...");

        const data = await getDashboardData();

        if (!data) {
            console.error("No dashboard data received.");
            return;
        }


        // TOTAL SALES

        const totalSales =
            document.getElementById("totalSales");

        if (totalSales) {

            totalSales.textContent =
                formatUGX(data.total_sales);

        }


        // TOTAL EXPENSES

        const totalExpenses =
            document.getElementById("totalExpenses");

        if (totalExpenses) {

            totalExpenses.textContent =
                formatUGX(data.total_expenses);

        }


        // TOTAL PROFIT

        const totalProfit =
            document.getElementById("totalProfit");

        if (totalProfit) {

            totalProfit.textContent =
                formatUGX(data.total_profit);

        }


        // TOTAL PRODUCTS

        const totalProducts =
            document.getElementById("totalProducts");

        if (totalProducts) {

            totalProducts.textContent =
                data.total_products || 0;

        }


        console.log(
            "Dashboard updated successfully:",
            data
        );

    }

    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


// =========================================================
// FORMAT UGX
// =========================================================

function formatUGX(amount) {

    return "UGX " +
        Number(amount || 0)
            .toLocaleString("en-US");

}


// =========================================================
// INITIALIZE SALE EVENTS
// =========================================================

function initializeSaleEvents() {

    // ADD SALE BUTTON

    const addSaleBtn =
        document.getElementById("addSaleBtn");

    if (addSaleBtn) {

        addSaleBtn.addEventListener(
            "click",
            openSaleModal
        );

    }


    // CLOSE SALE BUTTON

    const closeSaleBtn =
        document.getElementById("closeSaleModal");

    if (closeSaleBtn) {

        closeSaleBtn.addEventListener(
            "click",
            closeSaleModal
        );

    }


    // CANCEL SALE

    const cancelSale =
        document.getElementById("cancelSale");

    if (cancelSale) {

        cancelSale.addEventListener(
            "click",
            closeSaleModal
        );

    }


    // SALE FORM

    const saleForm =
        document.getElementById("saleForm");

    if (saleForm) {

        saleForm.addEventListener(
            "submit",
            submitSale
        );

    }


    // PRODUCT

    const saleProduct =
        document.getElementById("saleProduct");

    if (saleProduct) {

        saleProduct.addEventListener(
            "change",
            updateSaleProduct
        );

    }


    // QUANTITY

    const saleQuantity =
        document.getElementById("saleQuantity");

    if (saleQuantity) {

        saleQuantity.addEventListener(
            "input",
            updateSaleAmount
        );

    }


    // CLICK OUTSIDE SALE MODAL

    const saleModal =
        document.getElementById("saleModal");

    if (saleModal) {

        saleModal.addEventListener(
            "click",
            function (event) {

                if (event.target === saleModal) {

                    closeSaleModal();

                }

            }
        );

    }

}


// =========================================================
// OPEN SALE MODAL
// =========================================================

async function openSaleModal() {

    const modal =
        document.getElementById("saleModal");

    if (!modal) {

        console.error(
            "saleModal not found."
        );

        return;

    }


    modal.classList.add("active");

    await loadSaleProducts();

}


// =========================================================
// CLOSE SALE MODAL
// =========================================================

function closeSaleModal() {

    const modal =
        document.getElementById("saleModal");

    if (modal) {

        modal.classList.remove("active");

    }


    const form =
        document.getElementById("saleForm");

    if (form) {

        form.reset();

    }


    const stockInfo =
        document.getElementById("stockInfo");

    if (stockInfo) {

        stockInfo.textContent = "";

    }


    const message =
        document.getElementById("saleMessage");

    if (message) {

        message.textContent = "";

        message.className =
            "form-message";

    }

}


// =========================================================
// LOAD PRODUCTS
// =========================================================

async function loadSaleProducts() {

    const select =
        document.getElementById("saleProduct");

    if (!select) {

        console.error(
            "saleProduct not found."
        );

        return;

    }


    try {

        console.log(
            "Loading products..."
        );


        productsCache =
            await getProducts();


        select.innerHTML = `
            <option value="">
                Select product
            </option>
        `;


        productsCache.forEach(
            function (product) {

                const option =
                    document.createElement("option");

                option.value =
                    product.id;

                option.textContent =
                    `${product.name} — ${product.quantity} in stock`;

                select.appendChild(option);

            }
        );


        console.log(
            "Products loaded:",
            productsCache
        );

    }

    catch (error) {

        console.error(
            "Could not load products:",
            error
        );


        select.innerHTML = `
            <option value="">
                Could not load products
            </option>
        `;

    }

}


// =========================================================
// UPDATE SALE PRODUCT
// =========================================================

function updateSaleProduct() {

    const productSelect =
        document.getElementById("saleProduct");

    const stockInfo =
        document.getElementById("stockInfo");


    if (!productSelect) {

        return;

    }


    const productId =
        Number(productSelect.value);


    const product =
        productsCache.find(
            function (p) {

                return p.id === productId;

            }
        );


    if (!product) {

        if (stockInfo) {

            stockInfo.textContent = "";

        }

        return;

    }


    if (stockInfo) {

        stockInfo.textContent =
            `${product.quantity} units available`;

    }


    updateSaleAmount();

}


// =========================================================
// UPDATE SALE AMOUNT
// =========================================================

function updateSaleAmount() {

    const productSelect =
        document.getElementById("saleProduct");

    const quantityInput =
        document.getElementById("saleQuantity");

    const amountInput =
        document.getElementById("saleAmount");


    if (
        !productSelect ||
        !quantityInput ||
        !amountInput
    ) {

        return;

    }


    const productId =
        Number(productSelect.value);


    const product =
        productsCache.find(
            function (p) {

                return p.id === productId;

            }
        );


    if (!product) {

        amountInput.value = "";

        return;

    }


    const quantity =
        Number(quantityInput.value) || 1;


    amountInput.value =
        product.selling_price * quantity;

}


// =========================================================
// SUBMIT SALE
// =========================================================

async function submitSale(event) {

    event.preventDefault();

    console.log(
        "SAVE SALE CLICKED"
    );


    const productId =
        Number(
            document.getElementById(
                "saleProduct"
            ).value
        );


    const quantity =
        Number(
            document.getElementById(
                "saleQuantity"
            ).value
        );


    const product =
        productsCache.find(
            function (p) {

                return p.id === productId;

            }
        );


    if (!product) {

        showSaleMessage(
            "Please select a product.",
            "error"
        );

        return;

    }


    if (
        quantity <= 0 ||
        quantity > product.quantity
    ) {

        showSaleMessage(
            `Only ${product.quantity} units are available.`,
            "error"
        );

        return;

    }


    const amount =
        Number(
            document.getElementById(
                "saleAmount"
            ).value
        );


    if (!amount || amount <= 0) {

        showSaleMessage(
            "Enter a valid sale amount.",
            "error"
        );

        return;

    }


    const sale = {

        product_id:
            productId,

        customer_name:
            document.getElementById(
                "saleCustomer"
            ).value.trim(),

        quantity:
            quantity,

        amount:
            amount,

        payment_method:
            document.getElementById(
                "paymentMethod"
            ).value,

        status:
            document.getElementById(
                "saleStatus"
            ).value

    };


    console.log(
        "Sending sale:",
        sale
    );


    try {

        const result =
            await createSale(sale);


        console.log(
            "Sale response:",
            result
        );


        showSaleMessage(
            "Sale recorded successfully!",
            "success"
        );


        await loadDashboard();

        await loadSaleProducts();


        setTimeout(
            function () {

                closeSaleModal();

            },
            700
        );

    }

    catch (error) {

        console.error(
            "SALE ERROR:",
            error
        );


        showSaleMessage(
            error.message ||
            "Could not record sale.",
            "error"
        );

    }

}


// =========================================================
// SALE MESSAGE
// =========================================================

function showSaleMessage(text, type) {

    const message =
        document.getElementById(
            "saleMessage"
        );


    if (!message) {

        return;

    }


    message.textContent = text;

    message.className =
        `form-message ${type}`;

}


// =========================================================
// =========================================================
// EXPENSE SECTION
// =========================================================
// =========================================================


// =========================================================
// INITIALIZE EXPENSE EVENTS
// =========================================================

function initializeExpenseEvents() {

    console.log(
        "Initializing expense system..."
    );


    // ADD EXPENSE BUTTON

    const addExpenseBtn =
        document.getElementById(
            "addExpenseBtn"
        );


    if (addExpenseBtn) {

        addExpenseBtn.addEventListener(
            "click",
            openExpenseModal
        );


        console.log(
            "addExpenseBtn connected."
        );

    }

    else {

        console.error(
            "ERROR: addExpenseBtn not found."
        );

    }


    // CLOSE BUTTON

    const closeExpenseBtn =
        document.getElementById(
            "closeExpenseModal"
        );


    if (closeExpenseBtn) {

        closeExpenseBtn.addEventListener(
            "click",
            closeExpenseModal
        );

    }


    // CANCEL BUTTON

    const cancelExpense =
        document.getElementById(
            "cancelExpense"
        );


    if (cancelExpense) {

        cancelExpense.addEventListener(
            "click",
            closeExpenseModal
        );

    }


    // EXPENSE FORM

    const expenseForm =
        document.getElementById(
            "expenseForm"
        );


    if (expenseForm) {

        expenseForm.addEventListener(
            "submit",
            submitExpense
        );


        console.log(
            "expenseForm connected."
        );

    }

    else {

        console.error(
            "ERROR: expenseForm not found."
        );

    }


    // CLICK OUTSIDE MODAL

    const expenseModal =
        document.getElementById(
            "expenseModal"
        );


    if (expenseModal) {

        expenseModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === expenseModal
                ) {

                    closeExpenseModal();

                }

            }
        );

    }


    // AMOUNT INPUT

    const expenseAmount =
        document.getElementById(
            "expenseAmount"
        );


    if (expenseAmount) {

        expenseAmount.addEventListener(
            "input",
            function () {

                if (
                    Number(
                        expenseAmount.value
                    ) < 0
                ) {

                    expenseAmount.value = "";

                }

            }
        );

    }

}


// =========================================================
// OPEN EXPENSE MODAL
// =========================================================

function openExpenseModal() {

    console.log(
        "ADD EXPENSE BUTTON CLICKED"
    );


    const modal =
        document.getElementById(
            "expenseModal"
        );


    if (!modal) {

        console.error(
            "ERROR: expenseModal not found."
        );

        return;

    }


    modal.classList.add(
        "active"
    );


    console.log(
        "Expense modal opened."
    );

}


// =========================================================
// CLOSE EXPENSE MODAL
// =========================================================

function closeExpenseModal() {

    console.log(
        "Closing expense modal..."
    );


    const modal =
        document.getElementById(
            "expenseModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }


    const form =
        document.getElementById(
            "expenseForm"
        );


    if (form) {

        form.reset();

    }


    const message =
        document.getElementById(
            "expenseMessage"
        );


    if (message) {

        message.textContent = "";

        message.className =
            "form-message";

    }

}


// =========================================================
// SUBMIT EXPENSE
// =========================================================

async function submitExpense(event) {

    // VERY IMPORTANT
    // Stop normal HTML form submission.

    event.preventDefault();


    console.log(
        "================================="
    );

    console.log(
        "SAVE EXPENSE CLICKED"
    );

    console.log(
        "================================="
    );


    // =====================================================
    // GET FORM ELEMENTS
    // =====================================================

    const categoryElement =
        document.getElementById(
            "expenseCategory"
        );


    const amountElement =
        document.getElementById(
            "expenseAmount"
        );


    const descriptionElement =
        document.getElementById(
            "expenseDescription"
        );


    // =====================================================
    // CHECK ELEMENTS
    // =====================================================

    if (!categoryElement) {

        console.error(
            "expenseCategory NOT FOUND"
        );


        showExpenseMessage(
            "Expense category field is missing.",
            "error"
        );


        return;

    }


    if (!amountElement) {

        console.error(
            "expenseAmount NOT FOUND"
        );


        showExpenseMessage(
            "Expense amount field is missing.",
            "error"
        );


        return;

    }


    if (!descriptionElement) {

        console.error(
            "expenseDescription NOT FOUND"
        );


        showExpenseMessage(
            "Expense description field is missing.",
            "error"
        );


        return;

    }


    // =====================================================
    // GET VALUES
    // =====================================================

    const category =
        categoryElement.value.trim();


    const amount =
        Number(
            amountElement.value
        );


    const description =
        descriptionElement.value.trim();


    console.log(
        "Expense category:",
        category
    );


    console.log(
        "Expense amount:",
        amount
    );


    console.log(
        "Expense description:",
        description
    );


    // =====================================================
    // VALIDATION
    // =====================================================

    if (!category) {

        showExpenseMessage(
            "Please select an expense category.",
            "error"
        );


        categoryElement.focus();

        return;

    }


    if (
        isNaN(amount) ||
        amount <= 0
    ) {

        showExpenseMessage(
            "Please enter a valid expense amount.",
            "error"
        );


        amountElement.focus();

        return;

    }


    // =====================================================
    // CREATE EXPENSE OBJECT
    // =====================================================

    const expense = {

        category:
            category,

        amount:
            amount,

        description:
            description || null

    };


    console.log(
        "FINAL EXPENSE DATA:",
        expense
    );


    // =====================================================
    // DISABLE SAVE BUTTON
    // =====================================================

    const saveButton =
        document.querySelector(
            "#expenseForm button[type='submit']"
        );


    if (saveButton) {

        saveButton.disabled = true;

        saveButton.textContent =
            "Saving...";

    }


    // =====================================================
    // SEND TO BACKEND
    // =====================================================

    try {

        console.log(
            "Sending expense to backend..."
        );


        const result =
            await createExpense(
                expense
            );


        console.log(
            "EXPENSE SAVED!",
            result
        );


        // =================================================
        // SUCCESS MESSAGE
        // =================================================

        showExpenseMessage(
            "Expense saved successfully!",
            "success"
        );


        // =================================================
        // UPDATE DASHBOARD
        // =================================================

        await loadDashboard();


        // =================================================
        // CLOSE MODAL
        // =================================================

        setTimeout(
            function () {

                closeExpenseModal();

            },
            800
        );

    }

    catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "EXPENSE SAVE ERROR"
        );

        console.error(
            error
        );

        console.error(
            "================================="
        );


        showExpenseMessage(
            error.message ||
            "Could not save expense.",
            "error"
        );

    }

    finally {

        // =================================================
        // ENABLE BUTTON AGAIN
        // =================================================

        if (saveButton) {

            saveButton.disabled = false;

            saveButton.textContent =
                "Save Expense";

        }

    }

}


// =========================================================
// EXPENSE MESSAGE
// =========================================================

function showExpenseMessage(
    text,
    type
) {

    const message =
        document.getElementById(
            "expenseMessage"
        );


    if (!message) {

        console.error(
            "expenseMessage NOT FOUND:",
            text
        );

        // Fallback so you still see the error
        alert(text);

        return;

    }


    message.textContent =
        text;


    message.className =
        `form-message ${type}`;


    console.log(
        `Expense message [${type}]:`,
        text
    );

}


// =========================================================
// DEBUG
// =========================================================

console.log(
    "BizAnalytics dashboard.js loaded successfully."
);