const executeLoginFlow = () => {
    // Look for Step 3 & 4 elements first (in case we are already on the login page/modal)
    const emailInput = document.querySelector('#login-id');
    const loginNowBtn = Array.from(document.querySelectorAll('button.btn-primary')).find(btn => btn.innerText.includes('Login Now'));

    if (emailInput && loginNowBtn) {
        // Retrieve the saved email from Chrome storage
        chrome.storage.local.get(['sccEmail'], (result) => {
            if (result.sccEmail) {
                // Step 3: Inject the email
                emailInput.value = result.sccEmail;
                
                // Dispatch events so the website's internal framework registers the input
                emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                emailInput.dispatchEvent(new Event('change', { bubbles: true }));

                // Step 4: Click "Login Now" after a brief pause
                setTimeout(() => {
                    loginNowBtn.click();
                }, 500);
            } else {
                alert("SCC Auto-Login: Please right-click the extension icon and select 'Options' to save your email.");
            }
        });
        return; 
    }

    // Step 2: If the email input isn't there, look for the initial "Log In" button
    const initialLoginBtns = document.querySelectorAll('button.btn.btn-secondary');
    for (let btn of initialLoginBtns) {
        if (btn.innerText.includes('Log In')) {
            btn.click();
            
            // Once clicked, wait 1 second for the modal to open, then run this function again to trigger Steps 3 & 4
            setTimeout(executeLoginFlow, 1000);
            break;
        }
    }
};

// Wait 1.5 seconds after the page loads to let SCC's UI render, then start the flow
setTimeout(executeLoginFlow, 1500);