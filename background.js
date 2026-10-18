// MUST use raw.githubusercontent.com, NOT github.com
const GITHUB_VERSION_JS_URL = 'https://raw.githubusercontent.com/akashpattery-cmyk/NUALS-NETWORK-ACCESS-HUB/main/version.js';
// Link to your GitHub Releases page or direct .zip download
const GITHUB_DOWNLOAD_URL = 'https://github.com/akashpattery-cmyk/NUALS-NETWORK-ACCESS-HUB/archive/refs/tags/Stable.zip';

// Helper to compare semantic versions (e.g., "1.0.0" vs "1.1.0")
function isNewerVersion(current, latest) {
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

async function checkGitHubUpdate() {
  try {
    // 1. Fetch the version.js file as plain text
    const response = await fetch(GITHUB_VERSION_JS_URL, { cache: 'no-store' });
    const jsText = await response.text();
    
    // 2. Extract the version number using a Regular Expression
    // This looks for a standard semantic version format like 1.2.3
    const versionMatch = jsText.match(/\b(\d+\.\d+\.\d+)\b/);
    
    if (!versionMatch) {
      console.error('Could not find a valid version number in version.js');
      return;
    }

    const latestVersion = versionMatch[1];
    const currentVersion = chrome.runtime.getManifest().version;
    
    // 3. Compare and notify
    if (isNewerVersion(currentVersion, latestVersion)) {
      chrome.notifications.create('githubUpdatePrompt', {
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Extension Update Available',
        message: `Version ${latestVersion} is available on GitHub. You are using v${currentVersion}.`,
        buttons: [{ title: 'Download Update' }],
        priority: 1,
        requireInteraction: true
      });
    }
  } catch (error) {
    console.error('GitHub update check failed:', error);
  }
}

// Trigger the check on browser startup and periodically
chrome.runtime.onStartup.addListener(checkGitHubUpdate);
chrome.alarms.create('githubUpdateCheck', { periodInMinutes: 720 }); // Check every 12 hours
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'githubUpdateCheck') checkGitHubUpdate();
});

// Handle the user clicking the "Download Update" button
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (notificationId === 'githubUpdatePrompt' && buttonIndex === 0) {
    chrome.tabs.create({ url: GITHUB_DOWNLOAD_URL });
  }
});