document.addEventListener("DOMContentLoaded", () => {
    const btAvailable = document.getElementById("bt-available");
    const macField = document.getElementById("mac");
    const form = document.getElementById("signup-form");
    const successMessage = document.getElementById("success-message");
    const responseMessage = document.getElementById("response-message");
    const loadingIndicator = document.getElementById("loading-indicator");

    btAvailable.addEventListener("change", () => {
        if (btAvailable.value === "Yes") {
            macField.setAttribute("required", "required");
        } else {
            macField.removeAttribute("required");
        }
    });

    const isValidMAC = (mac) => {
        // Improved MAC regex and enforce lowercase check
        const macRegex = /^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/;
        return macRegex.test(mac.toLowerCase());
    };

    // Updated to only check PRN uniqueness (as backend check for hashed MAC is unfeasible)
    const checkUniqueness = async (id) => {
        try {
            const response = await fetch("http://localhost:3000/api/check-unique", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }) // Only send ID for uniqueness check
            });
            return await response.json();
        } catch (err) {
            console.error("Error checking uniqueness:", err);
            return { success: false, message: "Server error. Please try again later." };
        }
    };

    const displayResponseMessage = (message, type) => {
        responseMessage.textContent = message;
        responseMessage.className = `response-message ${type}`;
        responseMessage.classList.remove("hide");
        setTimeout(() => {
            responseMessage.classList.add("hide");
            responseMessage.textContent = ''; // Clear message when hiding
        }, 5000);
    };

    const validateFields = () => {
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const gender = document.getElementById("gender").value;
        const id = document.getElementById("prn").value.trim();
        const roll = document.getElementById("roll").value.trim();
        const year = document.getElementById("year").value;
        const branch = document.getElementById("branch").value;
        const division = document.getElementById("division").value;
        const bluetoothAvailable = btAvailable.value;

        if (!name || !email || !id || !roll || !year || !branch || !division || !bluetoothAvailable) {
            displayResponseMessage("Please fill in all the required fields.", "error");
            return false;
        }

        return true;
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const gender = document.getElementById("gender").value;
        const id = document.getElementById("prn").value.trim();
        const roll = document.getElementById("roll").value.trim();
        const year = document.getElementById("year").value;
        const branch = document.getElementById("branch").value;
        const division = document.getElementById("division").value;
        const bluetoothAvailable = btAvailable.value;
        const deviceUsed = document.getElementById("used-device").value.trim();
        const mac = macField.value.trim();

        // Validate fields
        if (!validateFields()) return;

        // Validate MAC if Bluetooth is available
        if (bluetoothAvailable === "Yes") {
            if (!mac) {
                displayResponseMessage("MAC address is required when Bluetooth is available.", "error");
                macField.focus();
                return;
            }
            if (!isValidMAC(mac)) {
                displayResponseMessage("Please enter a valid Bluetooth MAC address in format XX:XX:XX:XX:XX:XX", "error");
                macField.focus();
                return;
            }
        }


        // Check uniqueness only for PRN (id)
        const uniqueness = await checkUniqueness(id);
        if (!uniqueness.success) {
            displayResponseMessage(uniqueness.message, "error");
            return;
        }

        // Construct user data
        const userData = {
            name,
            email,
            gender,
            id,
            roll,
            year,
            branch,
            division,
            bluetoothAvailable,
            deviceUsed,
            mac: bluetoothAvailable === "Yes" ? mac : ""
        };

        // Show loading indicator
        if (loadingIndicator) {
            loadingIndicator.classList.remove("hide");
        }

        try {
            const response = await fetch("http://localhost:3000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            loadingIndicator.classList.add("hide"); // Hide loading indicator after response

            if (data.success) {
                // Clear form inputs on successful signup
                form.reset();
                displayResponseMessage(data.message || "Account created successfully!", "success");
                successMessage.classList.add("show");
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            } else {
                displayResponseMessage(data.message || "Signup failed. Please try again.", "error");
            }
        } catch (err) {
            console.error("Signup error:", err);
            if (loadingIndicator) {
                loadingIndicator.classList.add("hide");
            }
            displayResponseMessage("Server error. Please try again later.", "error");
        }
    });
});