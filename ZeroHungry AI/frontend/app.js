// ============================================================
// ZEROHUNGRY AI - app.js
// Complete frontend JavaScript
// ============================================================


// ============================================================
// BACKEND URL
// ============================================================

const API_BASE_URL = "http://localhost:8080";

// ============================================================
// NGO AUTO REFRESH
// ============================================================

let ngoAutoRefreshInterval = null;

function startNgoAutoRefresh() {

    if (!getEl("ngoDashboard")) {
        return;
    }

    if (ngoAutoRefreshInterval) {
        return;
    }

    ngoAutoRefreshInterval = setInterval(
        function () {

            console.log(
                "Checking for new food donations..."
            );

            initNgoDashboardPage();

        },
        5000
    );
}


// ============================================================
// COMMON UTILITY FUNCTIONS
// ============================================================

function getEl(id) {
    return document.getElementById(id);
}


function show(element) {
    if (element) {
        element.classList.remove("hidden");
        element.style.display = "";
    }
}

function hide(element) {
    if (element) {
        element.classList.add("hidden");
        element.style.display = "none";
    }
}

function setText(id, text) {

    const element = getEl(id);

    if (element) {
        element.textContent =
            text === null || text === undefined
                ? ""
                : text;
    }
}


function formatDateTime(dateTime) {

    if (!dateTime) {
        return "-";
    }

    const date = new Date(dateTime);

    if (isNaN(date.getTime())) {
        return dateTime;
    }

    return date.toLocaleString();
}


function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// LOCAL STORAGE KEYS
// ============================================================

const DONATIONS_KEY = "zh_donations";

const CURRENT_DONATION_KEY = "zh_current";

const NGO_KEY = "zh_ngo";


// ============================================================
// LOCAL STORAGE HELPERS
// ============================================================

function getDonations() {

    try {

        return JSON.parse(
            localStorage.getItem(DONATIONS_KEY)
        ) || [];

    } catch (error) {

        console.error(
            "Error reading donations:",
            error
        );

        return [];
    }
}


function saveDonations(donations) {

    localStorage.setItem(
        DONATIONS_KEY,
        JSON.stringify(donations)
    );
}


function getCurrentDonation() {

    try {

        return JSON.parse(
            localStorage.getItem(
                CURRENT_DONATION_KEY
            )
        );

    } catch (error) {

        console.error(
            "Error reading current donation:",
            error
        );

        return null;
    }
}


function saveCurrentDonation(donation) {

    localStorage.setItem(
        CURRENT_DONATION_KEY,
        JSON.stringify(donation)
    );
}


// ============================================================
// UPDATE LOCAL DONATION
// ============================================================

function updateLocalDonation(updatedDonation) {

    if (!updatedDonation) {
        return;
    }

    const current =
        getCurrentDonation();

    if (
        current &&
        String(current.id) ===
        String(updatedDonation.id)
    ) {

        current.status =
            updatedDonation.status;

        current.freshnessScore =
            updatedDonation.freshnessScore;

        current.freshnessStatus =
            updatedDonation.freshnessStatus;

        current.expectedExpiry =
            updatedDonation.expectedExpiry;

        current.estimatedExpiry =
            updatedDonation.estimatedExpiry;

        current.aiMessage =
            updatedDonation.aiMessage;

        saveCurrentDonation(current);
    }


    const donations =
        getDonations();

    const index =
        donations.findIndex(
            function (item) {

                return String(item.id) ===
                    String(updatedDonation.id);
            }
        );


    if (index !== -1) {

        donations[index].status =
            updatedDonation.status;

        donations[index].freshnessScore =
            updatedDonation.freshnessScore;

        donations[index].freshnessStatus =
            updatedDonation.freshnessStatus;

        donations[index].expectedExpiry =
            updatedDonation.expectedExpiry;

        donations[index].estimatedExpiry =
            updatedDonation.estimatedExpiry;

        donations[index].aiMessage =
            updatedDonation.aiMessage;

        saveDonations(donations);
    }
}


// ============================================================
// PAGE ROUTER
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "================================"
        );

        console.log(
            "ZeroHungry AI frontend loaded"
        );

        console.log(
            "================================"
        );


        if (getEl("verifyForm")) {
            initIndexPage();
        }


        if (getEl("donationStatusPage")) {
            initDonationStatusPage();
        }


        if (getEl("ngoRegisterForm")) {
            initNgoRegisterPage();
        }


        if (getEl("ngoDashboard")) {
            initNgoDashboardPage();
        }


        if (getEl("ngoResponsePage")) {
            initNgoResponsePage();
        }


        if (getEl("myDonationsPage")) {
            initMyDonationsPage();
        }


        initCommonFeatures();
    }
);


// ============================================================
// INDEX / FOOD VERIFICATION PAGE
// ============================================================

