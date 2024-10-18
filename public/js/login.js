// if (location.href.endsWith("?error=1")) {
//     document.body.innerHTML += "<b>Username and/or password is incorrect!</b>";
// }
// if (location.href.endsWith("?error=2")) {
//     document.body.innerHTML += "<b>Something went wrong with the registration!</b>";
// } 
document.addEventListener("DOMContentLoaded", function () {
    const loginErrorDiv = document.getElementById("loginError");
    const registerErrorDiv = document.getElementById("registerError");

    if (location.href.endsWith("?error=1")) {
        loginErrorDiv.innerHTML = "Username and/or password is incorrect!";
    }
    if (location.href.endsWith("?error=2")) {
        // Switch to Sign-Up tab and show error message
        $('#signup-tab').click();
        registerErrorDiv.innerHTML = "Something went wrong with the registration!";
    }
});