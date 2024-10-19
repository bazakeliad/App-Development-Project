document.addEventListener("DOMContentLoaded", function () {
    const loginErrorDiv = document.getElementById("ErrorDiv");

    if (location.href.endsWith("?error=1")) {
        loginErrorDiv.innerHTML = "Sizes are required !";
    }
});