function initIndexPage() {

    const form =
        getEl("verifyForm");

    if (!form) {
        return;
    }


    const resultPanel =
        getEl("resultPanel");

    const resultLoading =
        getEl("resultLoading");

    const resultContent =
        getEl("resultContent");


    // ========================================================
    // IMAGE PREVIEW
    // ========================================================

    const imageInput =
        getEl("foodImage");

    const imagePreview =
        getEl("imgPreview");

    const removeImageBtn =
        getEl("removeImgBtn");


    if (imageInput) {

        imageInput.addEventListener(
            "change",
            function () {

                const file =
                    this.files[0];

                if (!file) {
                    return;
                }


                if (imagePreview) {

                    const reader =
                        new FileReader();

                    reader.onload =
                        function (event) {

                            imagePreview.src =
                                event.target.result;

                            show(imagePreview);

                            const previewWrap =
                                getEl("imgPreviewWrap");

                            if (previewWrap) {
                                show(previewWrap);
                            }
                        };

                    reader.readAsDataURL(file);
                }


                const fileNameDisplay =
                    getEl("fileNameDisplay");

                if (fileNameDisplay) {

                    fileNameDisplay.textContent =
                        file.name;
                }
            }
        );
    }


    // ========================================================
    // REMOVE IMAGE
    // ========================================================

    if (removeImageBtn) {

        removeImageBtn.addEventListener(
            "click",
            function () {

                if (imageInput) {
                    imageInput.value = "";
                }


                if (imagePreview) {

                    imagePreview.src = "";

                    hide(imagePreview);
                }


                const previewWrap =
                    getEl("imgPreviewWrap");

                if (previewWrap) {
                    hide(previewWrap);
                }


                const fileNameDisplay =
                    getEl("fileNameDisplay");

                if (fileNameDisplay) {

                    fileNameDisplay.textContent =
                        "Click to upload or drag & drop";
                }
            }
        );
    }


    // ========================================================
    // CLEAR FORM
    // ========================================================

    const clearFormBtn =
        getEl("clearFormBtn");


    if (clearFormBtn) {

        clearFormBtn.addEventListener(
            "click",
            function () {

                form.reset();


                if (imageInput) {
                    imageInput.value = "";
                }


                if (imagePreview) {

                    imagePreview.src = "";

                    hide(imagePreview);
                }


                const previewWrap =
                    getEl("imgPreviewWrap");

                if (previewWrap) {
                    hide(previewWrap);
                }


                const fileNameDisplay =
                    getEl("fileNameDisplay");

                if (fileNameDisplay) {

                    fileNameDisplay.textContent =
                        "Click to upload or drag & drop";
                }


                document
                    .querySelectorAll(".field-error")
                    .forEach(
                        function (element) {

                            element.textContent = "";

                            element.classList.remove(
                                "input-error"
                            );
                        }
                    );


                document
                    .querySelectorAll(".input-error")
                    .forEach(
                        function (element) {

                            element.classList.remove(
                                "input-error"
                            );
                        }
                    );
            }
        );
    }


    // ========================================================
    // VERIFY ANOTHER BUTTON
    // ========================================================

    const verifyAnotherBtn =
        getEl("verifyAnotherBtn");


    if (verifyAnotherBtn) {

        verifyAnotherBtn.addEventListener(
            "click",
            function () {

                hide(resultPanel);

                form.reset();


                if (imageInput) {
                    imageInput.value = "";
                }


                if (imagePreview) {

                    imagePreview.src = "";

                    hide(imagePreview);
                }


                const previewWrap =
                    getEl("imgPreviewWrap");

                if (previewWrap) {
                    hide(previewWrap);
                }


                const fileNameDisplay =
                    getEl("fileNameDisplay");

                if (fileNameDisplay) {

                    fileNameDisplay.textContent =
                        "Click to upload or drag & drop";
                }


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );
    }


    // ========================================================
    // FORM INPUT
    // ========================================================

    form.addEventListener(
        "input",
        function () {

            document
                .querySelectorAll(".field-error")
                .forEach(
                    function (element) {

                        element.textContent = "";
                    }
                );


            document
                .querySelectorAll(".input-error")
                .forEach(
                    function (element) {

                        element.classList.remove(
                            "input-error"
                        );
                    }
                );
        }
    );


    // ========================================================
    // FORM SUBMIT
    // ========================================================

    form.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            console.log(
                "VERIFY FOOD button clicked"
            );


            if (!validateVerifyForm()) {

                console.log(
                    "Form validation failed"
                );

                return;
            }


            const formData =
                collectVerifyData();


            console.log(
                "Form data collected:",
                formData
            );


            if (resultPanel) {
                show(resultPanel);
            }


            if (resultLoading) {
                show(resultLoading);
            }


            if (resultContent) {
                hide(resultContent);
            }


            if (resultPanel) {

                resultPanel.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }


            try {

                const token =
                    localStorage.getItem(
                        "jwtToken"
                    );


                if (!token) {

                    throw new Error(
                        "Please login first."
                    );
                }


                const donationData = {

                    donorName:
                        formData.donorName,

                    foodName:
                        formData.foodName,

                    foodCategory:
                        convertFoodCategory(
                            formData.foodCategory
                        ),

                    quantity:
                        formData.quantity,

                    numberOfPeople:
                        Number(
                            formData.servings
                        ),

                    preparationType:
                        convertPreparationType(
                            formData.prepType
                        ),

                    preparationDateTime:
                        formData.prepDateTime,

                    storageCondition:
                        convertStorageCondition(
                            formData.storageCondition
                        ),

                    expectedExpiry:
                        formData.expiryDateTime,

                    foodImagePath:
                        "",

                    location:
                        formData.location,

                    contact:
                        formData.contactNumber
                };


                console.log(
                    "Sending donation to Spring Boot:",
                    donationData
                );


                const response =
                    await fetch(
                        API_BASE_URL +
                        "/api/donations",
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + token
                            },

                            body:
                                JSON.stringify(
                                    donationData
                                )
                        }
                    );


                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    localStorage.removeItem(
                        "jwtToken"
                    );

                    window.location.href =
                        "login.html";

                    return;
                }


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        "Backend error: " +
                        errorText
                    );
                }


                const savedDonation =
                    await response.json();


                console.log(
                    "Donation saved successfully:",
                    savedDonation
                );


                const lastResult = {

                    freshnessScore:
                        savedDonation.freshnessScore,

                    freshnessStatus:
                        savedDonation.freshnessStatus,

                    estimatedExpiry:
                        savedDonation.estimatedExpiry,

                    servings:
                        savedDonation.numberOfPeople,

                    safetyLevel:
                        savedDonation.freshnessStatus,

                    safetyMessage:
                        savedDonation.aiMessage,

                    storageCondition:
                        formData.storageCondition,

                    donorName:
                        savedDonation.donorName,

                    contactNumber:
                        savedDonation.contact,

                    location:
                        savedDonation.location,

                    foodName:
                        savedDonation.foodName,

                    foodCategory:
                        formData.foodCategory,

                    quantity:
                        savedDonation.quantity,

                    prepType:
                        formData.prepType,

                    prepDateTime:
                        savedDonation.preparationDateTime,

                    expiryDateTime:
                        savedDonation.expectedExpiry,

                    backendId:
                        savedDonation.id,

                    backendStatus:
                        savedDonation.status,

                    aiMessage:
                        savedDonation.aiMessage
                };


                const localDonation = {

                    id:
                        savedDonation.id,

                    donorName:
                        savedDonation.donorName,

                    foodName:
                        savedDonation.foodName,

                    foodCategory:
                        formData.foodCategory,

                    quantity:
                        savedDonation.quantity,

                    servings:
                        savedDonation.numberOfPeople,

                    prepType:
                        formData.prepType,

                    storageCondition:
                        formData.storageCondition,

                    prepDateTime:
                        savedDonation.preparationDateTime,

                    expiryDateTime:
                        savedDonation.expectedExpiry,

                    location:
                        savedDonation.location,

                    contactNumber:
                        savedDonation.contact,

                    status:
                        savedDonation.status,

                    freshnessScore:
                        savedDonation.freshnessScore,

                    freshnessStatus:
                        savedDonation.freshnessStatus,

                    expectedExpiry:
                        savedDonation.expectedExpiry,

                    estimatedExpiry:
                        savedDonation.estimatedExpiry,

                    aiMessage:
                        savedDonation.aiMessage,

                    createdAt:
                        savedDonation.createdAt ||
                        new Date().toISOString(),

                    aiResult:
                        lastResult
                };


                saveCurrentDonation(
                    localDonation
                );


                const donations =
                    getDonations();


                const existingIndex =
                    donations.findIndex(
                        function (item) {

                            return String(item.id) ===
                                String(savedDonation.id);
                        }
                    );


                if (existingIndex !== -1) {

                    donations[existingIndex] =
                        localDonation;

                } else {

                    donations.unshift(
                        localDonation
                    );
                }


                saveDonations(
                    donations
                );


                if (resultLoading) {
    hide(resultLoading);
}

if (resultContent) {
    show(resultContent);
}

restoreVerifyForm(formData);

console.log(
    "Backend Donation ID:",
    savedDonation.id
);

console.log("Displaying AI result...");

displayResult(lastResult);

