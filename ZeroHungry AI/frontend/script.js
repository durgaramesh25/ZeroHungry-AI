/**
 * ═══════════════════════════════════════════════════════════════
 *  ZeroHungry AI – script.js
 *  Frontend interactions only. No backend connection yet.
 *
 *  TABLE OF CONTENTS
 *  ─────────────────
 *  1.  Utility helpers       (getElementById shortcuts, show/hide)
 *  2.  Page detection        (which HTML page is currently open)
 *  3.  Donor form page       (validation, image preview, submission)
 *  4.  NGO page              (card Accept/Reject, search/filter)
 *  5.  Result page           (simulate loading, populate demo data)
 *  6.  Toa"use strict";

/* =========================================================
   ZEROHUNGRY AI - FRONTEND SCRIPT
   Connected to Spring Boot backend
   ========================================================= */

const API_BASE_URL = "http://localhost:8080";


/* =========================================================
   1. COMMON HELPERS
   ========================================================= */

function getEl(id) {
    return document.getElementById(id);
}

function show(element) {
    if (element) {
        element.classList.remove("hidden");
    }
}

function hide(element) {
    if (element) {
        element.classList.add("hidden");
    }
}

function setTextById(id, value) {
    const element = getEl(id);

    if (element) {
        element.textContent =
            value === null || value === undefined
                ? "-"
                : value;
    }
}


/* =========================================================
   2. PAGE DETECTION
   ========================================================= */

const currentPage = (function () {

    if (getEl("verifyForm")) {
        return "index";
    }

    if (getEl("donationForm")) {
        return "donor";
    }

    if (getEl("donationsGrid")) {
        return "ngo";
    }

    return "unknown";

})();


document.addEventListener("DOMContentLoaded", function () {

    if (currentPage === "index") {
        initIndexPage();
    }

    if (currentPage === "donor") {
        initDonorPage();
    }

    if (currentPage === "ngo") {
        initNgoPage();
    }

});


/* =========================================================
   3. INDEX PAGE
   FOOD FRESHNESS VERIFICATION
   ========================================================= */

function initIndexPage() {

    const form = getEl("verifyForm");

    if (!form) {
        return;
    }


    /* -----------------------------------------------------
       IMAGE PREVIEW
       ----------------------------------------------------- */

    const foodImageInput = getEl("foodImage");
    const imagePreview = getEl("imgPreview");
    const imagePreviewWrap = getEl("imgPreviewWrap");
    const fileNameDisplay = getEl("fileNameDisplay");
    const removeImageBtn = getEl("removeImgBtn");


    if (foodImageInput) {

        foodImageInput.addEventListener(
            "change",
            function () {

                const file = this.files[0];

                if (!file) {
                    return;
                }

                if (!file.type.startsWith("image/")) {

                    showError(
                        "foodImage",
                        "Please select an image file."
                    );

                    this.value = "";

                    return;
                }


                if (file.size > 5 * 1024 * 1024) {

                    showError(
                        "foodImage",
                        "Maximum image size is 5 MB."
                    );

                    this.value = "";

                    return;
                }


                clearError("foodImage");


                if (fileNameDisplay) {
                    fileNameDisplay.textContent =
                        file.name;
                }


                const reader = new FileReader();


                reader.onload = function (event) {

                    if (imagePreview) {
                        imagePreview.src =
                            event.target.result;
                    }

                    if (imagePreviewWrap) {
                        show(imagePreviewWrap);
                    }

                };


                reader.readAsDataURL(file);

            }
        );

    }


    /* -----------------------------------------------------
       REMOVE IMAGE
       ----------------------------------------------------- */

    if (removeImageBtn) {

        removeImageBtn.addEventListener(
            "click",
            function () {

                if (foodImageInput) {
                    foodImageInput.value = "";
                }

                if (imagePreview) {
                    imagePreview.src = "";
                }

                if (imagePreviewWrap) {
                    hide(imagePreviewWrap);
                }

                if (fileNameDisplay) {
                    fileNameDisplay.textContent =
                        "Click to upload or drag & drop";
                }

            }
        );

    }


    /* -----------------------------------------------------
       CLEAR FORM
       ----------------------------------------------------- */

    const clearBtn = getEl("clearFormBtn");

    if (clearBtn) {

        clearBtn.addEventListener(
            "click",
            function () {

                form.reset();

                clearAllErrors();

                if (imagePreview) {
                    imagePreview.src = "";
                }

                if (imagePreviewWrap) {
                    hide(imagePreviewWrap);
                }

                if (fileNameDisplay) {
                    fileNameDisplay.textContent =
                        "Click to upload or drag & drop";
                }

                hide(getEl("resultPanel"));

            }
        );

    }


    /* -----------------------------------------------------
       VERIFY ANOTHER FOOD
       ----------------------------------------------------- */

    const verifyAnotherBtn =
        getEl("verifyAnotherBtn");


    if (verifyAnotherBtn) {

        verifyAnotherBtn.addEventListener(
            "click",
            function () {

                form.reset();

                clearAllErrors();

                hide(getEl("resultPanel"));

                if (imagePreview) {
                    imagePreview.src = "";
                }

                if (imagePreviewWrap) {
                    hide(imagePreviewWrap);
                }

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


    /* -----------------------------------------------------
       FORM SUBMIT
       ----------------------------------------------------- */

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            console.log(
                "1. Verify button clicked"
            );


            /* VALIDATE */

            if (!validateVerifyForm()) {

                console.log(
                    "Validation failed"
                );

                return;
            }


            console.log(
                "2. Validation successful"
            );


            /* COLLECT FORM DATA */

            const formData =
                collectVerifyFormData();


            console.log(
                "3. Form data:",
                formData
            );


            /* SHOW RESULT PANEL */

            const resultPanel =
                getEl("resultPanel");

            const resultLoading =
                getEl("resultLoading");

            const resultContent =
                getEl("resultContent");


            show(resultPanel);

            show(resultLoading);

            hide(resultContent);


            resultPanel.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


            /* -------------------------------------------------
               SEND DATA TO SPRING BOOT
               ------------------------------------------------- */

            try {

                console.log(
                    "4. Sending data to Spring Boot..."
                );


                const token =
                    localStorage.getItem(
                        "jwtToken"
                    );


                if (!token) {

                    throw new Error(
                        "Please login before submitting a donation."
                    );

                }


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
                                    formData
                                )

                        }
                    );


                console.log(
                    "5. Backend status:",
                    response.status
                );


                /* ---------------------------------------------
                   HANDLE AUTH ERROR
                   --------------------------------------------- */

                if (response.status === 401) {

                    throw new Error(
                        "Your login session expired. Please login again."
                    );

                }


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Backend request failed."
                    );

                }


                /* ---------------------------------------------
                   READ BACKEND JSON
                   --------------------------------------------- */

                const savedDonation =
                    await response.json();


                console.log(
                    "6. Backend response:",
                    savedDonation
                );


                /* ---------------------------------------------
                   HIDE LOADING
                   --------------------------------------------- */

                hide(resultLoading);

                show(resultContent);


                /* ---------------------------------------------
                   DISPLAY REAL BACKEND RESULT
                   --------------------------------------------- */

                displayBackendResult(
                    savedDonation
                );


                console.log(
                    "7. Backend result displayed successfully."
                );


            } catch (error) {

                console.error(
                    "Backend error:",
                    error
                );


                hide(resultLoading);

                show(resultContent);


                resultContent.innerHTML = `

                    <div class="result-card">

                        <div class="result-header">

                            <h2>
                                ❌ Verification Failed
                            </h2>

                            <p>
                                ${escapeHtml(
                                    error.message
                                )}
                            </p>

                        </div>

                        <div class="safety-msg-box">

                            <strong>
                                Backend Connection
                            </strong>

                            <p>
                                Make sure Spring Boot is
                                running on localhost:8080
                                and you are logged in.
                            </p>

                        </div>

                    </div>

                `;

            }

        }
    );


    /* -----------------------------------------------------
       CLEAR ERRORS WHILE TYPING
       ----------------------------------------------------- */

    form
        .querySelectorAll(
            "input, select"
        )
        .forEach(function (input) {

            input.addEventListener(
                "input",
                function () {

                    clearError(
                        this.id
                    );

                }
            );

            input.addEventListener(
                "change",
                function () {

                    clearError(
                        this.id
                    );

                }
            );

        });

}


