let USERNAME = "";
let PASSWORD = "";
let loginClicked = false;
let termsClicked = false;

// Request the saved credentials from browser storage
chrome.storage.local.get(['wifiUsername', 'wifiPassword'], (result) => {
    if (result.wifiUsername && result.wifiPassword) {
        USERNAME = result.wifiUsername;
        PASSWORD = result.wifiPassword;
        
        // Start the check loop only after credentials are confirmed loaded
        setInterval(() => {
            attemptLogin();
            attemptTerms();
        }, 500);
    } else {
        console.log("Auto Wi-Fi Login: No credentials saved. Click the extension icon to set them.");
    }
});

function forceFill(element, text) {
    element.focus();
    element.value = text;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
    element.blur();
}

function attemptLogin() {
    if (loginClicked) return; 

    const usernameField = document.querySelector('#LoginUserPassword_auth_username');
    const passwordField = document.querySelector('#LoginUserPassword_auth_password');
    const loginButton = document.querySelector('#UserCheck_Login_Button_span');

    if (usernameField && passwordField && loginButton) {
        forceFill(usernameField, USERNAME);
        forceFill(passwordField, PASSWORD);
        
        setTimeout(() => {
            loginButton.click();
            loginClicked = true; 
        }, 500);
    }
}

function attemptTerms() {
    if (termsClicked) return; 

    const termsCheckbox = document.querySelector('#agreement_checkbox');
    const nextButton = document.querySelector('#UserCheck_Agreement_Next_Button_span');

    if (termsCheckbox && nextButton && termsCheckbox.offsetParent !== null) {
        if (!termsCheckbox.checked) {
            termsCheckbox.click();
            termsCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        setTimeout(() => {
            nextButton.click();
            termsClicked = true; 
        }, 500);
    }
}