console.log("AI result displayed successfully.");

} catch (error){

                console.error(
                    "Donation submission failed:",
                    error
                );


                if (resultLoading) {
                    hide(resultLoading);
                }


                if (resultContent) {

                    resultContent.innerHTML = `

                        <div style="
                            padding:20px;
                            text-align:center;
                        ">

                            <h2>
                                ❌ Submission Failed
                            </h2>

                            <p>
                                ${escapeHtml(
                                    error.message
                                )}
                            </p>

                            <p>
                                Please make sure you are
                                logged in and Spring Boot
                                is running on port 8080.
                            </p>

                        </div>

                    `;


                    show(resultContent);
                }
            }
        }
    );
}


// ============================================================
// FORM VALIDATION
// ============================================================

function validateVerifyForm() {

    let valid = true;


    const donorName =
        getEl("donorName");

    const contactNumber =
        getEl("contactNumber");

    const location =
        getEl("location");

    const foodName =
        getEl("foodName");

    const foodCategory =
        getEl("foodCategory");

    const quantity =
        getEl("quantity");

    const servings =
        getEl("servings");

    const prepDateTime =
        getEl("prepDateTime");

    const expiryDateTime =
        getEl("expiryDateTime");

    const foodImage =
        getEl("foodImage");
        console.log("Donor:", donorName?.value);
console.log("Food:", foodName?.value);
console.log("Category:", foodCategory?.value);
console.log("Image:", foodImage?.files?.length);


    if (
        donorName &&
        donorName.value.trim() === ""
    ) {

        showFieldError(
            donorName,
            "Please enter donor name"
        );

        valid = false;
    }


    if (
        contactNumber &&
        contactNumber.value.trim() === ""
    ) {

        showFieldError(
            contactNumber,
            "Please enter contact number"
        );

        valid = false;
    }


    if (
        location &&
        location.value.trim() === ""
    ) {

        showFieldError(
            location,
            "Please enter location"
        );

        valid = false;
    }


    if (
        foodName &&
        foodName.value.trim() === ""
    ) {

        showFieldError(
            foodName,
            "Please enter food name"
        );

        valid = false;
    }


    if (
        foodCategory &&
        foodCategory.value === ""
    ) {

        showFieldError(
            foodCategory,
            "Please select food category"
        );

        valid = false;
    }


    if (
        quantity &&
        quantity.value.trim() === ""
    ) {

        showFieldError(
            quantity,
            "Please enter quantity"
        );

        valid = false;
    }


    if (
        servings &&
        servings.value.trim() === ""
    ) {

        showFieldError(
            servings,
            "Please enter number of people"
        );

        valid = false;
    }


    const prepType =
        document.querySelector(
            'input[name="prepType"]:checked'
        );


    if (!prepType) {

        valid = false;

        alert(
            "Please select preparation type."
        );
    }


    const storageCondition =
        document.querySelector(
            'input[name="storageCondition"]:checked'
        );


    if (!storageCondition) {

        valid = false;

        alert(
            "Please select storage condition."
        );
    }


    if (
        prepDateTime &&
        prepDateTime.value === ""
    ) {

        showFieldError(
            prepDateTime,
            "Please select preparation date and time"
        );

        valid = false;
    }


    if (
        expiryDateTime &&
        expiryDateTime.value === ""
    ) {

        showFieldError(
            expiryDateTime,
            "Please select expiry date and time"
        );

        valid = false;
    }


    if (
        foodImage &&
        foodImage.files.length === 0
    ) {

        showFieldError(
            foodImage,
            "Please upload food image"
        );

        valid = false;
    }


    return valid;
}


// ============================================================
// SHOW FIELD ERROR
// ============================================================

function showFieldError(
    element,
    message
) {

    if (!element) {
        return;
    }


    element.classList.add(
        "input-error"
    );


    let errorElement =
        element.parentElement
            ?.querySelector(
                ".field-error"
            );


    if (!errorElement) {

        errorElement =
            document.createElement(
                "small"
            );

        errorElement.className =
            "field-error";

        element.parentElement
            ?.appendChild(
                errorElement
            );
    }


    errorElement.textContent =
        message;
}


// ============================================================
// COLLECT FORM DATA
// ============================================================

function collectVerifyData() {

    const prepType =
        document.querySelector(
            'input[name="prepType"]:checked'
        );


    const storageCondition =
        document.querySelector(
            'input[name="storageCondition"]:checked'
        );


    return {

        donorName:
            getEl("donorName")?.value.trim() ||
            "",

        contactNumber:
            getEl("contactNumber")?.value.trim() ||
            "",

        location:
            getEl("location")?.value.trim() ||
            "",

        foodName:
            getEl("foodName")?.value.trim() ||
            "",

        foodCategory:
            getEl("foodCategory")?.value ||
            "",

        quantity:
            getEl("quantity")?.value.trim() ||
            "",

        servings:
            getEl("servings")?.value ||
            "",

        prepType:
            prepType
                ? prepType.value
                : "",

        storageCondition:
            storageCondition
                ? storageCondition.value
                : "",

        prepDateTime:
            getEl("prepDateTime")?.value ||
            "",

        expiryDateTime:
            getEl("expiryDateTime")?.value ||
            ""
    };
}


// ============================================================
// ENUM CONVERSION
// ============================================================

function convertFoodCategory(category) {

    const map = {

        "Cooked Meal":
            "COOKED_MEAL",

        "Baked Goods":
            "BAKED_GOODS",

        "Raw Vegetables":
            "RAW_VEGETABLES",

        "Fruits":
            "FRUITS",

        "Dairy":
            "DAIRY",

        "Packaged Food":
            "PACKAGED_FOOD",

        "Beverages":
            "BEVERAGES",

        "Other":
            "OTHER"
    };


    return map[category] || "OTHER";
}


function convertPreparationType(type) {

    const map = {

        "Cooked":
            "COOKED",

        "Baked":
            "BAKED",

        "Raw":
            "RAW",

        "Packaged":
            "PACKAGED",

        "Other":
            "OTHER"
    };


    return map[type] || "OTHER";
}


function convertStorageCondition(condition) {

    const map = {

        "Room Temperature":
            "ROOM_TEMPERATURE",

        "Refrigerated":
            "REFRIGERATED",

        "Other":
            "OTHER"
    };


    return map[condition] || "OTHER";
}


// ============================================================
// DISPLAY RESULT
// ============================================================

