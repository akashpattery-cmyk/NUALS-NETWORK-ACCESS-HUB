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

// --- Version Check & Up-to-Date Indicator ---
  const GITHUB_VERSION_JS_URL = 'https://raw.githubusercontent.com/akashpattery-cmyk/NUALS-NETWORK-ACCESS-HUB/main/version.js';
  const GITHUB_DOWNLOAD_URL = 'https://github.com/akashpattery-cmyk/NUALS-NETWORK-ACCESS-HUB/archive/refs/tags/Stable.zip';

  function compareVersions(current, latest) {
    const v1 = current.split('.').map(Number);
    const v2 = latest.split('.').map(Number);
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const num1 = v1[i] || 0;
      const num2 = v2[i] || 0;
      if (num2 > num1) return true;
      if (num2 < num1) return false;
    }
    return false;
  }

  async function checkAppVersion() {
    const badge = document.getElementById('version-status');
    const badgeText = document.getElementById('version-text');
    const localVersion = chrome.runtime.getManifest().version;

    try {
      const response = await fetch(GITHUB_VERSION_JS_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error('Network response failed');
      
      const jsText = await response.text();
      const versionMatch = jsText.match(/\b(\d+\.\d+(?:\.\d+)?)\b/);

      if (versionMatch && compareVersions(localVersion, versionMatch[1])) {
        // Newer version exists
        badge.className = 'version-badge update-available';
        badgeText.textContent = `Update available (v${versionMatch[1]}) ↗`;
        badge.title = 'Click to open download page';
        badge.onclick = () => chrome.tabs.create({ url: GITHUB_DOWNLOAD_URL });
      } else {
        // Current version is equal to or newer than GitHub
        badge.className = 'version-badge up-to-date';
        badgeText.textContent = `Up to date (v${localVersion})`;
        badge.title = 'Extension is running the latest version';
        badge.onclick = null;
      }
    } catch (err) {
      // Graceful fallback if offline or raw GitHub is unreachable
      badge.className = 'version-badge up-to-date';
      badgeText.textContent = `v${localVersion}`;
      badge.title = 'Could not reach server to check for updates';
    }
  }

  checkAppVersion();

});