/* =========================================================
   4. VALIDATION
   ========================================================= */

function validateVerifyForm() {

    let valid = true;


    function fail(
        id,
        message
    ) {

        showError(
            id,
            message
        );

        valid = false;

    }


    /* DONOR NAME */

    const donorName =
        getEl("donorName")?.value.trim() || "";

    if (!donorName) {

        fail(
            "donorName",
            "Please enter donor name."
        );

    }


    /* CONTACT */

    const contact =
        getEl("contactNumber")?.value.trim() || "";

    if (!contact) {

        fail(
            "contactNumber",
            "Please enter contact number."
        );

    } else if (
        !/^\d{10}$/.test(contact)
    ) {

        fail(
            "contactNumber",
            "Enter a valid 10-digit number."
        );

    }


    /* LOCATION */

    const location =
        getEl("location")?.value.trim() || "";

    if (!location) {

        fail(
            "location",
            "Please enter pickup location."
        );

    }


    /* FOOD NAME */

    const foodName =
        getEl("foodName")?.value.trim() || "";

    if (!foodName) {

        fail(
            "foodName",
            "Please enter food name."
        );

    }


    /* FOOD CATEGORY */

    const foodCategory =
        getEl("foodCategory")?.value || "";

    if (!foodCategory) {

        fail(
            "foodCategory",
            "Please select food category."
        );

    }


    /* QUANTITY */

    const quantity =
        getEl("quantity")?.value.trim() || "";

    if (!quantity) {

        fail(
            "quantity",
            "Please enter quantity."
        );

    }


    /* SERVINGS */

    const servings =
        getEl("servings")?.value || "";

    if (!servings) {

        fail(
            "servings",
            "Please enter number of people."
        );

    } else if (
        parseInt(servings) < 1
    ) {

        fail(
            "servings",
            "Number of people must be at least 1."
        );

    }


    /* PREPARATION TYPE */

    const prepType =
        document.querySelector(
            'input[name="prepType"]:checked'
        );


    if (!prepType) {

        showError(
            "prepType",
            "Please select preparation type."
        );

        valid = false;

    }


    /* STORAGE */

    const storageCondition =
        document.querySelector(
            'input[name="storageCondition"]:checked'
        );


    if (!storageCondition) {

        showError(
            "storageCondition",
            "Please select storage condition."
        );

        valid = false;

    }


    /* PREPARATION TIME */

    const prepDateTime =
        getEl("prepDateTime")?.value || "";

    if (!prepDateTime) {

        fail(
            "prepDateTime",
            "Please select preparation date and time."
        );

    }


    /* EXPIRY */

    const expiryDateTime =
        getEl("expiryDateTime")?.value || "";

    if (!expiryDateTime) {

        fail(
            "expiryDateTime",
            "Please select expected expiry."
        );

    }


    /* EXPIRY MUST BE AFTER PREPARATION */

    if (
        prepDateTime &&
        expiryDateTime
    ) {

        const prep =
            new Date(prepDateTime);

        const expiry =
            new Date(expiryDateTime);


        if (expiry <= prep) {

            fail(
                "expiryDateTime",
                "Expiry must be after preparation time."
            );

        }

    }


    /* IMAGE */

    const imageInput =
        getEl("foodImage");


    if (
        !imageInput ||
        !imageInput.files ||
        imageInput.files.length === 0
    ) {

        fail(
            "foodImage",
            "Please upload a food image."
        );

    }


    if (!valid) {

        const firstError =
            document.querySelector(
                ".input-error"
            );

        if (firstError) {

            firstError.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    }


    return valid;

}


/* =========================================================
   5. COLLECT FORM DATA
   ========================================================= */

function collectVerifyFormData() {

    const prepType =
        document.querySelector(
            'input[name="prepType"]:checked'
        );


    const storageCondition =
        document.querySelector(
            'input[name="storageCondition"]:checked'
        );


    /*
     * IMPORTANT:
     * Frontend values are converted to the
     * exact enum names expected by Java.
     */

    return {

        donorName:
            getEl("donorName")
                ?.value.trim() || "",


        foodName:
            getEl("foodName")
                ?.value.trim() || "",


        foodCategory:
            convertFoodCategory(
                getEl("foodCategory")
                    ?.value || ""
            ),


        quantity:
            getEl("quantity")
                ?.value.trim() || "",


        numberOfPeople:
            parseInt(
                getEl("servings")
                    ?.value || "0"
            ),


        preparationType:
            convertPreparationType(
                prepType?.value || ""
            ),


        preparationDateTime:
            getEl("prepDateTime")
                ?.value || "",


        storageCondition:
            convertStorageCondition(
                storageCondition?.value || ""
            ),


        expectedExpiry:
            getEl("expiryDateTime")
                ?.value || "",


        foodImagePath:
            getEl("foodImage")
                ?.files?.[0]?.name || "",


        location:
            getEl("location")
                ?.value.trim() || "",


        contact:
            getEl("contactNumber")
                ?.value.trim() || ""

    };

}


/* =========================================================
   6. CONVERT FRONTEND VALUES TO JAVA ENUM VALUES
   ========================================================= */

function convertFoodCategory(value) {

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


    return map[value] || "OTHER";

}


function convertPreparationType(value) {

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


    return map[value] || "OTHER";

}


function convertStorageCondition(value) {

    const map = {

        "Room Temperature":
            "ROOM_TEMPERATURE",

        "Refrigerated":
            "REFRIGERATED",

        "Other":
            "OTHER"

    };


    return map[value] || "OTHER";

}


/* =========================================================
   7. DISPLAY REAL SPRING BOOT RESULT
   ========================================================= */

function displayBackendResult(
    donation
) {

    const resultContent =
        getEl("resultContent");


    if (!resultContent) {
        return;
    }


    const score =
        donation.freshnessScore;


    const status =
        donation.freshnessStatus ||
        "UNKNOWN";


    const expiry =
        donation.estimatedExpiry ||
        donation.expectedExpiry ||
        "-";


    const aiMessage =
        donation.aiMessage ||
        "Freshness analysis completed.";


    const foodName =
        donation.foodName ||
        "-";


    const category =
        donation.foodCategory ||
        "-";


    const quantity =
        donation.quantity ||
        "-";


    const people =
        donation.numberOfPeople ??
        "-";


    const preparation =
        donation.preparationType ||
        "-";


    const storage =
        donation.storageCondition ||
        "-";


    const donationId =
        donation.id ||
        "-";


    let statusText = status;


    if (status === "FRESH") {

        statusText =
            "🟢 FRESH";

    } else if (
        status === "MODERATE"
    ) {

        statusText =
            "🟡 MODERATE";

    } else if (
        status === "EXPIRING_SOON"
    ) {

        statusText =
            "🟠 EXPIRING SOON";

    } else if (
        status === "NOT_RECOMMENDED"
    ) {

        statusText =
            "🔴 NOT RECOMMENDED";

    }


    resultContent.innerHTML = `

        <div class="result-card">

            <div class="result-header">

                <h2>
                    🤖 AI Freshness Report
                </h2>

                <p>
                    Food freshness analysis
                    completed successfully.
                </p>

            </div>


            <div class="result-score">

                <span>
                    Freshness Score
                </span>

                <strong>
                    ${escapeHtml(
                        String(score ?? "-")
                    )}/100
                </strong>

            </div>


            <div class="freshness-badge">

                ${escapeHtml(statusText)}

            </div>


            <div class="result-metrics">


                <div class="metric-row">

                    <span class="metric-icon">
                        🍱
                    </span>

                    <span class="metric-lbl">
                        Food
                    </span>

                    <span class="metric-val">
                        ${escapeHtml(
                            foodName
                        )}
                    </span>

                </div>


                <div class="metric-row">

                    <span class="metric-icon">
                        📂
                    </span>

                    <span class="metric-lbl">
                        Category
                    </span>

                    <span class="metric-val">
                        ${escapeHtml(
                            category
                        )}
                    </span>

                </div>


                <div class="metric-row">

                    <span class="metric-icon">
                        ⚖️
                    </span>

                    <span class="metric-lbl">
                        Quantity
                    </span>

                    <span class="metric-val">
                        ${escapeHtml(
                            quantity
                        )}
                    </span>

                </div>


                <div class="metric-row">

                    <span class="metric-icon">
                        👥
                    </span>

                    <span class="metric-lbl">
                        People Served
                    </span>

                    <span class="metric-val">
                        ${escapeHtml(
                            String(people)
                        )}
                    </span>

                </div>


                <div class="metric-row">

                    <span class="metric-icon">
                        🍳
                    </span>

                    <span class="metric-lbl">
                        Preparation
                    </span>

                    <span class="metric-val">
                        ${escapeHtml(
                            preparation
                        )}
                    </span>

                </div>


                <div class="metric-row">

                    <span class="metric-icon">
                        ❄️
                    </span>

                    <span class="metric-lbl">
                        Storage
                    </span>

                    <span class="metric-val">
                        ${escapeHtml(
                            storage
                        )}
                    </span>

                </div>


                <div class="metric-row">

                    <span class="metric-icon">
                        ⏰
                    </span>

                    <span class="metric-lbl">
                        Estimated Expiry
                    </span>

                    <span class="metric-val">
                        ${escapeHtml(
                            formatDateTime(expiry)
                        )}
                    </span>

                </div>


                <div class="metric-row">

                    <span class="metric-icon">
                        🆔
                    </span>

                    <span class="metric-lbl">
                        Donation ID
                    </span>

                    <span class="metric-val">
                        ${escapeHtml(
                            String(donationId)
                        )}
                    </span>

                </div>

            </div>


            <div class="progress-track">

                <div
                    class="progress-fill"
                    style="width:${Number(score) || 0}%">

                </div>

            </div>


            <div class="progress-labels">

                <span>
                    0 – Not Recommended
                </span>

                <span>
                    50
                </span>

                <span>
                    100 – Fresh
                </span>

            </div>


            <div class="safety-msg-box">

                <strong>
                    🤖 AI Analysis
                </strong>

                <p>
                    ${escapeHtml(
                        aiMessage
                    )}
                </p>

            </div>


            <button
                class="btn btn-success btn-lg btn-full"
                id="donateFoodBtn">

                🍱 DONATE THIS FOOD

            </button>


            <button
                class="btn btn-outline btn-full mt8"
                id="verifyAnotherBtn">

                ➕ Verify Another Food

            </button>

        </div>

    `;


    /* -----------------------------------------------------
       DONATE BUTTON
       ----------------------------------------------------- */

    const donateBtn =
        getEl("donateFoodBtn");


    if (donateBtn) {

        donateBtn.addEventListener(
            "click",
            function () {

                alert(
                    "Food donation verified successfully. NGO matching will be connected next."
                );

            }
        );

    }


    /* -----------------------------------------------------
       VERIFY ANOTHER
       ----------------------------------------------------- */

    const verifyAnother =
        getEl("verifyAnotherBtn");


    if (verifyAnother) {

        verifyAnother.addEventListener(
            "click",
            function () {

                const form =
                    getEl("verifyForm");

                if (form) {
                    form.reset();
                }

                hide(
                    getEl("resultPanel")
                );

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }

}


/* =========================================================
   8. DATE FORMAT
   ========================================================= */

function formatDateTime(value) {

    if (!value || value === "-") {
        return "-";
    }


    try {

        const date =
            new Date(value);


        if (isNaN(date.getTime())) {
            return value;
        }


        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    } catch (error) {

        return value;

    }

}


/* =========================================================
   9. ERROR HANDLING
   ========================================================= */

function showError(
    fieldId,
    message
) {

    const error =
        getEl("err-" + fieldId);


    if (error) {

        error.textContent =
            message;

    }


    const input =
        getEl(fieldId);


    if (input) {

        input.classList.add(
            "input-error"
        );

    }

}


function clearError(
    fieldId
) {

    if (!fieldId) {
        return;
    }


    const error =
        getEl("err-" + fieldId);


    if (error) {

        error.textContent = "";

    }


    const input =
        getEl(fieldId);


    if (input) {

        input.classList.remove(
            "input-error"
        );

    }

}


function clearAllErrors() {

    document
        .querySelectorAll(
            ".ferr"
        )
        .forEach(
            function (element) {

                element.textContent =
                    "";

            }
        );


    document
        .querySelectorAll(
            ".input-error"
        )
        .forEach(
            function (element) {

                element.classList.remove(
                    "input-error"
                );

            }
        );

}


/* =========================================================
   10. SECURITY HELPER
   ========================================================= */

function escapeHtml(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value === null ||
        value === undefined
            ? ""
            : String(value);


    return div.innerHTML;

}


/* =========================================================
   11. OLD DONOR PAGE
   Kept so existing donor.html doesn't break.
   ========================================================= */

function initDonorPage() {

    console.log(
        "Donor page loaded."
    );

}


/* =========================================================
   12. OLD NGO PAGE
   Kept so existing ngo.html doesn't break.
   ========================================================= */

function initNgoPage() {

    console.log(
        "NGO page loaded."
    );

}
/**
 * getEl(id)
 * A short way to write document.getElementById(id).
 * Returns the element, or null if it doesn't exist on this page.
 */
function getEl(id) {
    return document.getElementById(id);
}

/**
 * show(element)
 * Makes a hidden element visible by removing the "hidden" CSS class.
 */
function show(element) {
    if (element) element.classList.remove("hidden");
}

/**
 * hide(element)
 * Hides an element by adding the "hidden" CSS class.
 */
function hide(element) {
    if (element) element.classList.add("hidden");
}

/**
 * isHidden(element)
 * Returns true if the element has the "hidden" class.
 */
function isHidden(element) {
    return element ? element.classList.contains("hidden") : true;
}


/* ───────────────────────────────────────────────────────────────
   2. PAGE DETECTION
   The same script.js runs on all 4 pages.
   We check which page we are on, then only run the relevant code.
   We do this by looking for a unique element that only exists
   on that specific page.
─────────────────────────────────────────────────────────────── */

/**
 * currentPage
 * A simple string telling us which page is loaded.
 * Possible values: "index", "donor", "ngo", "result", "unknown"
 *
 * Detection order matters: check the most specific element first.
 *   "verifyForm"    → index.html  (freshness verification page)
 *   "donationForm"  → donor.html  (separate donation form)
 *   "donationsGrid" → ngo.html
 *   "resultContent" → result.html
 */
const currentPage = (function detectPage() {
    if (getEl("verifyForm"))     return "index";
    if (getEl("donationForm"))   return "donor";
    if (getEl("donationsGrid"))  return "ngo";
    if (getEl("resultContent"))  return "result";
    return "unknown";
})();

// Run the correct setup function based on which page we're on.
document.addEventListener("DOMContentLoaded", function () {
    if (currentPage === "index")  initIndexPage();   // ← NEW
    if (currentPage === "donor")  initDonorPage();
    if (currentPage === "ngo")    initNgoPage();
    if (currentPage === "result") initResultPage();
});


/* ═══════════════════════════════════════════════════════════════
   3. DONOR PAGE  (donor.html)
   Handles:
     - Image file upload preview
     - "Clear Form" button
     - Form field validation on submit
     - Success message after submission
═══════════════════════════════════════════════════════════════ */

/**
 * initDonorPage()
 * Called once when donor.html has finished loading.
 * Sets up all event listeners for the donation form.
 */
function initDonorPage() {

    // ── Get references to the elements we need ──────────────────
    const form          = getEl("donationForm");
    const resetBtn      = getEl("resetFormBtn");
    const foodImageInput = getEl("foodImage");
    const fileNameDisplay = getEl("fileNameDisplay");
    const imagePreviewContainer = getEl("imagePreviewContainer");
    const imagePreview  = getEl("imagePreview");
    const removeImageBtn = getEl("removeImageBtn");

    // ── Image preview: show a thumbnail when user picks a file ──
    if (foodImageInput) {
        foodImageInput.addEventListener("change", function () {
            handleImageUpload(this.files[0]);
        });
    }

    /**
     * handleImageUpload(file)
     * Shows a preview of the chosen image file.
     * Uses FileReader to read the image as a data URL (base64 string).
     * @param {File} file – the image file the user selected
     */
    function handleImageUpload(file) {
        if (!file) return;

        // Only allow image files
        if (!file.type.startsWith("image/")) {
            showToast("⚠️ Please select an image file (PNG, JPG, JPEG)", "warning");
            return;
        }

        // Max file size: 5 MB  (5 * 1024 * 1024 bytes)
        if (file.size > 5 * 1024 * 1024) {
            showToast("⚠️ File is too large. Maximum size is 5 MB.", "warning");
            return;
        }

        // FileReader reads the file in the browser (no server needed)
        const reader = new FileReader();

        // This function runs once FileReader has finished reading the file
        reader.onload = function (event) {
            // event.target.result is the base64 data URL of the image
            imagePreview.src = event.target.result;
            fileNameDisplay.textContent = file.name;
            show(imagePreviewContainer);
        };

        reader.readAsDataURL(file); // start reading the file
    }

    // ── Remove image button ──────────────────────────────────────
    if (removeImageBtn) {
        removeImageBtn.addEventListener("click", function () {
            foodImageInput.value = "";          // clear the file input
            imagePreview.src = "";
            fileNameDisplay.textContent = "Click to upload or drag & drop";
            hide(imagePreviewContainer);
        });
    }

    // ── Clear Form button ────────────────────────────────────────
    if (resetBtn) {
        resetBtn.addEventListener("click", function () {
            form.reset();                       // clears all inputs
            clearAllErrors();                   // removes red error highlights
            hide(getEl("formMessage"));
            // Also reset the image preview
            if (imagePreview) imagePreview.src = "";
            if (imagePreviewContainer) hide(imagePreviewContainer);
            if (fileNameDisplay) {
                fileNameDisplay.textContent = "Click to upload or drag & drop";
            }
        });
    }

    // ── Form submission ──────────────────────────────────────────
    if (form) {
        form.addEventListener("submit", function (event) {
            // IMPORTANT: prevents the browser from refreshing the page
            event.preventDefault();

            // Run validation; if it fails, stop here
            if (!validateDonorForm()) return;

            // Collect all the form values into one object
            const donationData = collectFormData();

            // Log to browser DevTools console (press F12 to see)
            console.log("✅ Donation form data collected:", donationData);

            // Show success message (no backend yet)
            showFormSuccess(donationData.foodName, donationData.donorName);

            // NOTE (TODO for Step 3):
            // Replace the line above with a fetch() POST call:
            //
            //   fetch("http://localhost:8080/api/donations", {
            //       method: "POST",
            //       headers: { "Content-Type": "application/json" },
            //       body: JSON.stringify(donationData)
            //   })
            //   .then(response => response.json())
            //   .then(result => {
            //       window.location.href = "result.html";
            //   });
        });
    }

    // ── Clear errors when the user starts typing in a field ─────
    // This removes the red border as soon as they fix the problem.
    const inputs = form ? form.querySelectorAll("input, select") : [];
    inputs.forEach(function (input) {
        input.addEventListener("input", function () {
            clearFieldError(this.id || this.name);
            this.classList.remove("input-error");
        });
    });
}


/**
 * validateDonorForm()
 * Checks every required field. If anything is missing or wrong,
 * it shows a red error message under that field and returns false.
 * Returns true only when everything is valid.
 */
function validateDonorForm() {
    let isValid = true;  // assume valid until we find a problem

    // ── Helper: marks a field as invalid ────────────────────────
    function fail(fieldId, message) {
        const errorEl = getEl("error-" + fieldId);
        const inputEl = getEl(fieldId);
        if (errorEl) errorEl.textContent = message;
        if (inputEl) inputEl.classList.add("input-error");
        isValid = false;
    }

    // ── Donor Name ───────────────────────────────────────────────
    const donorName = (getEl("donorName")?.value || "").trim();
    if (!donorName) {
        fail("donorName", "Please enter your name or organisation.");
    }

    // ── Contact Number ───────────────────────────────────────────
    const contact = (getEl("contactNumber")?.value || "").trim();
    if (!contact) {
        fail("contactNumber", "Please enter a contact number.");
    } else if (!/^\d{10}$/.test(contact)) {
        // Regex: must be exactly 10 digits, nothing else
        fail("contactNumber", "Enter a valid 10-digit mobile number.");
    }

    // ── Location ─────────────────────────────────────────────────
    const location = (getEl("location")?.value || "").trim();
    if (!location) {
        fail("location", "Please enter the pickup location.");
    }

    // ── Food Name ────────────────────────────────────────────────
    const foodName = (getEl("foodName")?.value || "").trim();
    if (!foodName) {
        fail("foodName", "Please enter the food name.");
    }

    // ── Food Category ────────────────────────────────────────────
    const foodCategory = getEl("foodCategory")?.value || "";
    if (!foodCategory) {
        fail("foodCategory", "Please select a food category.");
    }

    // ── Quantity ─────────────────────────────────────────────────
    const quantity = (getEl("quantity")?.value || "").trim();
    if (!quantity) {
        fail("quantity", "Please enter the quantity.");
    }

    // ── Servings ─────────────────────────────────────────────────
    const servings = (getEl("servings")?.value || "").trim();
    if (!servings) {
        fail("servings", "Please enter the number of people.");
    } else if (parseInt(servings) < 1) {
        fail("servings", "Must be at least 1 person.");
    }

    // ── Preparation Type (radio buttons) ─────────────────────────
    // querySelector finds the first checked radio in the group
    const prepTypeChecked = document.querySelector('input[name="prepType"]:checked');
    if (!prepTypeChecked) {
        const errorEl = getEl("error-prepType");
        if (errorEl) errorEl.textContent = "Please select a preparation type.";
        isValid = false;
    }

    // ── Preparation Date & Time ───────────────────────────────────
    const prepDateTime = getEl("prepDateTime")?.value || "";
    if (!prepDateTime) {
        fail("prepDateTime", "Please select preparation date and time.");
    }

    // ── Expiry Date & Time ────────────────────────────────────────
    const expiryDateTime = getEl("expiryDateTime")?.value || "";
    if (!expiryDateTime) {
        fail("expiryDateTime", "Please select expected expiry date and time.");
    }

    // ── Expiry must be AFTER prep time ────────────────────────────
    if (prepDateTime && expiryDateTime) {
        // new Date() converts the string to a JavaScript Date object
        const prepDate   = new Date(prepDateTime);
        const expiryDate = new Date(expiryDateTime);
        if (expiryDate <= prepDate) {
            fail("expiryDateTime", "Expiry must be after the preparation time.");
        }
    }

    // If there are errors, scroll to the first red field
    if (!isValid) {
        const firstError = document.querySelector(".input-error, .field-error:not(:empty)");
        if (firstError) {
            firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    return isValid;
}


/**
 * collectFormData()
 * Reads all filled-in form values and returns them as a plain object.
 * This object will later be converted to JSON and sent to the backend.
 */
function collectFormData() {
    return {
        donorName:    (getEl("donorName")?.value    || "").trim(),
        contactNumber:(getEl("contactNumber")?.value || "").trim(),
        location:     (getEl("location")?.value     || "").trim(),
        foodName:     (getEl("foodName")?.value      || "").trim(),
        foodCategory: getEl("foodCategory")?.value   || "",
        quantity:     (getEl("quantity")?.value      || "").trim(),
        servings:     parseInt(getEl("servings")?.value || "0"),
        prepType:     document.querySelector('input[name="prepType"]:checked')?.value || "",
        prepDateTime: getEl("prepDateTime")?.value  || "",
        expiryDateTime: getEl("expiryDateTime")?.value || "",
        status:       "AVAILABLE"   // default status for a new donation
    };
}


/**
 * showFormSuccess(foodName, donorName)
 * Displays a green success message below the form.
 * Resets the form and scrolls to the message.
 */
function showFormSuccess(foodName, donorName) {
    const msg = getEl("formMessage");
    if (!msg) return;

    msg.className = "form-message success";
    msg.innerHTML =
        `✅ <strong>Thank you, ${donorName}!</strong><br>` +
        `Your donation of <strong>"${foodName}"</strong> has been recorded.<br>` +
        `Click <strong>"Analyze Food"</strong> again after connecting to the backend, ` +
        `or wait for Step 3 to send this to Spring Boot.`;
    show(msg);

    // Scroll to the message so the user sees it
    msg.scrollIntoView({ behavior: "smooth", block: "center" });

    // Reset the form fields after 1 second so user can see the message first
    setTimeout(function () {
        getEl("donationForm").reset();
        if (getEl("imagePreview"))         getEl("imagePreview").src = "";
        if (getEl("imagePreviewContainer"))hide(getEl("imagePreviewContainer"));
        if (getEl("fileNameDisplay"))      getEl("fileNameDisplay").textContent = "Click to upload or drag & drop";
    }, 1000);
}


/**
 * clearAllErrors()
 * Removes all red borders and error messages from the form.
 * Called when the user clicks "Clear Form".
 */
function clearAllErrors() {
    // Remove all error text
    document.querySelectorAll(".field-error").forEach(function (el) {
        el.textContent = "";
    });
    // Remove all red input borders
    document.querySelectorAll(".input-error").forEach(function (el) {
        el.classList.remove("input-error");
    });
}


/**
 * clearFieldError(fieldId)
 * Clears the error for just ONE field.
 * Called when the user starts typing to fix a mistake.
 */
function clearFieldError(fieldId) {
    const errorEl = getEl("error-" + fieldId);
    if (errorEl) errorEl.textContent = "";
}


/* ═══════════════════════════════════════════════════════════════
   4. NGO PAGE  (ngo.html)
   Handles:
     - Accept / Reject button clicks on each donation card
     - Live search (filter cards by food name or location)
     - Category and status dropdown filters
═══════════════════════════════════════════════════════════════ */

/**
 * initNgoPage()
 * Called once when ngo.html has finished loading.
 */
function initNgoPage() {

    // ── Wire up the search and filter inputs ────────────────────
    const searchInput    = getEl("searchInput");
    const categoryFilter = getEl("categoryFilter");
    const statusFilter   = getEl("statusFilter");

    // Run filterCards() every time the user types or changes a filter
    if (searchInput)    searchInput.addEventListener("input",  filterCards);
    if (categoryFilter) categoryFilter.addEventListener("change", filterCards);
    if (statusFilter)   statusFilter.addEventListener("change",   filterCards);
}


/**
 * handleCardAction(buttonEl, action, foodName)
 * Called by onclick on each Accept / Reject button.
 *
 * @param {HTMLElement} buttonEl  – the button that was clicked
 * @param {string}      action    – "accept" or "reject"
 * @param {string}      foodName  – name of the food on that card
 *
 * NOTE: In Step 3 this will send a PATCH request to the backend
 *       to update the donation's status to "CLAIMED" or "REJECTED".
 */
function handleCardAction(buttonEl, action, foodName) {

    // Find the card that contains this button
    const card = buttonEl.closest(".donation-card");

    if (action === "accept") {
        // Visual feedback: dim the card and disable both buttons
        card.style.opacity = "0.6";
        card.querySelectorAll(".btn-card").forEach(function (btn) {
            btn.disabled = true;
        });

        // Update the ribbon badge on the card
        const ribbon = card.querySelector(".card-ribbon");
        if (ribbon) {
            ribbon.textContent = "🤝 Claimed";
            ribbon.className = "card-ribbon fresh"; // reuse fresh green style
        }

        showToast("🤝 You have accepted: " + foodName);

        // TODO (Step 3): Send to backend:
        // fetch(`http://localhost:8080/api/donations/${donationId}/claim`, { method: "PATCH" })

    } else if (action === "reject") {
        // Animate the card sliding away, then hide it
        card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        card.style.opacity  = "0";
        card.style.transform = "scale(0.95)";

        // After the animation finishes, remove the card from the page
        setTimeout(function () {
            card.style.display = "none";
            updateResultsCount();
        }, 400);

        showToast("✕ Donation rejected: " + foodName, "danger");

        // TODO (Step 3): Send to backend:
        // fetch(`http://localhost:8080/api/donations/${donationId}/reject`, { method: "PATCH" })
    }
}


/**
 * filterCards()
 * Reads the current search text, category, and status filter values,
 * then shows or hides each card accordingly.
 *
 * How it works:
 *   - Each .donation-card has data-category and data-status attributes.
 *   - We compare those against the filter values.
 *   - If a card matches all active filters, we show it; otherwise hide it.
 */
function filterCards() {
    const searchText     = (getEl("searchInput")?.value    || "").toLowerCase().trim();
    const categoryValue  = (getEl("categoryFilter")?.value || "").toLowerCase();
    const statusValue    = (getEl("statusFilter")?.value   || "").toLowerCase();

    // Get all donation cards on the page
    const allCards = document.querySelectorAll(".donation-card");

    allCards.forEach(function (card) {
        // Skip cards that were already rejected (display:none)
        if (card.style.display === "none") return;

        // Get the card's data attributes (set in ngo.html)
        const cardCategory = (card.dataset.category || "").toLowerCase();
        const cardStatus   = (card.dataset.status   || "").toLowerCase();

        // Get the text content of the card (food name + location) for search
        const cardText = (card.querySelector(".card-food-name")?.textContent || "").toLowerCase()
                       + " "
                       + (card.querySelector(".detail-value")?.textContent || "").toLowerCase();

        // Check each filter:
        const matchesSearch   = !searchText   || cardText.includes(searchText);
        const matchesCategory = !categoryValue || cardCategory === categoryValue;
        const matchesStatus   = !statusValue   || cardStatus === statusValue;

        // Show the card only if ALL filters match
        if (matchesSearch && matchesCategory && matchesStatus) {
            card.style.opacity = card.style.opacity === "0.6" ? "0.6" : "1"; // keep claimed cards dimmed
            card.style.display = "";    // restore default display
        } else {
            card.style.display = "none";
        }
    });

    updateResultsCount();
}


/**
 * updateResultsCount()
 * Updates the "Showing X donations" text above the cards grid.
 */
function updateResultsCount() {
    const countEl  = getEl("resultsCount");
    const noResults = getEl("noResults");
    if (!countEl) return;

    // Count only the cards currently visible (display is not "none")
    const visibleCards = Array.from(document.querySelectorAll(".donation-card"))
        .filter(function (card) { return card.style.display !== "none"; });

    const count = visibleCards.length;
    countEl.textContent = "Showing " + count + " donation" + (count !== 1 ? "s" : "");

    // Show or hide the "no results" placeholder
    if (noResults) {
        if (count === 0) show(noResults);
        else             hide(noResults);
    }
}


/* ═══════════════════════════════════════════════════════════════
   5. RESULT PAGE  (result.html)
   Handles:
     - Simulated loading animation (replaces real API call later)
     - Populating the result page with demo data
     - Animating the progress bar and score circle
═══════════════════════════════════════════════════════════════ */

/**
 * initResultPage()
 * Called once when result.html loads.
 * Simulates a 1.5-second "AI is analyzing…" delay, then shows the result.
 *
 * In Step 3 this will be replaced by a real fetch() call to:
 *   GET http://localhost:8080/api/donations/{id}/analyze
 */
function initResultPage() {
    const loadingEl = getEl("resultLoading");
    const contentEl = getEl("resultContent");

    // Show the spinner for 1500 ms, then reveal the result
    setTimeout(function () {
        hide(loadingEl);
        show(contentEl);

        // Populate the page with demo data
        // In Step 3: replace demoResult with the real API response
        populateResultPage(demoResult);

        // Animate the progress bar after a tiny delay (for visual effect)
        setTimeout(function () {
            animateProgressBar(demoResult.freshnessScore);
        }, 100);

    }, 1500);
}


/**
 * demoResult
 * A plain JavaScript object holding sample AI result data.
 * In Step 3 this will come from the Spring Boot API as JSON.
 */
const demoResult = {
    freshnessScore:     85,
    freshnessStatus:    "Fresh",
    estimatedExpiry:    "Today, 8:00 PM",
    recommendedServings:"40 people",
    safetyLevel:        "Safe",
    safetyMessage:
        "This food is fresh and safe for donation. It was prepared recently " +
        "and has sufficient time before expiry. Please ensure it is stored in " +
        "a cool, dry place during transport. Distribute within the next 4 hours " +
        "for best quality.",
    // Submitted form details
    donorName:   "Raj's Restaurant",
    foodName:    "Vegetable Biryani",
    category:    "Cooked Meal",
    quantity:    "8 kg",
    prepType:    "Cooked",
    location:    "Koramangala, Bengaluru",
    prepTime:    "Today, 12:00 PM",
    contact:     "98765 43210"
};


/**
 * populateResultPage(data)
 * Takes a result data object and fills in all the HTML elements
 * on result.html with the correct values.
 *
 * @param {Object} data – the result object (from API or demoResult)
 */
function populateResultPage(data) {

    // ── Summary card ─────────────────────────────────────────────
    setTextById("resultFoodName",   data.foodName);
    setTextById("scoreNumber",      data.freshnessScore);

    // Color the score circle based on the score value
    const scoreCircle = getEl("scoreCircle");
    if (scoreCircle) {
        if      (data.freshnessScore >= 70) scoreCircle.style.border = "4px solid #52b788";
        else if (data.freshnessScore >= 40) scoreCircle.style.border = "4px solid #f4c430";
        else                                scoreCircle.style.border = "4px solid #c0392b";
    }

    // Status badge text and color
    const badge = getEl("statusBadge");
    if (badge) {
        if (data.freshnessScore >= 70) {
            badge.textContent = "✅ Fresh & Safe to Donate";
            badge.style.backgroundColor = "rgba(82, 183, 136, 0.3)";
        } else if (data.freshnessScore >= 40) {
            badge.textContent = "⚠️ Expiring Soon – Distribute Quickly";
            badge.style.backgroundColor = "rgba(244, 193, 42, 0.3)";
        } else {
            badge.textContent = "❌ Not Safe to Donate";
            badge.style.backgroundColor = "rgba(192, 57, 43, 0.3)";
        }
    }

    // ── Detail cards ─────────────────────────────────────────────
    setTextById("freshnessStatus",    data.freshnessStatus);
    setTextById("estimatedExpiry",    data.estimatedExpiry);
    setTextById("recommendedServings",data.recommendedServings);
    setTextById("safetyLevel",        data.safetyLevel);

    // Color the safety level text
    const safetyEl = getEl("safetyLevel");
    if (safetyEl) {
        if      (data.safetyLevel === "Safe")    safetyEl.className = "result-detail-value result-safe";
        else if (data.safetyLevel === "Caution") safetyEl.className = "result-detail-value result-warning";
        else                                     safetyEl.className = "result-detail-value result-danger";
    }

    // ── Safety message ────────────────────────────────────────────
    setTextById("safetyMessage", data.safetyMessage);

    // Style the safety message box border based on safety level
    const msgBox = getEl("safetyMessageBox");
    if (msgBox) {
        if      (data.safetyLevel === "Safe")    msgBox.style.borderColor = "#52b788";
        else if (data.safetyLevel === "Caution") msgBox.style.borderColor = "#f4c430";
        else                                     msgBox.style.borderColor = "#c0392b";
    }

    // ── Submitted details grid ────────────────────────────────────
    setTextById("detailDonor",    data.donorName);
    setTextById("detailFoodName", data.foodName);
    setTextById("detailCategory", data.category);
    setTextById("detailQuantity", data.quantity);
    setTextById("detailPrepType", data.prepType);
    setTextById("detailLocation", data.location);
    setTextById("detailPrepTime", data.prepTime);
    setTextById("detailContact",  data.contact);
}


/**
 * animateProgressBar(score)
 * Animates the green progress bar from 0% to the given score.
 * CSS transition handles the smooth animation automatically.
 *
 * @param {number} score – 0 to 100
 */
function animateProgressBar(score) {
    const fill = getEl("scoreProgressFill");
    if (fill) {
        // Start at 0, then set the real width; CSS transition does the rest
        fill.style.width = "0%";
        setTimeout(function () {
            fill.style.width = score + "%";

            // Change bar color based on score range
            if      (score >= 70) fill.style.background = "linear-gradient(90deg, #40916c, #52b788)";
            else if (score >= 40) fill.style.background = "linear-gradient(90deg, #d4830a, #f4c430)";
            else                  fill.style.background = "linear-gradient(90deg, #a93226, #c0392b)";
        }, 50);
    }
}


/**
 * setTextById(id, text)
 * A tiny helper to safely set the text content of an element.
 * Does nothing if the element doesn't exist.
 */
function setTextById(id, text) {
    const el = getEl(id);
    if (el) el.textContent = text;
}


/* ═══════════════════════════════════════════════════════════════
   6. TOAST NOTIFICATION  (used on ngo.html and donor.html)
   A small popup that appears at the bottom of the screen,
   shows a message for 3 seconds, then disappears automatically.
═══════════════════════════════════════════════════════════════ */

/** Timer reference so we can cancel a toast that's still showing */
let toastTimer = null;

/**
 * showToast(message, type)
 * Shows the toast notification with the given message.
 *
 * @param {string} message  – the text to display
 * @param {string} type     – "default" (green) or "danger" (red)
 */
function showToast(message, type) {
    const toast = getEl("toast");
    if (!toast) return;    // toast element only exists on ngo.html

    // Cancel any previous toast timer so it doesn't hide this new one early
    if (toastTimer) clearTimeout(toastTimer);

    toast.textContent = message;
    toast.className   = "toast" + (type === "danger" ? " toast-danger" : "");
    show(toast);

    // Auto-hide after 3 seconds
    toastTimer = setTimeout(function () {
        hide(toast);
    }, 3000);
}


/* ═══════════════════════════════════════════════════════════════
   7. INDEX PAGE  (index.html) – Food Freshness Verification
   Added in Step 2 correction.

   Handles:
     - Image preview for the verification form
     - "Clear Form" button
     - Full field validation (all 11 fields including image)
     - "Analyzing food…" loading message
     - Demo result displayed on the same page (right panel)
     - "Verify Another Food" button to reset and re-use the form

   HOW THIS WILL CHANGE IN STEP 3:
     Currently the result is generated by generateDemoResult()
     using only the values the user typed in.
     In Step 3, replace that call with a real fetch() POST:

       fetch("http://localhost:8080/api/donations/analyze", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(formData)
       })
       .then(res => res.json())
       .then(function(apiResult) {
           populateVerifyResult(apiResult);
           animateVerifyBar(apiResult.freshnessScore);
       });
═══════════════════════════════════════════════════════════════ */

/**
 * initIndexPage()
 * Called once when index.html finishes loading.
 * Wires up all event listeners for the freshness verification form.
 */
function initIndexPage() {

    // ── DOM element references ───────────────────────────────────
    const form              = getEl("verifyForm");
    const resetBtn          = getEl("v-resetFormBtn");
    const verifyAnotherBtn  = getEl("v-verifyAnotherBtn");
    const foodImageInput    = getEl("v-foodImage");
    const fileNameDisplay   = getEl("v-fileNameDisplay");
    const imagePreviewCont  = getEl("v-imagePreviewContainer");
    const imagePreview      = getEl("v-imagePreview");
    const removeImageBtn    = getEl("v-removeImageBtn");
    const resultPanel       = getEl("verifyResultPanel");

    // ── Image upload preview ─────────────────────────────────────
    if (foodImageInput) {
        foodImageInput.addEventListener("change", function () {
            handleVerifyImageUpload(this.files[0]);
        });
    }

    /**
     * handleVerifyImageUpload(file)
     * Reads the selected image file and shows a thumbnail preview.
     * Also clears the image field-error once a file is chosen.
     */
    function handleVerifyImageUpload(file) {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            getEl("err-v-foodImage").textContent =
                "Please select an image file (PNG, JPG, JPEG).";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            getEl("err-v-foodImage").textContent =
                "File too large. Maximum size is 5 MB.";
            return;
        }

        // Clear any previous error once a valid file is chosen
        getEl("err-v-foodImage").textContent = "";

        // FileReader converts the file to a base64 URL so we can
        // show it as an <img> without uploading it to a server.
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            fileNameDisplay.textContent = file.name;
            show(imagePreviewCont);
        };
        reader.readAsDataURL(file);
    }

    // ── Remove image ─────────────────────────────────────────────
    if (removeImageBtn) {
        removeImageBtn.addEventListener("click", function () {
            foodImageInput.value     = "";
            imagePreview.src         = "";
            fileNameDisplay.textContent = "Click to upload or drag & drop";
            hide(imagePreviewCont);
        });
    }

    // ── Clear Form button ────────────────────────────────────────
    if (resetBtn) {
        resetBtn.addEventListener("click", function () {
            resetVerifyForm();
        });
    }

    // ── "Verify Another Food" button inside the result panel ─────
    if (verifyAnotherBtn) {
        verifyAnotherBtn.addEventListener("click", function () {
            // Hide the result panel and scroll back up to the form
            hide(resultPanel);
            resetVerifyForm();
            form.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    /**
     * resetVerifyForm()
     * Clears all form fields, errors, and the image preview.
     * Reusable by both the clear button and "Verify Another" button.
     */
    function resetVerifyForm() {
        form.reset();
        clearVerifyErrors();

        // Reset image preview
        if (imagePreview)    imagePreview.src = "";
        if (imagePreviewCont) hide(imagePreviewCont);
        if (fileNameDisplay)  fileNameDisplay.textContent = "Click to upload or drag & drop";
    }

    // ── Clear per-field errors when user starts correcting them ──
    // Selects all inputs and selects inside verifyForm
    form.querySelectorAll("input, select").forEach(function (input) {
        input.addEventListener("input", function () {
            // The error span id is "err-" + the input id
            const errEl = getEl("err-" + this.id);
            if (errEl) errEl.textContent = "";
            this.classList.remove("input-error");
        });
    });

    // ── Form submission ──────────────────────────────────────────
    form.addEventListener("submit", function (event) {
        // Stop the browser from reloading the page
        event.preventDefault();

        // Step 1: validate; abort if anything is wrong
        if (!validateVerifyForm()) return;

        // Step 2: collect all the form values into one object
        const formData = collectVerifyFormData();
        console.log("📋 Verify form data ready:", formData);

        // Step 3: show the result panel with a loading spinner
        show(resultPanel);
        show(getEl("verifyLoading"));
        hide(getEl("verifyResultContent"));

        // Scroll smoothly to the result panel
        resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });

        // Step 4: simulate a 1.8-second "AI is working" delay
        // ─────────────────────────────────────────────────────────
        // TODO (Step 3): REPLACE the setTimeout below with:
        //
        //   fetch("http://localhost:8080/api/donations/analyze", {
        //       method: "POST",
        //       headers: { "Content-Type": "application/json" },
        //       body: JSON.stringify(formData)
        //   })
        //   .then(function(response) { return response.json(); })
        //   .then(function(apiResult) {
        //       hide(getEl("verifyLoading"));
        //       show(getEl("verifyResultContent"));
        //       populateVerifyResult(apiResult);
        //       animateVerifyBar(apiResult.freshnessScore);
        //   })
        //   .catch(function(error) {
        //       console.error("Backend error:", error);
        //       getEl("verifyLoading").textContent =
        //           "❌ Could not reach the backend. Is Spring Boot running?";
        //   });
        // ─────────────────────────────────────────────────────────

        setTimeout(function () {
            // Generate a demo result from the submitted form values
            const demoData = generateDemoResult(formData);

            // Hide spinner, show result content
            hide(getEl("verifyLoading"));
            show(getEl("verifyResultContent"));

            // Fill in all the result fields
            populateVerifyResult(demoData);

            // Animate the progress bar with a tiny delay for visual effect
            setTimeout(function () {
                animateVerifyBar(demoData.freshnessScore);
            }, 80);

        }, 1800); // 1800 ms = 1.8 seconds
    });
}


/* ───────────────────────────────────────────────────────────────
   VALIDATION for the index page form
   Uses "v-" prefixed IDs to avoid conflicts with donor.html IDs.
─────────────────────────────────────────────────────────────── */

/**
 * validateVerifyForm()
 * Checks all 11 required fields on the verification form.
 * Shows a red error message under each invalid field.
 * Returns true only if everything passes.
 */
function validateVerifyForm() {
    let isValid = true;

    /**
     * fail(fieldId, message)
     * Marks a specific field as invalid:
     *   - Puts red text under it  (the <span class="field-error"> element)
     *   - Adds a red border       (.input-error CSS class)
     */
    function fail(fieldId, message) {
        const errEl   = getEl("err-" + fieldId);
        const inputEl = getEl(fieldId);
        if (errEl)   errEl.textContent = message;
        if (inputEl) inputEl.classList.add("input-error");
        isValid = false;
    }

    // 1. Donor Name
    if (!(getEl("v-donorName")?.value || "").trim()) {
        fail("v-donorName", "Please enter your name or organisation.");
    }

    // 2. Contact Number – must be exactly 10 digits
    const contact = (getEl("v-contactNumber")?.value || "").trim();
    if (!contact) {
        fail("v-contactNumber", "Please enter a contact number.");
    } else if (!/^\d{10}$/.test(contact)) {
        fail("v-contactNumber", "Enter a valid 10-digit mobile number.");
    }

    // 3. Location
    if (!(getEl("v-location")?.value || "").trim()) {
        fail("v-location", "Please enter the pickup location.");
    }

    // 4. Food Name
    if (!(getEl("v-foodName")?.value || "").trim()) {
        fail("v-foodName", "Please enter the food name.");
    }

    // 5. Food Category
    if (!(getEl("v-foodCategory")?.value || "")) {
        fail("v-foodCategory", "Please select a food category.");
    }

    // 6. Quantity
    if (!(getEl("v-quantity")?.value || "").trim()) {
        fail("v-quantity", "Please enter the quantity.");
    }

    // 7. Servings
    const servings = parseInt(getEl("v-servings")?.value || "0");
    if (!getEl("v-servings")?.value) {
        fail("v-servings", "Please enter the number of people.");
    } else if (servings < 1) {
        fail("v-servings", "Must be at least 1 person.");
    }

    // 8. Preparation Type (radio buttons)
    //    document.querySelector finds the checked radio in this group
    if (!document.querySelector('input[name="v-prepType"]:checked')) {
        const errEl = getEl("err-v-prepType");
        if (errEl) errEl.textContent = "Please select a preparation type.";
        isValid = false;
    }

    // 9. Preparation Date & Time
    if (!(getEl("v-prepDateTime")?.value || "")) {
        fail("v-prepDateTime", "Please select preparation date and time.");
    }

    // 10. Expiry Date & Time – and must be after prep time
    const prepDT   = getEl("v-prepDateTime")?.value   || "";
    const expiryDT = getEl("v-expiryDateTime")?.value || "";
    if (!expiryDT) {
        fail("v-expiryDateTime", "Please select expected expiry date and time.");
    } else if (prepDT && new Date(expiryDT) <= new Date(prepDT)) {
        fail("v-expiryDateTime", "Expiry must be after the preparation time.");
    }

    // 11. Food Image – REQUIRED for AI freshness check
    const imageInput = getEl("v-foodImage");
    if (!imageInput || !imageInput.files || imageInput.files.length === 0) {
        const errEl = getEl("err-v-foodImage");
        if (errEl) errEl.textContent = "Please upload a food image.";
        isValid = false;
    }

    // If any field failed, scroll the first red field into view
    if (!isValid) {
        const firstErr = document.querySelector(
            "#verifyForm .input-error, #verifyForm .field-error:not(:empty)"
        );
        if (firstErr) firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return isValid;
}


/**
 * clearVerifyErrors()
 * Removes all red borders and error messages inside #verifyForm.
 */
function clearVerifyErrors() {
    document.querySelectorAll("#verifyForm .field-error").forEach(function (el) {
        el.textContent = "";
    });
    document.querySelectorAll("#verifyForm .input-error").forEach(function (el) {
        el.classList.remove("input-error");
    });
}


/**
 * collectVerifyFormData()
 * Reads all filled values from the verification form and returns
 * them as a plain JavaScript object.
 * This object will become the JSON body sent to Spring Boot in Step 3.
 */
function collectVerifyFormData() {
    return {
        donorName:     (getEl("v-donorName")?.value      || "").trim(),
        contactNumber: (getEl("v-contactNumber")?.value  || "").trim(),
        location:      (getEl("v-location")?.value       || "").trim(),
        foodName:      (getEl("v-foodName")?.value        || "").trim(),
        foodCategory:   getEl("v-foodCategory")?.value   || "",
        quantity:      (getEl("v-quantity")?.value        || "").trim(),
        servings:       parseInt(getEl("v-servings")?.value || "0"),
        prepType:       document.querySelector('input[name="v-prepType"]:checked')?.value || "",
        prepDateTime:   getEl("v-prepDateTime")?.value   || "",
        expiryDateTime: getEl("v-expiryDateTime")?.value || "",
        status:        "AVAILABLE"
    };
}


/* ───────────────────────────────────────────────────────────────
   DEMO RESULT GENERATOR
   Creates a realistic-looking result from the form data.
   This entire function will be REMOVED in Step 3 and replaced
   with the real Spring Boot API response.
─────────────────────────────────────────────────────────────── */

/**
 * generateDemoResult(formData)
 * Produces a demo freshness result based purely on the time
 * difference between preparation and expiry.
 *
 * Score logic (frontend demo only – not real AI):
 *   - More than 12 hours remaining → score 80–95  (Fresh)
 *   - 4–12 hours remaining         → score 45–75  (Moderate)
 *   - Less than 4 hours remaining  → score 10–40  (Not Recommended)
 *
 * @param {Object} formData – the object from collectVerifyFormData()
 * @returns {Object}         – result object matching populateVerifyResult() shape
 */
function generateDemoResult(formData) {
    const now    = new Date();
    const expiry = new Date(formData.expiryDateTime);

    // How many hours until the food expires?
    // getTime() returns milliseconds; divide to get hours.
    const hoursLeft = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);

    // ── Determine score, status, and safety level ────────────────
    let score, freshnessStatus, safetyLevel, safetyMessage;

    if (hoursLeft > 12) {
        // Plenty of time left → FRESH
        score           = Math.round(80 + Math.random() * 15);  // 80–95
        freshnessStatus = "Fresh";
        safetyLevel     = "Safe";
        safetyMessage   =
            "This food is fresh and safe for donation. It was prepared recently " +
            "and has plenty of time before expiry. Ensure it is stored in a cool, " +
            "clean container during transport.";

    } else if (hoursLeft > 4) {
        // A few hours left → MODERATE
        score           = Math.round(45 + Math.random() * 30);  // 45–74
        freshnessStatus = "Moderate";
        safetyLevel     = "Caution";
        safetyMessage   =
            "This food is still usable but should be distributed soon. " +
            "Prioritise delivery to nearby NGOs within the next 2–3 hours. " +
            "Do not leave at room temperature for extended periods.";

    } else if (hoursLeft > 0) {
        // Expiring very soon → NOT RECOMMENDED
        score           = Math.round(10 + Math.random() * 29);  // 10–38
        freshnessStatus = "Expiring Soon";
        safetyLevel     = "Not Safe";
        safetyMessage   =
            "This food is very close to its expiry time. Distribution is " +
            "not recommended unless it can be consumed immediately. " +
            "Please consider disposing of it safely.";

    } else {
        // Already expired
        score           = Math.round(1 + Math.random() * 9);    // 1–9
        freshnessStatus = "Expired";
        safetyLevel     = "Not Safe";
        safetyMessage   =
            "This food has passed its expected expiry time and should NOT " +
            "be donated. Please dispose of it responsibly.";
    }

    // ── Format the expiry date for display ───────────────────────
    const expiryDisplay = expiry.toLocaleString("en-IN", {
        day:    "numeric",
        month:  "short",
        hour:   "2-digit",
        minute: "2-digit"
    });

    return {
        freshnessScore:      score,
        freshnessStatus:     freshnessStatus,
        estimatedExpiry:     expiryDisplay,
        recommendedServings: formData.servings + " people",
        safetyLevel:         safetyLevel,
        safetyMessage:       safetyMessage,
        // Pass the form details through so the result can show them
        donorName:           formData.donorName,
        foodName:            formData.foodName,
        category:            formData.foodCategory,
        quantity:            formData.quantity,
        prepType:            formData.prepType,
        location:            formData.location,
        contact:             formData.contactNumber
    };
}


/* ───────────────────────────────────────────────────────────────
   RESULT DISPLAY for the index page result panel
─────────────────────────────────────────────────────────────── */

/**
 * populateVerifyResult(data)
 * Fills every element inside #verifyResultContent with the
 * result data (either from generateDemoResult or the real API).
 *
 * @param {Object} data – shape matches generateDemoResult output
 */
function populateVerifyResult(data) {
    const score = data.freshnessScore;

    // ── Score number ─────────────────────────────────────────────
    setTextById("v-scoreNumber", score);

    // ── Color the score circle based on the score value ──────────
    const circle = getEl("v-scoreCircle");
    if (circle) {
        if      (score >= 70) circle.style.borderColor = "#52b788";   // green
        else if (score >= 40) circle.style.borderColor = "#f4c430";   // yellow
        else                  circle.style.borderColor = "#c0392b";   // red
    }

    // ── Status badge ─────────────────────────────────────────────
    const badge = getEl("v-statusBadge");
    if (badge) {
        if (score >= 70) {
            badge.textContent = "✅ Fresh – Safe to Donate";
            badge.className   = "verify-status-badge";               // green
        } else if (score >= 40) {
            badge.textContent = "⚠️ Moderate – Distribute Quickly";
            badge.className   = "verify-status-badge status-warning"; // yellow
        } else {
            badge.textContent = "❌ Not Recommended for Donation";
            badge.className   = "verify-status-badge status-danger";  // red
        }
    }

    // ── Four metrics ─────────────────────────────────────────────
    setTextById("v-freshnessStatus",    data.freshnessStatus);
    setTextById("v-estimatedExpiry",    data.estimatedExpiry);
    setTextById("v-recommendedServings",data.recommendedServings);
    setTextById("v-safetyLevel",        data.safetyLevel);

    // ── Safety message box ────────────────────────────────────────
    setTextById("v-safetyMessage", data.safetyMessage);
    const msgBox = getEl("v-safetyMessageBox");
    if (msgBox) {
        if      (score >= 70) msgBox.style.borderLeftColor = "#52b788";
        else if (score >= 40) msgBox.style.borderLeftColor = "#f4c430";
        else                  msgBox.style.borderLeftColor = "#c0392b";
    }
}


/**
 * animateVerifyBar(score)
 * Animates the progress bar inside the index result panel.
 * CSS transition does the smooth animation; we just set the width.
 *
 * @param {number} score – 0 to 100
 */
function animateVerifyBar(score) {
    const fill = getEl("v-progressFill");
    if (!fill) return;

    fill.style.width = "0%";  // start at 0

    // After 50ms give the browser time to render the 0% width,
    // then set the real width – CSS transition kicks in.
    setTimeout(function () {
        fill.style.width = score + "%";

        if      (score >= 70) fill.style.background = "linear-gradient(90deg, #40916c, #52b788)";
        else if (score >= 40) fill.style.background = "linear-gradient(90deg, #d4830a, #f4c430)";
        else                  fill.style.background = "linear-gradient(90deg, #a93226, #c0392b)";
    }, 50);
}