function displayResult(result) {

    const resultPanel =
        getEl("resultPanel");

    const resultContent =
        getEl("resultContent");

    const resultLoading =
        getEl("resultLoading");


    if (!resultPanel || !resultContent) {

        console.error(
            "Result elements not found"
        );

        return;
    }


    const foodName =
        result.foodName ||
        "Food";


    const score =
        result.freshnessScore ??
        0;


    const freshnessStatus =
        result.freshnessStatus ||
        "NOT_RECOMMENDED";


    const estimatedExpiry =
        result.estimatedExpiry ||
        result.expiryDateTime ||
        "Not available";


    const servings =
        result.servings ||
        result.numberOfPeople ||
        "Not specified";


    const storage =
        result.storageCondition ||
        "Not specified";


    const donationId =
        result.backendId ||
        result.id ||
        "Not available";


    const aiMessage =
        result.aiMessage ||
        result.safetyMessage ||
        "Freshness analysis completed.";


    let statusText =
        freshnessStatus.replaceAll(
            "_",
            " "
        );


    let formattedExpiry =
        estimatedExpiry;


    if (
        estimatedExpiry &&
        estimatedExpiry !== "Not available"
    ) {

        formattedExpiry =
            formatDateTime(
                estimatedExpiry
            );
    }


    resultContent.innerHTML = `

        <div class="result-card">

            <div class="result-header">

                <h2>
                    🤖 AI Food Analysis
                </h2>

                <p>
                    Food freshness verification completed
                </p>

            </div>


            <div class="result-score">

                <div class="score-circle">

                    <span>
                        ${escapeHtml(score)}
                    </span>

                    <small>
                        /100
                    </small>

                </div>


                <div class="score-info">

                    <h3>
                        Freshness Score
                    </h3>

                    <div class="freshness-badge">

                        ${escapeHtml(
                            statusText
                        )}

                    </div>

                </div>

            </div>


            <div class="result-details">

                <div class="result-detail">

                    <span>
                        🍱 Food Name
                    </span>

                    <strong>
                        ${escapeHtml(foodName)}
                    </strong>

                </div>


                <div class="result-detail">

                    <span>
                        👥 People Served
                    </span>

                    <strong>
                        ${escapeHtml(servings)}
                    </strong>

                </div>


                <div class="result-detail">

                    <span>
                        ❄️ Storage Condition
                    </span>

                    <strong>
                        ${escapeHtml(storage)}
                    </strong>

                </div>


                <div class="result-detail">

                    <span>
                        ⏰ Estimated Expiry
                    </span>

                    <strong>
                        ${escapeHtml(
                            formattedExpiry
                        )}
                    </strong>

                </div>


                <div class="result-detail">

                    <span>
                        🆔 Donation ID
                    </span>

                    <strong>
                        ${escapeHtml(
                            donationId
                        )}
                    </strong>

                </div>

            </div>


            <div class="ai-status">

                <h3>
                    🤖 AI Analysis
                </h3>

                <div class="ai-message">

                    ${escapeHtml(
                        aiMessage
                    )}

                </div>

            </div>


            <div style="
                margin-top:20px;
                padding:15px;
                border-radius:10px;
                background:#f5f5f5;
                text-align:center;
            ">

                <strong>
                    Food Verification Completed ✅
                </strong>

                <br>

                <span>
                    You can now donate this food to an NGO.
                </span>

            </div>


            <div style="
                display:flex;
                gap:12px;
                margin-top:25px;
                flex-wrap:wrap;
            ">

                <button
                    type="button"
                    id="donateFoodBtn"
                    class="primary-btn"
                >
                    🍱 DONATE THIS FOOD
                </button>


                <button
                    type="button"
                    id="verifyAnotherBtn"
                    class="secondary-btn"
                >
                    ➕ Verify Another Food
                </button>

            </div>

        </div>
    `;


    show(resultPanel);
    show(resultContent);


    if (resultLoading) {
        hide(resultLoading);
    }


    // ========================================================
    // DONATE BUTTON
    // ========================================================

    const donateButton =
        getEl("donateFoodBtn");


    if (donateButton) {

        donateButton.addEventListener(
            "click",
            handleDonateFood
        );
    }


    // ========================================================
    // VERIFY ANOTHER
    // ========================================================

    const verifyAnotherButton =
        getEl("verifyAnotherBtn");


    if (verifyAnotherButton) {

        verifyAnotherButton.addEventListener(
            "click",
            function () {

                hide(resultPanel);

                const form =
                    getEl("verifyForm");

                if (form) {
                    form.reset();
                }


                const imgPreviewWrap =
                    getEl("imgPreviewWrap");

                if (imgPreviewWrap) {
                    hide(imgPreviewWrap);
                }


                const imgPreview =
                    getEl("imgPreview");

                if (imgPreview) {
                    imgPreview.src = "";
                }


                const fileNameDisplay =
                    getEl("fileNameDisplay");

                if (fileNameDisplay) {

                    fileNameDisplay.textContent =
                        "Click to upload or drag & drop";
                }


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );
    }
}


// ============================================================
// DONATE FOOD
// IMPORTANT:
// Updates backend status to WAITING_FOR_NGO
// ============================================================

async function handleDonateFood() {

    const donation =
        getCurrentDonation();


    if (!donation) {

        alert(
            "Please verify the food first."
        );

        return;
    }


    if (!donation.id) {

        alert(
            "Donation ID is missing."
        );

        console.error(
            "Current donation:",
            donation
        );

        return;
    }


    const token =
        localStorage.getItem(
            "jwtToken"
        );


    if (!token) {

        window.location.href =
            "login.html";

        return;
    }


    console.log(
        "================================"
    );

    console.log(
        "DONATE FOOD CLICKED"
    );

    console.log(
        "Donation ID:",
        donation.id
    );

    console.log(
        "Changing status to WAITING_FOR_NGO"
    );

    console.log(
        "================================"
    );


    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/api/donations/" +
                donation.id +
                "/status?status=WAITING_FOR_NGO",
                {
                    method: "PUT",

                    headers: {

                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            localStorage.removeItem(
                "jwtToken"
            );

            alert(
                "Session expired. Please login again."
            );

            window.location.href =
                "login.html";

            return;
        }


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                "Backend error: " +
                errorText
            );
        }


        const updatedDonation =
            await response.json();


        console.log(
            "DONATION SENT TO NGO:",
            updatedDonation
        );


        donation.status =
            updatedDonation.status;


        donation.deadline =
            Date.now() +
            (10 * 60 * 1000);


        donation.freshnessScore =
            updatedDonation.freshnessScore;


        donation.freshnessStatus =
            updatedDonation.freshnessStatus;


        donation.expectedExpiry =
            updatedDonation.expectedExpiry;


        donation.aiMessage =
            updatedDonation.aiMessage;


        saveCurrentDonation(
            donation
        );


        updateLocalDonation(
            updatedDonation
        );


        // updateLocalDonation may preserve current data
        // but make sure deadline is not lost
        const currentAfterUpdate =
            getCurrentDonation();

        if (currentAfterUpdate) {

            currentAfterUpdate.deadline =
                donation.deadline;

            currentAfterUpdate.status =
                updatedDonation.status;

            saveCurrentDonation(
                currentAfterUpdate
            );
        }


        console.log(
            "Redirecting to donation status page..."
        );


        window.location.href =
            "donation-status.html";

    } catch (error) {

        console.error(
            "DONATE FOOD ERROR:",
            error
        );


        alert(
            "Unable to send donation to NGO.\n\n" +
            error.message
        );
    }
}


// ============================================================
// DONATION STATUS PAGE
// ============================================================

let donationStatusInterval = null;

let donationCountdownInterval = null;

let expiryRequestSent = false;


