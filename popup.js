document.addEventListener('DOMContentLoaded', () => {
  
  let credentialsSaved = false;

  // Check storage on load for Wi-Fi credentials and SCC email
  chrome.storage.local.get(['wifiUsername', 'wifiPassword', 'sccEmail'], (result) => {
    if (result.wifiUsername) document.getElementById('username').value = result.wifiUsername;
    if (result.wifiPassword) document.getElementById('password').value = result.wifiPassword;
    if (result.sccEmail) document.getElementById('scc-email-input').value = result.sccEmail;

    if (result.wifiUsername && result.wifiPassword) {
      credentialsSaved = true;
      unlockQuickLaunches();
    } else {
      lockQuickLaunches(); 
    }
  });

  function lockQuickLaunches() {
    document.querySelectorAll('.portal-btn').forEach(btn => btn.classList.add('locked'));
  }

  function unlockQuickLaunches() {
    document.querySelectorAll('.portal-btn').forEach(btn => btn.classList.remove('locked'));
    document.getElementById('lock-banner').style.display = 'none';
  }

  // Step 1: Click "Save Credentials" -> Validate -> Show Disclaimer or Error
  document.getElementById('proceed-btn').addEventListener('click', () => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');

    const isValidUser = /^\d{4}$/.test(user);
    const isValidPass = /^\d{5}$/.test(pass);

    if (isValidUser && isValidPass) {
      errorMsg.style.display = 'none';
      document.getElementById('form-view').style.display = 'none';
      document.getElementById('disclaimer-view').style.display = 'flex';
    } else {
      errorMsg.style.display = 'block';
    }
  });

  // Step 2: Click "Cancel" on Disclaimer -> Go back to Form
  document.getElementById('cancel-btn').addEventListener('click', () => {
    document.getElementById('disclaimer-view').style.display = 'none';
    document.getElementById('form-view').style.display = 'block';
  });

  // Step 3: Click "I Accept" on Disclaimer -> Save Wi-Fi Data & SCC Email -> Show Success
  document.getElementById('accept-btn').addEventListener('click', () => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const sccEmail = document.getElementById('scc-email-input').value;

    chrome.storage.local.set({ 
      wifiUsername: user, 
      wifiPassword: pass, 
      sccEmail: sccEmail 
    }, () => {
      credentialsSaved = true;
      unlockQuickLaunches();
      document.getElementById('disclaimer-view').style.display = 'none';
      document.getElementById('success-view').style.display = 'flex';
    });
  });

  // Step 4: Click "Edit Credentials" -> Go back to Form
  document.getElementById('back-btn').addEventListener('click', () => {
    document.getElementById('success-view').style.display = 'none';
    document.getElementById('form-view').style.display = 'block';
  });

  // Helper function to check lock before executing actions
  function guardAction(actionCallback) {
    if (!credentialsSaved) {
      const banner = document.getElementById('lock-banner');
      banner.innerText = "Enter credentials to access";
      banner.style.display = 'block';
      setTimeout(() => { banner.style.display = 'none'; }, 3000);
      return;
    }
    actionCallback();
  }

  // Quick Launch 1: Open Manupatra[cite: 8]
  document.getElementById('manupatra-btn').addEventListener('click', () => {
    guardAction(() => {
      chrome.tabs.create({ url: "https://www.manupatrafast.com/homepopup.aspx" });
    });
  });

  // Quick Launch 2: Open SCC Online[cite: 12]
  document.getElementById('scc-btn').addEventListener('click', () => {
    guardAction(() => {
      chrome.tabs.create({ url: "https://www.scconline.com" });
    });
  });

  // Quick Launch 3: Open Embedded PDF Inline inside Popup
  document.getElementById('pdf-btn').addEventListener('click', () => {
    guardAction(() => {
      document.body.classList.add('pdf-mode');
      document.getElementById('main-header').style.display = 'none';
      document.getElementById('form-view').style.display = 'none';
      document.getElementById('disclaimer-view').style.display = 'none';
      document.getElementById('success-view').style.display = 'none';
      document.getElementById('quick-launch-section').style.display = 'none';
      document.getElementById('pdf-view').style.display = 'flex';
    });
  });

  // Quick Launch 4: Close Embedded PDF View
  document.getElementById('close-pdf-btn').addEventListener('click', () => {
    document.body.classList.remove('pdf-mode');
    document.getElementById('pdf-view').style.display = 'none';
    document.getElementById('main-header').style.display = 'flex';
    document.getElementById('form-view').style.display = 'block';
    document.getElementById('quick-launch-section').style.display = 'block';
  });

  // Quick Launch 5: Open OPAC External Website
  document.getElementById('visit-web-btn').addEventListener('click', () => {
    guardAction(() => {
      chrome.tabs.create({
        url: "http://14.139.185.166/"
      });
    });
  });

});