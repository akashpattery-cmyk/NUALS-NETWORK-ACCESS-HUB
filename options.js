document.getElementById('save').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    chrome.storage.local.set({ sccEmail: email }, () => {
        document.getElementById('status').innerText = 'Email saved successfully! You can close this tab.';
        setTimeout(() => {
            document.getElementById('status').innerText = '';
        }, 3000);
    });
});

// Load the email if it was already saved previously
chrome.storage.local.get(['sccEmail'], (result) => {
    if (result.sccEmail) {
        document.getElementById('email').value = result.sccEmail;
    }
});