function initDonationStatusPage() {

    const donation =
        getCurrentDonation();


    if (!donation) {

        console.log(
            "No current donation found"
        );

        return;
    }


    console.log(
        "CURRENT DONATION:",
        donation
    );


    const result =
        donation.aiResult ||
        donation;


    const donationId =
        donation.id ||
        result.backendId ||
        result.id ||
        "--";


    const foodName =
        result.foodName ||
        donation.foodName ||
        "--";


    const quantity =
        result.quantity ||
        donation.quantity ||
        "--";


    const location =
        result.location ||
        donation.location ||
        "--";


    const donorName =
        result.donorName ||
        donation.donorName ||
        "--";


    const category =
        result.foodCategory ||
        result.category ||
        donation.foodCategory ||
        donation.category ||
        "--";


    const servings =
        result.servings ||
        result.numberOfPeople ||
        donation.servings ||
        donation.numberOfPeople ||
        "--";


    const prepType =
        result.prepType ||
        result.preparationType ||
        donation.prepType ||
        donation.preparationType ||
        "--";


    const storage =
        result.storageCondition ||
        donation.storageCondition ||
        "--";


    const prepTime =
        result.prepDateTime ||
        result.preparationDateTime ||
        donation.prepDateTime ||
        donation.preparationDateTime ||
        "--";


    const expiryTime =
        result.expiryDateTime ||
        result.expectedExpiry ||
        donation.expiryDateTime ||
        donation.expectedExpiry ||
        "--";


    const freshnessScore =
        result.freshnessScore ??
        donation.freshnessScore ??
        "--";


    const freshnessStatus =
        result.freshnessStatus ||
        donation.freshnessStatus ||
        "--";


    const createdAt =
        donation.createdAt ||
        result.createdAt ||
        "--";


    // ========================================================
    // TOP SUMMARY
    // ========================================================

    setText(
        "statusDonationId",
        "ZH-" +
        String(donationId).padStart(
            4,
            "0"
        )
    );


    setText(
        "statusFoodName",
        foodName
    );


    setText(
        "statusQuantity",
        quantity
    );


    setText(
        "statusLocation",
        location
    );


    setText(
        "statusDonorName",
        donorName
    );


    setText(
        "statusScore",
        freshnessScore
    );


    // ========================================================
    // FOOD DETAILS
    // ========================================================

    setText(
        "detFoodName",
        foodName
    );


    setText(
        "detCategory",
        String(category)
            .replaceAll("_", " ")
    );


    setText(
        "detQuantity",
        quantity
    );


    setText(
        "detServings",
        servings
    );


    setText(
        "detPrepType",
        String(prepType)
            .replaceAll("_", " ")
    );


    setText(
        "detStorage",
        String(storage)
            .replaceAll("_", " ")
    );


    setText(
        "detPrepTime",
        formatDateTime(prepTime)
    );


    setText(
        "detExpiryTime",
        formatDateTime(expiryTime)
    );


    setText(
        "detScore",
        freshnessScore + "/100"
    );


    setText(
        "detFreshStatus",
        String(freshnessStatus)
            .replaceAll("_", " ")
    );


    setText(
        "detCreatedAt",
        formatDateTime(createdAt)
    );


    // ========================================================
    // INITIAL STATUS
    // ========================================================

    updateDonorStatusUI(
        donation.status ||
        "WAITING_FOR_NGO"
    );


    // ========================================================
    // COUNTDOWN
    // ========================================================

    startDonationCountdown(
        donation
    );


    // ========================================================
    // GET REAL STATUS IMMEDIATELY
    // ========================================================

    refreshDonationStatusFromBackend();


    // ========================================================
    // AUTO REFRESH EVERY 3 SECONDS
    // ========================================================

    if (donationStatusInterval) {

        clearInterval(
            donationStatusInterval
        );
    }


    donationStatusInterval =
        setInterval(
            function () {

                const current =
                    getCurrentDonation();


                if (!current) {

                    clearInterval(
                        donationStatusInterval
                    );

                    return;
                }


                if (
                    current.status ===
                    "ACCEPTED" ||

                    current.status ===
                    "REJECTED"
                ) {

                    clearInterval(
                        donationStatusInterval
                    );

                    return;
                }


                refreshDonationStatusFromBackend();

            },
            3000
        );
}


// ============================================================
// DONOR STATUS UI
// ============================================================

function updateDonorStatusUI(status) {

    const statusBadge =
        getEl("statusBadge");

    const expiredNotice =
        getEl("expiredNotice");


    if (!statusBadge) {
        return;
    }


    if (status === "ACCEPTED") {

        statusBadge.textContent =
            "✅ ACCEPTED";


        if (expiredNotice) {
            hide(expiredNotice);
        }


        return;
    }


    if (status === "REJECTED") {

        statusBadge.textContent =
            "❌ REJECTED";


        if (expiredNotice) {
            hide(expiredNotice);
        }


        return;
    }


    if (status === "EXPIRED") {

        statusBadge.textContent =
            "⚠️ EXPIRED";


        if (expiredNotice) {
            show(expiredNotice);
        }


        return;
    }


    let statusText =
        status ||
        "WAITING_FOR_NGO";


    statusText =
        statusText.replaceAll(
            "_",
            " "
        );


    statusBadge.textContent =
        "⏳ " + statusText;


    if (expiredNotice) {
        hide(expiredNotice);
    }
}


// ============================================================
// DONATION COUNTDOWN
// ============================================================

function startDonationCountdown(donation) {

    const countdownElement =
        getEl("countdownTimer");

    const countdownBar =
        getEl("countdownBarFill");


    if (!countdownElement) {
        return;
    }


    if (donationCountdownInterval) {

        clearInterval(
            donationCountdownInterval
        );
    }


    if (!donation.deadline) {

        countdownElement.textContent =
            "--:--";

        return;
    }


    const totalTime =
        10 * 60 * 1000;


    function updateCountdown() {

        const currentDonation =
            getCurrentDonation();


        if (!currentDonation) {
            return;
        }


        if (
            currentDonation.status ===
            "ACCEPTED" ||

            currentDonation.status ===
            "REJECTED"
        ) {

            countdownElement.textContent =
                "DONE";

            if (countdownBar) {
                countdownBar.style.width =
                    "0%";
            }

            return;
        }


        if (
            currentDonation.status ===
            "EXPIRED"
        ) {

            countdownElement.textContent =
                "00:00";

            if (countdownBar) {
                countdownBar.style.width =
                    "0%";
            }

            return;
        }


        const remaining =
            currentDonation.deadline -
            Date.now();


        if (remaining <= 0) {

            countdownElement.textContent =
                "00:00";


            if (countdownBar) {

                countdownBar.style.width =
                    "0%";
            }


            if (!expiryRequestSent) {

                expiryRequestSent = true;

                expireDonationFromBackend(
                    currentDonation.id
                );
            }


            return;
        }


        const minutes =
            Math.floor(
                remaining /
                (1000 * 60)
            );


        const seconds =
            Math.floor(
                (
                    remaining %
                    (1000 * 60)
                ) /
                1000
            );


        countdownElement.textContent =
            String(minutes).padStart(
                2,
                "0"
            ) +
            ":" +
            String(seconds).padStart(
                2,
                "0"
            );


        if (countdownBar) {

            const percentage =
                Math.max(
                    0,
                    Math.min(
                        100,
                        (
                            remaining /
                            totalTime
                        ) * 100
                    )
                );


            countdownBar.style.width =
                percentage + "%";
        }
    }


    updateCountdown();


    donationCountdownInterval =
        setInterval(
            updateCountdown,
            1000
        );
}


