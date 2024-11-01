document.addEventListener("DOMContentLoaded", function () {
    const loginErrorDiv = document.getElementById("loginError");
    const registerErrorDiv = document.getElementById("registerError");

    // Handle URL errors
    if (location.href.endsWith("?error=1")) {
        loginErrorDiv.innerHTML = "Username and/or password is incorrect!";
    }
    if (location.href.endsWith("?error=2")) {
        // Switch to Sign-Up tab and show error message
        $('#signup-tab').click();
        registerErrorDiv.innerHTML = "Something went wrong with the registration!";
    }

    // Password Confirmation Check
    document.getElementById('signupForm').addEventListener('submit', function(event) {
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const passwordError = document.getElementById('passwordError');

        if (password !== confirmPassword) {
            event.preventDefault();
            passwordError.textContent = "Passwords do not match. Please re-enter.";
        } else {
            passwordError.textContent = ""; // Clear any previous error messages
        }
    });
});