// ============================================================
// REFRESH DONATION STATUS FROM BACKEND
// ============================================================

async function refreshDonationStatusFromBackend() {

    const donation =
        getCurrentDonation();


    if (
        !donation ||
        !donation.id
    ) {

        console.log(
            "No donation ID found"
        );

        return;
    }


    const token =
        localStorage.getItem(
            "jwtToken"
        );


    if (!token) {

        window.location.href =
            "login.html";

        return;
    }


    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/api/donations/" +
                donation.id,
                {
                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            localStorage.removeItem(
                "jwtToken"
            );

            window.location.href =
                "login.html";

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Failed to get donation status"
            );
        }


        const updatedDonation =
            await response.json();


        console.log(
            "UPDATED DONATION FROM BACKEND:",
            updatedDonation
        );


        donation.status =
            updatedDonation.status;


        donation.freshnessScore =
            updatedDonation.freshnessScore;

        donation.freshnessStatus =
            updatedDonation.freshnessStatus;

        donation.expectedExpiry =
            updatedDonation.expectedExpiry;

        donation.estimatedExpiry =
            updatedDonation.estimatedExpiry;

        donation.aiMessage =
            updatedDonation.aiMessage;


        saveCurrentDonation(
            donation
        );


        updateLocalDonation(
            updatedDonation
        );


        updateDonorStatusUI(
            updatedDonation.status
        );


        // If accepted/rejected, stop countdown
        if (
            updatedDonation.status ===
            "ACCEPTED" ||

            updatedDonation.status ===
            "REJECTED"
        ) {

            if (donationCountdownInterval) {

                clearInterval(
                    donationCountdownInterval
                );
            }


            if (donationStatusInterval) {

                clearInterval(
                    donationStatusInterval
                );
            }
        }


        console.log(
            "DONOR STATUS:",
            updatedDonation.status
        );

    } catch (error) {

        console.error(
            "Error refreshing donation status:",
            error
        );
    }
}


// ============================================================
// EXPIRE DONATION FROM BACKEND
// ============================================================

async function expireDonationFromBackend(
    donationId
) {

    const token =
        localStorage.getItem(
            "jwtToken"
        );


    if (
        !token ||
        !donationId
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/api/donations/" +
                donationId +
                "/expire",
                {
                    method: "PUT",

                    headers: {

                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to expire donation"
            );
        }


        const updatedDonation =
            await response.json();


        console.log(
            "EXPIRY RESPONSE:",
            updatedDonation
        );


        updateLocalDonation(
            updatedDonation
        );


        const current =
            getCurrentDonation();


        if (current) {

            current.status =
                updatedDonation.status;

            saveCurrentDonation(
                current
            );
        }


        updateDonorStatusUI(
            updatedDonation.status
        );

    } catch (error) {

        console.error(
            "Expiry update error:",
            error
        );

        expiryRequestSent = false;
    }
}


// ============================================================
// NGO REGISTRATION
// ============================================================

function initNgoRegisterPage() {

    const form = getEl("ngoRegisterForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        // Get NGO details from form
        const ngoName =
            getEl("ngoName")?.value.trim() || "";

        const email =
            getEl("ngoEmail")?.value.trim() || "";

        const phone =
            getEl("ngoPhone")?.value.trim() || "";

        // Basic validation
        if (!ngoName || !email || !phone) {
            alert("Please fill all required NGO details.");
            return;
        }

        // Register NGO in backend
        try {

            const response = await fetch(
                API_BASE_URL + "/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: ngoName,
                        email: email,
                        password: "NGO@123",
                        role: "NGO"
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    data.error ||
                    "NGO registration failed."
                );

                return;
            }

            // Save NGO details locally for dashboard display
            const ngo = {

                name: ngoName,
                email: email,
                phone: phone,

                location:
                    getEl("ngoCity")?.value.trim() || "",

                capacity:
                    getEl("ngoCapacity")?.value || "",

                registeredAt:
                    new Date().toISOString()
            };

            localStorage.setItem(
                NGO_KEY,
                JSON.stringify(ngo)
            );

            alert(
                "NGO registered successfully."
            );

            window.location.href = "ngo.html";

        } catch (error) {

            console.error(
                "NGO Registration Error:",
                error
            );

            alert(
                "Unable to connect to the backend."
            );
        }
    });
}
// ============================================================
// NGO DASHBOARD
// ============================================================

async function initNgoDashboardPage() {
      startNgoAutoRefresh();
    const token =
        localStorage.getItem(
            "jwtToken"
        );


    if (!token) {

        window.location.href =
            "login.html";

        return;
    }


    const grid =
        getEl("dashCardsGrid");


    if (!grid) {

        console.log(
            "NGO donation grid not found"
        );

        return;
    }


    console.log(
        "Loading real donations from backend..."
    );


    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/api/donations",
                {
                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            localStorage.removeItem(
                "jwtToken"
            );

            alert(
                "Session expired. Please login again."
            );

            window.location.href =
                "login.html";

            return;
        }


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                "Backend error: " +
                errorText
            );
        }


        const donations =
            await response.json();


        console.log(
            "================================"
        );

        console.log(
            "REAL DONATIONS FROM BACKEND:"
        );

        console.log(
            donations
        );

        console.log(
            "================================"
        );


        grid.innerHTML = "";


        // ====================================================
        // ONLY DONATIONS WAITING FOR NGO
        // ====================================================

        const availableDonations =
            donations.filter(
                function (donation) {

                    return donation.status ===
                        "WAITING_FOR_NGO";
                }
            );


        setText(
            "resultsCount",
            "Showing " +
            availableDonations.length +
            " donations"
        );


        if (
            availableDonations.length ===
            0
        ) {

            grid.innerHTML = `

                <div class="no-results">

                    <div class="no-results-icon">
                        🍱
                    </div>

                    <h3>
                        No available donations
                    </h3>

                    <p>
                        No food is currently waiting
                        for NGO acceptance.
                    </p>

                </div>
            `;

            return;
        }


        // ====================================================
        // CREATE REAL DONATION CARDS
        // ====================================================

        availableDonations.forEach(
            function (donation) {

                const score =
                    donation.freshnessScore ??
                    0;


                const freshnessStatus =
                    donation.freshnessStatus ||
                    "UNKNOWN";


                const statusText =
                    freshnessStatus.replaceAll(
                        "_",
                        " "
                    );


                let ribbonClass =
                    "fresh";


                let ribbonIcon =
                    "✅";


                if (score < 70) {

                    ribbonClass =
                        "expiring";

                    ribbonIcon =
                        "⚠️";
                }


                const category =
                    donation.foodCategory
                        ? donation.foodCategory
                            .replaceAll(
                                "_",
                                " "
                            )
                        : "OTHER";


                const preparation =
                    donation.preparationType
                        ? donation.preparationType
                            .replaceAll(
                                "_",
                                " "
                            )
                        : "--";


                const storage =
                    donation.storageCondition
                        ? donation.storageCondition
                            .replaceAll(
                                "_",
                                " "
                            )
                        : "--";


                const expiry =
                    donation.expectedExpiry
                        ? formatDateTime(
                            donation.expectedExpiry
                        )
                        : "--";


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "donation-card";


                card.dataset.category =
                    category;


                card.dataset.status =
                    statusText;


                card.dataset.donationId =
                    donation.id;


                card.innerHTML = `

                    <div class="
                        card-ribbon
                        ${ribbonClass}
                    ">

                        ${ribbonIcon}

                        ${escapeHtml(
                            statusText
                        )}

                    </div>


                    <div class="card-header">

                        <h3 class="card-food-name">

                            ${escapeHtml(
                                donation.foodName ||
                                "--"
                            )}

                        </h3>


                        <span class="
                            card-category-badge
                        ">

                            🍲

                            ${escapeHtml(
                                category
                            )}

                        </span>

                    </div>


                    <div class="card-body">

                        <div class="card-detail">

                            <span class="detail-icon">
                                ⚖️
                            </span>

                            <span class="detail-label">
                                Quantity
                            </span>

                            <span class="detail-value">

                                ${escapeHtml(
                                    donation.quantity ||
                                    "--"
                                )}

                            </span>

                        </div>


                        <div class="card-detail">

                            <span class="detail-icon">
                                👥
                            </span>

                            <span class="detail-label">
                                Serves
                            </span>

                            <span class="detail-value">

                                ${
                                    donation.numberOfPeople ??
                                    "--"
                                }
                                people

                            </span>

                        </div>


                        <div class="card-detail">

                            <span class="detail-icon">
                                🍲
                            </span>

                            <span class="detail-label">
                                Prep Type
                            </span>

                            <span class="detail-value">

                                ${escapeHtml(
                                    preparation
                                )}

                            </span>

                        </div>


                        <div class="card-detail">

                            <span class="detail-icon">
                                ❄️
                            </span>

                            <span class="detail-label">
                                Storage
                            </span>

                            <span class="detail-value">

                                ${escapeHtml(
                                    storage
                                )}

                            </span>

                        </div>


                        <div class="card-detail">

                            <span class="detail-icon">
                                ⏰
                            </span>

                            <span class="detail-label">
                                Expires
                            </span>

                            <span class="
                                detail-value
                                expiry-warning
                            ">

                                ${escapeHtml(
                                    expiry
                                )}

                            </span>

                        </div>


                        <div class="card-detail">

                            <span class="detail-icon">
                                📍
                            </span>

                            <span class="detail-label">
                                Location
                            </span>

                            <span class="detail-value">

                                ${escapeHtml(
                                    donation.location ||
                                    "--"
                                )}

                            </span>

                        </div>

                    </div>


                    <div class="
                        freshness-bar-container
                    ">

                        <span class="
                            freshness-bar-label
                        ">

                            AI Freshness

                        </span>


                        <div class="
                            freshness-bar
                        ">

                            <div class="
                                freshness-fill
                                ${
                                    score >= 70
                                        ? "fresh-fill"
                                        : "warning-fill"
                                }
                            " style="
                                width:${score}%;
                            ">

                            </div>

                        </div>


                        <span class="
                            freshness-percent
                        ">

                            ${score}/100

                        </span>

                    </div>


                    <div class="card-donor">

                        <span class="donor-icon">
                            👤
                        </span>


                        <span>

                            ${escapeHtml(
                                donation.donorName ||
                                "--"
                            )}

                        </span>


                        <span class="donor-phone">

                            📞

                            ${escapeHtml(
                                donation.contact ||
                                "--"
                            )}

                        </span>

                    </div>


                    <div class="card-actions">

                        <button
                            type="button"
                            class="
                                btn
                                btn-success
                                btn-card
                            "
                            data-action="accept"
                            data-donation-id="${
                                donation.id
                            }"
                        >

                            ✅ Accept

                        </button>


                        <button
                            type="button"
                            class="
                                btn
                                btn-danger
                                btn-card
                            "
                            data-action="reject"
                            data-donation-id="${
                                donation.id
                            }"
                        >

                            ✕ Reject

                        </button>

                    </div>
                `;


                // =================================================
                // ACCEPT BUTTON
                // =================================================

                const acceptButton =
                    card.querySelector(
                        '[data-action="accept"]'
                    );


                if (acceptButton) {

                    acceptButton.addEventListener(
                        "click",
                        function () {

                            handleRealDonationAction(
                                donation.id,
                                "accept"
                            );
                        }
                    );
                }


                // =================================================
                // REJECT BUTTON
                // =================================================

                const rejectButton =
                    card.querySelector(
                        '[data-action="reject"]'
                    );


                if (rejectButton) {

                    rejectButton.addEventListener(
                        "click",
                        function () {

                            handleRealDonationAction(
                                donation.id,
                                "reject"
                            );
                        }
                    );
                }


                grid.appendChild(
                    card
                );
            }
        );


        // ====================================================
        // SEARCH
        // ====================================================

        const searchEl =
            getEl("dashSearch");


        if (searchEl) {

            searchEl.oninput =
                filterRealDonations;
        }


        // ====================================================
        // CATEGORY
        // ====================================================

        const categoryEl =
            getEl("dashCategory");


        if (categoryEl) {

            categoryEl.onchange =
                filterRealDonations;
        }


        // ====================================================
        // FRESHNESS
        // ====================================================

        const freshnessEl =
            getEl("dashFreshness");


        if (freshnessEl) {

            freshnessEl.onchange =
                filterRealDonations;
        }


    } catch (error) {

        console.error(
            "Error loading donations:",
            error
        );


        grid.innerHTML = `

            <div class="no-results">

                <div class="no-results-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to load donations
                </h3>

                <p>
                    ${escapeHtml(
                        error.message
                    )}
                </p>

                <p>
                    Please make sure Spring Boot
                    is running on port 8080.
                </p>

            </div>
        `;
    }
}

startNgoAutoRefresh();
// ============================================================
// FILTER NGO DONATIONS
// ============================================================

function filterRealDonations() {

    const searchEl =
        getEl("dashSearch");

    const categoryEl =
        getEl("dashCategory");

    const freshnessEl =
        getEl("dashFreshness");

    const grid =
        getEl("dashCardsGrid");


    if (!grid) {
        return;
    }


    const search =
        searchEl
            ? searchEl.value
                .toLowerCase()
                .trim()
            : "";


    const category =
        categoryEl
            ? categoryEl.value
            : "";


    const freshness =
        freshnessEl
            ? freshnessEl.value
            : "";


    const cards =
        grid.querySelectorAll(
            ".donation-card"
        );


    let visibleCount =
        0;


    cards.forEach(
        function (card) {

            const foodName =
                card.querySelector(
                    ".card-food-name"
                )
                ?.textContent
                .toLowerCase() ||
                "";


            const location =
                card.querySelector(
                    ".detail-value"
                )
                ?.textContent
                .toLowerCase() ||
                "";


            const cardCategory =
                card.dataset.category ||
                "";


            const cardStatus =
                card.dataset.status ||
                "";


            const matchesSearch =
                foodName.includes(search) ||
                location.includes(search);


            const matchesCategory =
                !category ||
                cardCategory
                    .toLowerCase() ===
                category
                    .replaceAll(
                        "_",
                        " "
                    )
                    .toLowerCase();


            const matchesFreshness =
                !freshness ||
                cardStatus
                    .toLowerCase() ===
                freshness
                    .replaceAll(
                        "_",
                        " "
                    )
                    .toLowerCase();


            if (
                matchesSearch &&
                matchesCategory &&
                matchesFreshness
            ) {

                card.style.display =
                    "";

                visibleCount++;

            } else {

                card.style.display =
                    "none";
            }
        }
    );


    setText(
        "resultsCount",
        "Showing " +
        visibleCount +
        " donations"
    );


    const noResults =
        getEl("noResults");


    if (noResults) {

        if (visibleCount === 0) {

            show(noResults);

        } else {

            hide(noResults);
        }
    }
}


// ============================================================
// NGO ACCEPT / REJECT
// ============================================================

async function handleRealDonationAction(
    donationId,
    action
) {

    console.log(
        "================================"
    );

    console.log(
        "NGO ACTION"
    );

    console.log(
        "Donation ID:",
        donationId
    );

    console.log(
        "Action:",
        action
    );

    console.log(
        "================================"
    );


    const token =
        localStorage.getItem(
            "jwtToken"
        );


    if (!token) {

        alert(
            "Please login as NGO first."
        );

        window.location.href =
            "login.html";

        return;
    }


    if (!donationId) {

        alert(
            "Donation ID is missing."
        );

        console.error(
            "Donation ID is missing"
        );

        return;
    }


    const status =
        action === "accept"
            ? "ACCEPTED"
            : "REJECTED";


    try {

        const url =
            API_BASE_URL +
            "/api/donations/" +
            donationId +
            "/status?status=" +
            status;


        console.log(
            "PUT request:",
            url
        );


        const response =
            await fetch(
                url,
                {
                    method: "PUT",

                    headers: {

                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        console.log(
            "Backend response:",
            response.status
        );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            localStorage.removeItem(
                "jwtToken"
            );

            alert(
                "Session expired. Please login again."
            );

            window.location.href =
                "login.html";

            return;
        }


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Backend error:",
                errorText
            );

            throw new Error(
                "Backend returned " +
                response.status +
                ": " +
                errorText
            );
        }


        const updatedDonation =
            await response.json();


        console.log(
            "DONATION SUCCESSFULLY UPDATED:",
            updatedDonation
        );


        if (action === "accept") {

            alert(
                "✅ Food donation accepted successfully!"
            );

        } else {

            alert(
                "❌ Food donation rejected."
            );
        }


        // ====================================================
        // IMPORTANT:
        // Reload backend data.
        // ACCEPTED donation disappears from NGO list.
        // ====================================================

        await initNgoDashboardPage();

    } catch (error) {

        console.error(
            "ACCEPT / REJECT ERROR:",
            error
        );


        alert(
            "Unable to update donation.\n\n" +
            error.message
        );
    }
}


// ============================================================
// NGO RESPONSE PAGE
// ============================================================

function initNgoResponsePage() {

    console.log(
        "NGO response page loaded"
    );
}


// ============================================================
// MY DONATIONS PAGE
// ============================================================

function initMyDonationsPage() {

    const token = localStorage.getItem("jwtToken");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    fetch(API_BASE_URL + "/api/donations", {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(response => response.json())
    .then(donations => {

        const tbody = document.getElementById("myDonationsTbody");

        if (!tbody) return;

        tbody.innerHTML = "";

        donations.forEach(donation => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${donation.id}</td>
                <td>${donation.foodName || "-"}</td>
                <td>${donation.quantity || "-"}</td>
                <td>${donation.freshnessScore || 0}/100</td>
                <td>${donation.freshnessStatus || "-"}</td>
                <td>${donation.status || "-"}</td>
                <td>${donation.createdAt ? new Date(donation.createdAt).toLocaleString() : "-"}</td>
                <td>${donation.status === "ACCEPTED" ? "Accepted by NGO" :
                       donation.status === "REJECTED" ? "Rejected by NGO" :
                       "Waiting for response"}</td>
                <td>-</td>
            `;

            tbody.appendChild(row);
        });
    })
    .catch(error => {
        console.error("My Donations Error:", error);
    });
}

// ============================================================
// RESTORE VERIFY FORM
// ============================================================

function restoreVerifyForm(data) {

    if (!data) {
        return;
    }


    const donorName =
        getEl("donorName");

    if (donorName) {
        donorName.value =
            data.donorName || "";
    }


    const contactNumber =
        getEl("contactNumber");

    if (contactNumber) {
        contactNumber.value =
            data.contactNumber || "";
    }


    const location =
        getEl("location");

    if (location) {
        location.value =
            data.location || "";
    }


    const foodName =
        getEl("foodName");

    if (foodName) {
        foodName.value =
            data.foodName || "";
    }


    const foodCategory =
        getEl("foodCategory");

    if (foodCategory) {
        foodCategory.value =
            data.foodCategory || "";
    }


    const quantity =
        getEl("quantity");

    if (quantity) {
        quantity.value =
            data.quantity || "";
    }


    const servings =
        getEl("servings");

    if (servings) {
        servings.value =
            data.servings || "";
    }


    const prepDateTime =
        getEl("prepDateTime");

    if (prepDateTime) {
        prepDateTime.value =
            data.prepDateTime || "";
    }


    const expiryDateTime =
        getEl("expiryDateTime");

    if (expiryDateTime) {
        expiryDateTime.value =
            data.expiryDateTime || "";
    }


    document
        .querySelectorAll(
            'input[name="prepType"]'
        )
        .forEach(
            function (radio) {

                radio.checked =
                    radio.value ===
                    data.prepType;
            }
        );


    document
        .querySelectorAll(
            'input[name="storageCondition"]'
        )
        .forEach(
            function (radio) {

                radio.checked =
                    radio.value ===
                    data.storageCondition;
            }
        );
}


// ============================================================
// COMMON FEATURES
// ============================================================

function initCommonFeatures() {

    const mobileMenu =
        getEl("mobileMenu");

    const navMenu =
        getEl("navMenu");


    if (
        mobileMenu &&
        navMenu
    ) {

        mobileMenu.addEventListener(
            "click",
            function () {

                navMenu.classList.toggle(
                    "active"
                );
            }
        );
    }
}
// ============================================================
// AUTO REFRESH NGO DASHBOARD
// ============================================================

